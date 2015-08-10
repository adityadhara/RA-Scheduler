'''
All from http://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iv-database
- used to create databases in run.py
- run db_migrate from python commandline if you want to record a rollback to the database
- others are extra - who knows if we'll need it
'''
from migrate.versioning import api
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, db_path
import os.path
import imp
from main import db

def compare_db_model():
    if os.path.isfile(db_path) and os.path.isdir(SQLALCHEMY_MIGRATE_REPO):
        truth = api.compare_model_to_db(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, db.metadata)
        return truth
    return None

def db_create():
    db.create_all()
    if not os.path.exists(SQLALCHEMY_MIGRATE_REPO):
        api.create(SQLALCHEMY_MIGRATE_REPO, 'database repository')
        api.version_control(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
        print "New db migration/version control folder created at:", SQLALCHEMY_MIGRATE_REPO
    else:
        api.version_control(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, api.version(SQLALCHEMY_MIGRATE_REPO))
    print "New database created at:", SQLALCHEMY_DATABASE_URI

def db_migrate():
    v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    migration = SQLALCHEMY_MIGRATE_REPO + ('/versions/%03d_migration.py' % (v+1))
    tmp_module = imp.new_module('old_model')
    old_model = api.create_model(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    exec(old_model, tmp_module.__dict__)
    script = api.make_update_script_for_model(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, tmp_module.meta, db.metadata)
    open(migration, "wt").write(script)
    api.upgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    print('New migration saved as ' + migration)
    print('Current database version: ' + str(v))
    
def db_upgrade():
    api.upgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    print('Current database version: ' + str(v))

def db_downgrade():
    v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    api.downgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, v - 1)
    v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
    print('Current database version: ' + str(v))