from .models import Bulletin
from rest_framework import serializers

class BulletinSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        fields = ('heading', 'text', 'created')
        model = Bulletin
