
unit-test:
	npm run test

coverage-test:
	test `npm run test:cov | grep "All files" | cut -d'|' -f4 | tr -d ' ' | cut -d'.' -f1` -gt 70

rds-endpoint:
	aws rds describe-db-instances --query 'DBInstances[?DBName==`todo`].{Address:Endpoint.Address}' --region us-east-1 | grep Address | cut -d':' -f2 | tr -d ' \"' 

build-image:
	docker build -t todo-app .

run-compose: build-image
	docker-compose up

