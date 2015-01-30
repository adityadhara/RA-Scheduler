import os
import config, db_manage
from main import app

#check db exists else create
if not os.path.isfile(config.db_path):
    db_manage.db_create() #creates db if not exist
    db_manage.db_migrate() #creates first version migration - for rollbacks

#check db up to date else migrate
result = db_manage.compare_db_model()
if result and result != "No schema diffs":
    print result
    db_manage.db_migrate()

#run app
app.run(debug = True)