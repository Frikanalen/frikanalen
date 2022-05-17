"""Development settings and globals."""

import dj_database_url

from .base import * # noqa # pylint: disable=unused-import disable=wildcard-import

FK_UPLOAD_URL = 'http://127.0.0.1:5000/upload'

# DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
TEMPLATES[0]['OPTIONS']['debug'] = DEBUG
# END DEBUG CONFIGURATION

# EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# END EMAIL CONFIGURATION


# DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES['default'] = dj_database_url.config(default='postgres://postgres:fk@localhost/fk', conn_max_age=600)
# END DATABASE CONFIGURATION


# TOOLBAR CONFIGURATION
# See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
INSTALLED_APPS += (
    # 'debug_toolbar',
)

# See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
INTERNAL_IPS = ('127.0.0.1',)

# See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
# MIDDLEWARE += (
#    'debug_toolbar.middleware.DebugToolbarMiddleware',
# )

# See: https://github.com/django-debug-toolbar/django-debug-toolbar#installation
# DEBUG_TOOLBAR_CONFIG = {
#    'SHOW_TEMPLATE_CONTEXT': True,
# }
# END TOOLBAR CONFIGURATION

ALLOWED_HOSTS = ["localhost"]

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        )
