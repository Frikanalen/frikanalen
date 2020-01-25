pyreqs=packages/fkweb/requirements-dev.txt packages/fkupload/requirements.txt packages/fkprocess/requirements.txt

env = env/bin/activate
ifneq ("$(wildcard $(env))","")
    VENV = . $(env) &&
else
    VENV = true &&
endif

env: $(pyreqs)
	python3 -m venv env

.PHONY=requirements test
requirements:
	for req in $(pyreqs); do \
	    $(VENV) pip install -r $$req; \
	done

test:
	$(VENV) packages/fkweb/manage.py test agenda create fk fkbeta fkvod fkws
	$(VENV) python packages/fkprocess/test*.py
	$(VENV) packages/fkprocess/test_move_and_process.sh
	$(VENV) packages/fkupload/test-fkupload
