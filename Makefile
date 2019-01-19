PYTHON=env/bin/python
PIP=env/bin/pip

project=frikanalen/frikanalen
pyreqs=packages/fkweb/requirements-dev.txt packages/fkupload/requirements.txt

docker:
	docker build -t ${project} .
docker_deploy: docker docker_push
	echo "Pushed to docker"
docker_run: docker
	docker run -p 8000:8000 ${project}
docker_push:
	docker push ${project}
env: $(pyreqs)
	python3 -m venv env
	for req in $(pyreqs); do \
          $(PIP) install -r $$req; \
        done

.PHONY=install test
install: env
	echo "Installed"
test: env
	$(PYTHON) packages/fkweb/manage.py test agenda create fk fkbeta  fknews fkprofile fkutils fkvod fkws
	$(PYTHON) packages/utils/test_*.py
	. env/bin/activate && packages/utils/run-move_and_process
	. env/bin/activate && packages/fkupload/test-fkupload
