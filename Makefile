
unit-test:
	npm run test

coverage-test:
	test `npm run test:cov | grep "All files" | cut -d'|' -f4 | tr -d ' ' | cut -d'.' -f1` -gt 70

rds-endpoint:
	@aws rds describe-db-instances --query 'DBInstances[?DBName==`todo`].{Address:Endpoint.Address}' --region us-east-1 | grep Address | cut -d':' -f2 | tr -d ' \"' 

alb-endpoint:
	@aws elbv2 describe-load-balancers --query  'LoadBalancers[*].{DNSName:DNSName}' | grep DNSName | tr -d ' \"' | cut -d':' -f2

ec2-endpoint:
	@aws ec2 describe-instances   --query 'Reservations[].Instances[].[PublicIpAddress, Tags[?Value==`todo-monitoring`].Value[] | [0]]'   --output text 2>&1 | sed -e "s/todo-monitoring//g"

build-infrastructure:
	./infrastructure/infrastructure-builder.sh

delete-infrastructure-files:
	rm -r ./infrastructure/ecs-devops-todo-cdk

install-monitoring-server:
	./monitoring-scripts/installation-trigger.sh

build-image:
	docker build -t todo-app .

run-compose: build-image
	docker-compose up

