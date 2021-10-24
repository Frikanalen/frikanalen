from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from fk.models import User


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = (
            'created',
            'key',
            'user',
        )


class NewUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    # These two need to be explitly included because
    # they are not required in the database model
    # but we want new users to have these values set
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    date_of_birth = serializers.DateField()

    def create(self, validated_data):
        user = get_user_model().objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            date_of_birth=validated_data['date_of_birth'])

        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'date_of_birth',
                  'password')

        write_only_fields = ('password', )


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    organization_roles = serializers.SerializerMethodField()

    def get_organization_roles(self, obj):
        editor_list = list(obj.editor.all())

        # A user may be both member and editor. As editor status supersedes
        # member status, if they are editor, we filter out the membership
        membership_list = list(
            filter(lambda x: x not in editor_list, obj.organization_set.all()))

        return list([{
            'role': 'editor',
            'organization_id': o.id,
            'organization_name': o.name
        } for o in editor_list] + [{
            'role': 'member',
            'organization_id': o.id,
            'organization_name': o.name
        } for o in membership_list])

    class Meta:
        model = User

        fields = ('id', 'email', 'first_name', 'last_name', 'date_joined',
                  'is_staff', 'date_of_birth', 'phone_number',
                  'organization_roles', 'password')

        read_only_fields = (
            'id',
            'email',
            'is_staff',
            'date_joined',
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(username=attrs['email'],
                            password=attrs['password'])

        if not user:
            raise serializers.ValidationError('Incorrect email or password.')

        if not user.is_active:
            raise serializers.ValidationError('User is disabled.')

        return {'user': user}
