project=frikanalen/frikanalen

docker:
	docker build -t ${project} .
docker_deploy: docker docker_push
	echo "Pushed to docker"
docker_run: docker
	docker run -p 8000:8000 ${project}
docker_push:
	docker push ${project}
