# AUTH CRAP
from twisted.web import guard
from twisted.cred.portal import IRealm, Portal
from twisted.cred.checkers import InMemoryUsernamePasswordDatabaseDontUse
from twisted.web.resource import Resource, IResource
from zope.interface import implementer

@implementer(IRealm)
class SimpleRealm(object):
    """
    A realm which gives out L{GuardedResource} instances for authenticated
    users.
    """
    def __init__(self, resource):
    	self.resource = resource

    def requestAvatar(self, avatarId, mind, *interfaces):
        if IResource in interfaces:
            return IResource, self.resource, lambda: None
        raise NotImplementedError()

def simple_guard_resource(root):
	checkers = [InMemoryUsernamePasswordDatabaseDontUse(fk='test')]
	wrapper = guard.HTTPAuthSessionWrapper(
		Portal(SimpleRealm(root), checkers),
		[guard.DigestCredentialFactory('md5', 'frikanalen.no')])
	return wrapper

