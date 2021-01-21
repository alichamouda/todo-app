#!/bin/bash

read -sp "Grafana password : " GRAFANA_PASSWORD 
echo ""
read -sp "Grafana Email : " GRAFANA_EMAIL
echo ""
read -sp "Grafana Email Password : " GRAFANA_EMAIL_PASSWORD 
echo ""


## Loop until LB and EC2 instance are created
instance_loaded=$(aws ec2 describe-instances --region us-east-1  --query 'Reservations[].Instances[].[PublicIpAddress, Tags[?Value==`todo-monitoring`].Value[] | [0]]'   --output text 2>&1 | sed -e "s/todo-monitoring//g" | tr -d "[:space:]")
while [ "${instance_loaded^^}" = "NONE" ] || [ "${instance_loaded^^}" = "" ]; 
  do sleep 5;
    echo "Waiting for EC2 to be set ..."
  instance_loaded=$(aws ec2 describe-instances   --query 'Reservations[].Instances[].[PublicIpAddress, Tags[?Value==`todo-monitoring`].Value[] | [0]]'   --output text 2>&1 | sed -e "s/todo-monitoring//g" | tr -d "[:space:]")
done;

instance_loaded=$( echo $instance_loaded | grep -Pom 1 '[0-9.]{7,15}')
echo "EC2 Public IP: $instance_loaded"

elb_instance=$(aws elbv2 describe-load-balancers --query  'LoadBalancers[*].{DNSName:DNSName}' | grep DNSName | tr -d ' \"' | cut -d':' -f2)
while [ "${elb_instance^^}" = "" ]; 
  do sleep 5; 
  echo "Waiting for ELB to be set ..."
  elb_instance=$(aws elbv2 describe-load-balancers --query  'LoadBalancers[*].{DNSName:DNSName}' | grep DNSName | tr -d ' \"' | cut -d':' -f2)
done;


echo "ELB DNS: $elb_instance"

echo "#!/bin/bash" > configec2.sh

## Copy Grafana files to script for transfer
echo "cat <<EOF > dashboard.json" >> configec2.sh
cat grafana/dashboard.json >> configec2.sh
echo "EOF" >> configec2.sh

echo "cat <<EOF > datasource.json" >> configec2.sh
cat grafana/datasource.json >> configec2.sh
echo "EOF" >> configec2.sh

echo "cat <<EOF > alert-conf.json" >> configec2.sh
cat grafana/alert-conf.json >> configec2.sh
echo "EOF" >> configec2.sh
sleep 2;
## Copy Prometheus files to script for transfer

echo "cat <<EOF > prometheus.service" >> configec2.sh
cat prometheus/prometheus.service >> configec2.sh
echo "EOF" >> configec2.sh

echo "cat <<EOF > prometheus.yml" >> configec2.sh
cat prometheus/prometheus.yml >> configec2.sh
echo "EOF" >> configec2.sh


## Insert installation template script inside final script
cat installation.sh.template >> configec2.sh

## Insert variable values inside script
sed -i "s/GRAFANA_PASSWORD=/GRAFANA_PASSWORD=$GRAFANA_PASSWORD/" configec2.sh
sed -i "s/GRAFANA_EMAIL=/GRAFANA_EMAIL=$GRAFANA_EMAIL/" configec2.sh
sed -i "s/GRAFANA_EMAIL_PASSWORD=/GRAFANA_EMAIL_PASSWORD=$GRAFANA_EMAIL_PASSWORD/" configec2.sh
sed -i "s/prometheus-target-1/$elb_instance/" configec2.sh
chmod +x configec2.sh

ssh -i ~/Downloads/ec2nkp.pem "ubuntu@$instance_loaded" 'bash -s' < configec2.sh