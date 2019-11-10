from django.db import models
from django.forms import ModelForm
from django.contrib.auth.models import User


class UserForm(ModelForm):
    pass
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
