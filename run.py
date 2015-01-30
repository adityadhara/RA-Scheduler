import os
import config, db_manage
from main import app

if not os.path.isfile(config.db_path):
    db_manage.db_create() #creates db if not exist
    db_manage.db_migrate() #creates first version migration - for rollbacks
#elif not is_database_up_to_date():
#    db_manage.db_migrate()

app.run(debug = True)
