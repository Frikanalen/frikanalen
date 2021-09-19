"""Production settings and globals."""


from os import environ
import dj_database_url

from .base import *

# Normally you should not import ANYTHING from Django directly
# into your settings, but ImproperlyConfigured is an exception.
from django.core.exceptions import ImproperlyConfigured


def get_env_setting(setting):
    """ Get the environment setting or return exception """
    try:
        return environ[setting]
    except KeyError:
        error_msg = "Set the %s env variable" % setting
        raise ImproperlyConfigured(error_msg)

########## HOST CONFIGURATION
# See: https://docs.djangoproject.com/en/1.5/releases/1.5/#allowed-hosts-required-in-production
ALLOWED_HOSTS = get_env_setting('ALLOWED_HOSTS').split(',')
DEFAULT_FROM_EMAIL = 'Frikanalen <noreply@frikanalen.no>'

########## END HOST CONFIGURATION

########## EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_HOST = get_env_setting('SMTP_SERVER')
EMAIL_USE_TLS = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_SUBJECT_PREFIX = '[%s] ' % SITE_NAME
SERVER_EMAIL = DEFAULT_FROM_EMAIL
########## END EMAIL CONFIGURATION

########## DATABASE CONFIGURATION
DATABASES['default'] = dj_database_url.config(conn_max_age=600)

########## END DATABASE CONFIGURATION


########## CACHE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#caches
# FIXME: The cache clearing in schedule will probably clear the entire cache
CACHES = {
        'schedule': {
            'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
            'LOCATION': [ 'memcached:11211', ],
            'TIMEOUT': None,
            },
        'default': {
            'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
            'LOCATION': [ 'memcached:11211', ],
            }
        }
########## END CACHE CONFIGURATION


########## SECRET CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = get_env_setting('SECRET_KEY')
########## END SECRET CONFIGURATION
