from django.db import models
from django.forms import ModelForm
from django.contrib.auth.models import User

from fk.models import UserProfile

class UserProfileForm(ModelForm):
    pass
    class Meta:
        model = UserProfile
        exclude = ['user', 'legacy_username']

class UserForm(ModelForm):
    pass
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
