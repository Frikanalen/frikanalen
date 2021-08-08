import os

def get_connstring():
    db = {
        'user': os.environ.get('DATABASE_USER', None),
        'password': os.environ.get('DATABASE_PASSWORD', None),
        'name': os.environ.get('DATABASE_NAME', None),
        'host': os.environ.get('DATABASE_HOST', None)
    }

    for (key, value) in db.items():
        if value is None:
            raise KeyError(f"Could not connect to database; DATABASE_{key.upper()} not set!")

    return(f"dbname={db['name']} password={db['password']} host={db['host']} user={db['user']}")

# Make sure enviroments are set, so we fail on start if not
try:
    get_connstring()
except KeyError:
    raise
    sys,exit(1)
