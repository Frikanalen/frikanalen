pyreqs=packages/fkweb/requirements-dev.txt packages/fkupload/requirements.txt

PYTHON=env/bin/python
PIP=env/bin/pip

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
	$(PYTHON) packages/fkprocess/test*.py
	. env/bin/activate && packages/utils/test_move_and_process.sh
	. env/bin/activate && packages/fkupload/test-fkupload
