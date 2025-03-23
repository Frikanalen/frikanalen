from rest_framework import serializers

from api.serializers import logger
from fk.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    editor_name = serializers.SerializerMethodField()
    editor_email = serializers.SerializerMethodField()
    editor_msisdn = serializers.SerializerMethodField()
    fkmember = serializers.BooleanField(read_only=True)

    def get_editor_email(self, obj):
        if obj.editor:
            return obj.editor.email
        return None

    def get_editor_msisdn(self, obj):
        if obj.editor:
            try:
                return obj.editor.phone_number.as_international
            except:
                return ""
        return None

    def get_editor_name(self, obj):
        if obj.editor:
            return obj.editor.first_name + " " + obj.editor.last_name
        logger.warning("Organization %d has no editor assigned" % (obj.id))
        return "Ingen redaktør!"

    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "homepage",
            "description",
            "postal_address",
            "street_address",
            "editor_id",
            "editor_name",
            "editor_email",
            "editor_msisdn",
            "fkmember",
        )
