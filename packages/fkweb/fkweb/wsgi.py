"""
WSGI config for fkweb project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.

Usually you will have the standard Django WSGI application here, but it also
might make sense to replace the whole Django WSGI application with a custom one
that later delegates to the Django one. For example, you could introduce WSGI
middleware here, or combine a Django application with an application of another
framework.

"""

import os
import sys
from os.path import abspath, dirname

SITE_ROOT = dirname(dirname(abspath(__file__)))

# We defer to a DJANGO_SETTINGS_MODULE already in the environment. This breaks
# if running multiple sites in the same mod_wsgi process. To fix this, use
# mod_wsgi daemon mode with each site in its own daemon process, or use
# os.environ["DJANGO_SETTINGS_MODULE"] = "jajaja.settings"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fkweb.settings.production")


def application(environ, start_response):
    # pass the WSGI environment variables on through to os.environ
    for var in ["SECRET_KEY"]:
        if var in environ:
            os.environ[var] = environ[var]
    if "EXTRA_SITE_DIR" in environ:
        import site

        site.addsitedir(environ["EXTRA_SITE_DIR"])
    # Avoid repeatedly adding the when debugging
    if not SITE_ROOT in sys.path:
        sys.path.append(SITE_ROOT)

    from django.core.wsgi import get_wsgi_application

    _application = get_wsgi_application()
    return _application(environ, start_response)
