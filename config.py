import os
basedir = os.path.abspath(os.path.dirname(__file__))

db_path = os.path.join(basedir, 'main.db')
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + db_path
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

WTF_CSRF_ENABLED = True
SECRET_KEY = 'who-knows'

GOOGLE_CLIENT_ID = "17674921736-n0e6fsnjddenub421kg8nkkic6rkevri.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "Gbij_yGnEiiEQm_0LZE0zSzQ"
GOOGLE_AUTHORIZED_URI = "/authorize"
