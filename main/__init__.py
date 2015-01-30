from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.openid import OpenID
from config import basedir
import os

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

#login manager
lm = LoginManager()
lm.init_app(app)

#oid
oid = OpenID(app, os.path.join(basedir, 'tmp'))

from main import views, models