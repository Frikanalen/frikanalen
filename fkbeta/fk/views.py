from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            return HttpResponseRedirect("/")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {
        'form': form,
        })

from fk.forms import UserProfileForm, UserForm

def user_profile(request): 
    if request.method == 'POST':
        profile_form = UserProfileForm(request.POST, instance=request.user)
        user_form = UserForm(request.POST, instance=request.user)
        if profile_form.is_valid() and user_form.is_valid():
            user_form.save()
            profile_form.save()
    else:
        profile_form = UserProfileForm(instance=request.user)
        user_form = UserForm(instance=request.user)
    return render(request, "fk/profile.html", {'user_form': user_form, 'profile_form': profile_form})
