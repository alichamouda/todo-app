
unit-test:
	npm run test

coverage-test:
	test `npm run test:cov | grep "All files" | cut -d'|' -f4 | tr -d ' ' | cut -d'.' -f1` -gt 70

build-image:
	docker build -t todo-app .

run-compose: build-image
	docker-compose up

