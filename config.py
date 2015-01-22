import os
basedir = os.path.abspath(os.path.dirname(__file__))

db_path = os.path.join(basedir, 'main.db')
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + db_path
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

WTF_CSRF_ENABLED = True
SECRET_KEY = 'who-knows'