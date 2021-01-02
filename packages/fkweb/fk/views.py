# -*- coding: utf-8 -*-
import json

from django import forms
from django.contrib.auth import login, authenticate
from django.core.mail import mail_managers
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render
from django.utils import timezone
from django.utils.translation import ugettext as _

from fk.forms import UserCreationForm, UserForm
from fk.models import Organization
from fkws.serializers import UserSerializer


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            new_user.refresh_from_db()
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(email=new_user.email, password=raw_password)
            login(request, user)
            mail_managers("Ny brukar %s" % new_user.email, "Sjekk database for ny brukar\n" +
                    json.dumps(UserSerializer(new_user).data), fail_silently=True)
            return HttpResponseRedirect("/")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", { 'form': form })


def member_organizations_list(request):
    members = Organization.objects.filter(fkmember=True).order_by('name')
    return render(
        request,
        'fk/member_organizations_list.html',
        {
            'members': members,
            'title': _('Member organizations'),
        })
