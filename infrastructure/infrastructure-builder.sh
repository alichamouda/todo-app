#!/bin/bash

read -p "AWS Region : " aws_region
read -p "AWS Account Id : " aws_account_id

rds_password_secret_arn="arn:aws:secretsmanager:us-east-1:500511893451:secret:rds\/todo-app-password-7sneN2"

npm i -g aws-cdk
mkdir ecs-devops-todo-cdk
cd ecs-devops-todo-cdk
cdk init --language python
python3 -m venv .venv
source .venv/bin/activate 
cp ../requirements.txt ./
pip3 install -r requirements.txt
cat ../ecs_devops_todo_cdk_stack.py > ./ecs_devops_todo_cdk/ecs_devops_todo_cdk_stack.py

cat <<EOF > app.py
#!/usr/bin/env python3

from aws_cdk import core

from ecs_devops_todo_cdk.ecs_devops_todo_cdk_stack import EcsDevopsTodoCdkStack

my_env = core.Environment(account="aws_account_id", region="aws_region")

app = core.App()
EcsDevopsTodoCdkStack(app, "ecs-devops-todo-app",env=my_env)

app.synth()
EOF

sed -i "s/aws_account_id/$aws_account_id/" app.py
sed -i "s/aws_region/$aws_region/" app.py
# sed -i "s/db_password_secret_here/$rds_password_secret_arn/" ./ecs_devops_todo_cdk/ecs_devops_todo_cdk_stack.py
cdk synth 
