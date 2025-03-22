from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _
from phonenumber_field.modelfields import PhoneNumberField
from UserManager import UserManager


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address', max_length=254, unique=True)
    """User email and username."""
    USERNAME_FIELD = 'email'

    first_name = models.CharField(
        blank=True, max_length=30, verbose_name='first name')
    """First/given name"""

    last_name = models.CharField(
        blank=True, max_length=30, verbose_name='last name')
    """Last/family name"""

    is_active = models.BooleanField(
        default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')

    is_superuser = models.BooleanField(
        default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='admin status')

    identity_confirmed = models.BooleanField(
        default=False, help_text='Whether the identity of this user has been confirmed by Frikanalen management.', verbose_name='identity confirmed')

    phone_number = PhoneNumberField(
        blank=True, help_text='Phone number at which this user can be reached', verbose_name='phone number')

    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    date_of_birth = models.DateField(blank=True, null=True)

    objects = UserManager()

    REQUIRED_FIELDS = ['date_of_birth']

    def __str__(self):
        return str(self.email)

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_superuser

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return self.is_superuser

    def get_short_name(self):
        return self.email

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_superuser
