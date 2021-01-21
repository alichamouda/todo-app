"""AWS CDK module to create ECS infrastructure"""
from aws_cdk import (core, aws_ecs as ecs, aws_ecr as ecr, aws_ec2 as ec2, aws_iam as iam, aws_elasticloadbalancingv2 as albv2, aws_rds as rds, aws_secretsmanager as smgr, aws_logs as logs)

class EcsDevopsTodoCdkStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)


        log_group = logs.LogGroup(self,'awslogs-todo-api',log_group_name='awslogs-todo-api')

        # Create the ECR Repository
        ecr_repository = ecr.Repository(self,
                                        "ecs-devops-todo-repository",
                                        repository_name="ecs-devops-todo-repository")

        # Create the ECS Cluster (and VPC)
        vpc = ec2.Vpc(self,
                      "ecs-devops-todo-vpc",
                      max_azs=3)

        secret = smgr.Secret.from_secret_complete_arn(self,'DBPassword', 
        secret_complete_arn='db_password_secret_here')

        credentials = rds.Credentials.from_password(username='rdsUsername',password=secret.secret_value)
        
        db_instance = rds.DatabaseInstance(
            self, "todo_rds_instance",
            credentials=credentials,
            database_name="todo",
            engine=rds.DatabaseInstanceEngine.mysql(
                version=rds.MysqlEngineVersion.VER_5_6
            ),
            vpc=vpc,
            port=3306,
            instance_type= ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE3,
                ec2.InstanceSize.SMALL,
            ),
            removal_policy=core.RemovalPolicy.DESTROY,
            deletion_protection=False
        )

        db_instance.connections.allow_default_port_from_any_ipv4()

        cluster = ecs.Cluster(self,
                              "ecs-devops-todo-cluster",
                              cluster_name="ecs-devops-todo-cluster",
                              vpc=vpc)



        # Create the ECS Task Definition with placeholder container (and named Task Execution IAM Role)
        execution_role = iam.Role(self,
                                  "ecs-devops-todo-execution-role",
                                  assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
                                  role_name="ecs-devops-todo-execution-role")
        execution_role.add_to_policy(iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            resources=["*"],
            actions=[
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
                ]
        ))
        task_definition = ecs.FargateTaskDefinition(self,
                                                    "ecs-devops-todo-task-definition",
                                                    execution_role=execution_role,
                                                    family="ecs-devops-todo-task-definition")
        container = task_definition.add_container(
            "ecs-devops-todo",
            image=ecs.ContainerImage.from_registry("amazon/amazon-ecs-sample")
        )

        port_mapping = ecs.PortMapping(container_port=3000, host_port=3000)
        container.add_port_mappings(port_mapping)

        # Create the ECS Service
        service = ecs.FargateService(self,
                                     "ecs-devops-todo-service",
                                     desired_count=3,
                                     cluster=cluster,
                                     task_definition=task_definition,
                                     service_name="ecs-devops-todo-service")
        
        loadbalancer = albv2.ApplicationLoadBalancer(self, 'LoadBalancerECS',vpc=vpc, internet_facing=True)


        my_target = albv2.ApplicationTargetGroup(
            self, "MyTargetGroup",
            port=3000,
            protocol=albv2.ApplicationProtocol.HTTP,
            targets=[service],
            vpc=vpc
        )

        listener = loadbalancer.add_listener("Listener", port=80, default_target_groups=[my_target])

        role = iam.Role(self, "InstanceSSM", assumed_by=iam.ServicePrincipal("ec2.amazonaws.com"))

        role.add_managed_policy(iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AmazonEC2RoleforSSM"))


        log_instance_sg = ec2.SecurityGroup(
            self,
            'Logging Security Group',
            vpc=vpc,
            allow_all_outbound=True,
            security_group_name='LoggingSG',
            description='Allow in http and ssh'
        )

        log_instance_sg.add_ingress_rule(
            peer = ec2.Peer.any_ipv4(),
            connection = ec2.Port.tcp(80)   
        )
        log_instance_sg.add_ingress_rule(
            peer = ec2.Peer.any_ipv4(),
            connection = ec2.Port.tcp(22)   
        )
        log_instance_sg.add_ingress_rule(
            peer = ec2.Peer.any_ipv4(),
            connection = ec2.Port.tcp(8080)   
        )
        # Instance
        instance = ec2.Instance(self, "Logging Instance",
            instance_type=ec2.InstanceType("t2.micro"),
            instance_name='todo-monitoring',
            key_name='ec2nkp',
            machine_image=ec2.MachineImage.generic_linux(ami_map={'us-east-1':'ami-011899242bb902164'}),
            vpc = vpc,
            role = role,
            vpc_subnets = ec2.SubnetSelection(subnet_type= ec2.SubnetType.PUBLIC),
            security_group=log_instance_sg
            )

        # asset = Asset(self, "Asset", path=os.path.join(dirname, "installation.sh"))
        # local_path = instance.user_data.add_s3_download_command(
        #     bucket=asset.bucket,
        #     bucket_key=asset.s3_object_key
        # )

        # # Userdata executes script from S3
        # instance.user_data.add_execute_file_command(
        #     file_path=local_path
        #     )
        # asset.grant_read(instance.role)