from django.apps import AppConfig


class FrikanalenAppConfig(AppConfig):
    name = "fkweb"

    def ready(self):
        # Register the signal receivers
        from . import signals

        signals  # Fooling flake8
