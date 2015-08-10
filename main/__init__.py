from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.restful import Api

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
from main import models

#login manager
lm = LoginManager()
lm.init_app(app)
from main import views

#Flask restful
rest_api = Api(app)
from main import rest
