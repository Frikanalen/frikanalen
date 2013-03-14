# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from zope.interface import implements
from twisted.python import failure, log
from twisted.cred import portal, checkers, error, credentials
from twisted.internet import defer
from django.contrib.auth.models import User, check_password

class DjangoAuthChecker:
    implements(checkers.ICredentialsChecker)
    credentialInterfaces = (credentials.IUsernamePassword,
                            credentials.IUsernameHashedPassword)

    def _passwordMatch(self, matched, user):
        if matched:
            return user
        else:
            return failure.Failure(error.UnauthorizedLogin())

    def requestAvatarId(self, credentials):
        try:
            user = User.objects.get(username=credentials.username)
            if not user.is_active:
                return defer.fail(error.UnauthorizedLogin())    
            return defer.maybeDeferred(
                check_password,
                credentials.password,
                user.password).addCallback(self._passwordMatch, user)
        except User.DoesNotExist:
            return defer.fail(error.UnauthorizedLogin())

 