from .models import Bulletin
from rest_framework import serializers


class BulletinSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        fields = ("id", "heading", "text", "created")
        model = Bulletin
