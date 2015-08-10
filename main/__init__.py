from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.restful import Api
from flask.ext.oauth import OAuth


"""
Creates 'app' object which is a full flask application with SQLAlchemy database, database management package (dbmng),
OAuth with google, login manager and restful endpoints.

The flask/server part only handles provision of static objects such as html/js data, and AJAX based interaction with
the SQLAlchemy database.
"""

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
from main import models
from main import dbmng

#OAuth
oauth = OAuth()
google = oauth.remote_app('google',
                          base_url='https://www.google.com/accounts/',
                          authorize_url='https://accounts.google.com/o/oauth2/auth',
                          request_token_url=None,
                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
                                                'response_type': 'code'},
                          access_token_url='https://accounts.google.com/o/oauth2/token',
                          access_token_method='POST',
                          access_token_params={'grant_type': 'authorization_code'},
                          consumer_key=app.config['GOOGLE_CLIENT_ID'],
                          consumer_secret=app.config['GOOGLE_CLIENT_SECRET'])

#login manager
lm = LoginManager()
lm.init_app(app)
from main import views

#Flask restful
rest_api = Api(app)
from main import rest
