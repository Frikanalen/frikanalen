from django.contrib.auth import forms as auth_forms
from django.db import models
from django.forms import ModelForm

from fk.models import User


class UserForm(ModelForm):
    pass
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class UserCreationForm(auth_forms.UserCreationForm):
    pass
    class Meta:
        model = User
        fields = ("username",)
        field_classes = {'username': auth_forms.UsernameField}
