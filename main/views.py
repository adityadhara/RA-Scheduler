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

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route("/login")
@app.route("/login/<serv>", methods=['GET', 'POST'])
def login(serv=None):
    if g.user is not None and g.user.is_authenticated():
        return redirect(url_for('index'))
    
    regform = forms.Registration()
    loginform = forms.Login()
    #if a openid service is selected
    if serv:
        if serv=="login":
            if loginform.validate_on_submit():
                try_login = login(loginform)
                if try_login: return try_login
        elif serv=="register":
            if regform.validate_on_submit():
                try_reg = register(regform)
                if try_reg: return try_reg
        else:
            flash("Invalid request")
    #--default
    return render_template("login.html", title="Login",
                           buttons=buttonslist,
                           login=loginform,
                           reg=regform)
    
#login management
@lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))

def login(loginform):
    tmp_data = {'email': loginform.email.data}
    user = models.User.query.filter_by(email=loginform.email.data).first()
    if user == None:
        flash("Email not found, you need to register")
        #TODO: automatically fill regform
        #regform.populate_obj(tmp_data)
        return
    pwd_match = models.User_pwd.query.filter_by(user_id=user.id).first()
    match = (pwd_match.pwd_hash == loginform.pwd_hash.data)
    if not match:
        flash("Password incorrect, try again")
        #TODO: automatically fill loginform
        #loginform.populate_obj(tmp_data)
        return
    login_user(user)
    return redirect(request.args.get('next') or url_for('index'))

def register(regform):
    test = models.User.query.filter_by(email=regform.email.data).first()
    if test:
        flash("Username " + str(test.email) + " already exists")
        return
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
