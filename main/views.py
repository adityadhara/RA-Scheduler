from flask import render_template, flash, redirect, request, url_for, g
from flask.ext.login import current_user, logout_user, login_user
from flask.ext import login
from main import app, db, lm, oid
import models
import forms
import mocks

#pre-rendering
@app.before_request
def before_request():
    g.user = current_user

#views
@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html",
                           title='Main pages')

@login.login_required
@app.route('/manage_schedules')
def manage_schedules():
    return render_template("manage_schedules.html", title="Manage")

@login.login_required
@app.route('/view_schedules')
def view_schedules():
    mock_list = mocks.mock_schedule_list
    return render_template("view_schedules.html", title="View",
                           schedules=mock_list)

@login.login_required
@app.route('/settings')
def settings():
    #load user data and populate form
    #if regform.validate_on_submit():
        #process changed data
    return render_template("settings.html", title="Settings")

#login management
@lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

#OID stuff
@oid.after_login
def after_login(resp):
    if resp.email is None or resp.email == "":
        flash('Invalid login. Please try again.')
        return redirect(url_for('login'))
    user = models.User.query.filter_by(email=resp.email).first()
    if user is None:
        name = resp.email.split("@")[0]
        user = models.User(name=name, email=resp.email)
        db.session.add(user)
        db.session.commit()
    login_user(user)
    return redirect(request.args.get('next') or url_for('index'))

#login view
@app.route("/login")
@app.route("/login/<serv>", methods=['GET', 'POST'])
@oid.loginhandler
def login(serv=None):
    if g.user is not None and g.user.is_authenticated():
        return redirect(url_for('index'))
    
    buttonslist = [provider['name'] for provider in app.config['OPENID_PROVIDERS']]
    regform = forms.Registration()
    loginform = forms.Login()
    #if a openid service is selected
    if serv:
        if serv=="login":
            if loginform.validate_on_submit():
                tmp_data = {'email': loginform.email.data}
                user = models.User.query.filter_by(email=loginform.email.data).first()
                if user == None:
                    flash("Email not found, you need to register")
                    #TODO: automatically fill regform
                    #regform.populate_obj(tmp_data)
                    #goes to --default
                pwd_match = models.User_pwd.query.filter_by(user_id=user.id).first()
                match = (pwd_match.pwd_hash == loginform.pwd_hash.data)
                if not match:
                    flash("Password incorrect, try again")
                    #TODO: automatically fill loginform
                    #loginform.populate_obj(tmp_data)
                    #goes to --default
                login_user(user)
                return redirect(request.args.get('next') or url_for('index'))
        elif serv=="register":
            if regform.validate_on_submit():
                test = models.User.query.filter_by(email=regform.email.data).first()
                if test:
                    flash("Username " + str(test.email) + " already exists")
                else:
                    user = models.User(name=regform.name.data,
                                   email=regform.email.data)
                    db.session.add(user)
                    db.session.commit()
                    user = models.User.query.filter_by(email=regform.email.data).first()
                    pwd = models.User_pwd(user_id=user.id,
                                      pwd_hash=regform.pwd_hash.data)
                    db.session.add(pwd)
                    db.session.commit()
                    login_user(user)
                    return redirect(request.args.get('next') or url_for('index'))
        else:
            req = app.config['OPENID_PROVIDERS'][buttonslist.index(serv)]['url']
            return oid.try_login(req, ask_for=['email'])
    #--default
    return render_template("login.html", title="Login",
                           buttons=buttonslist,
                           login=loginform,
                           reg=regform)
