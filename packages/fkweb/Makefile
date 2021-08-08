project=frikanalen/django-backend

docker:
	docker build -t ${project} .
docker_deploy: docker docker_push
	echo "Pushed to docker"
docker_run: docker
	docker run -p 8000:8000 ${project}
docker_push:
	docker push ${project}
get_secrets:
	echo "DATABASE_NAME=fkweb" > .env
	echo "DATABASE_USER=fkweb" >> .env
	echo "DATABASE_HOST=database-api.default.svc.cluster.local" >> .env
	echo -n "DATABASE_PASS=" >> .env
	kubectl get secrets/database-api-secret --template={{.data.POSTGRES_PASSWORD}} | base64 --decode >> .env
	echo >> .env
