import psycopg2, psycopg2.extras, psycopg2.extensions
psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)
psycopg2.extensions.register_type(psycopg2.extensions.UNICODEARRAY)

from psycopg2 import *
from psycopg2 import _psycopg as _2psycopg
from psycopg2.extensions import connection as _2connection
from psycopg2.extras import DictCursor

del connect
def connect(*args, **kwargs):
    kwargs["connection_factory"] = connection
    return _2psycopg._connect(*args, **kwargs)

class connection(_2connection):
    def cursor(self):
        return _2connection.cursor(self, cursor_factory=DictCursor)
