from flask import render_template, flash, redirect, request, url_for, g
from flask.ext.login import current_user, logout_user, login_user
from flask.ext import login
from main import app, db, lm
import models, forms
import hashlib, random, string
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
    mock_list = mocks.mock_schedule_list
    return render_template("manage_schedules.html", title="Manage",
                           schedules=mock_list)

@login.login_required
@app.route('/view_schedules')
def view_schedules():
    mock_list = mocks.mock_schedule_list
    return render_template("view_schedules.html", title="View",
                           schedules=mock_list)

@login.login_required
@app.route('/create_schedule')
def create_schedule():
    #TODO: Currently this is just the UI -- change later. 
    return render_template("create_schedule.html", title="View")

@login.login_required
@app.route('/update_preferences')
def update_preferences():
    #TODO: Currently this is just the UI -- change later. 
    return render_template("update_preferences.html", title="View")

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
                try_login = attempt_login(loginform)
                if try_login: return try_login
        elif serv=="register":
            if regform.validate_on_submit():
                try_reg = attempt_register(regform)
                if try_reg: return try_reg
        else:
            flash("Invalid request")
    #--default
    return render_template("login.html", title="Login",
                           login=loginform,
                           reg=regform)
    
#login management
@lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))

def attempt_login(loginform):
    tmp_data = {'email': loginform.email.data}
    user = models.User.query.filter_by(email=loginform.email.data).first()
    if user == None:
        flash("Email not found, you need to register")
        return
    pwd_match = models.User_pwd.query.filter_by(user_id=user.id).first()
    hash = hashlib.sha512(loginform.pwd_hash.data + user.salt).hexdigest()
    match = (pwd_match.pwd_hash == hash)
    if not match:
        flash("Password incorrect, try again")
    else:
        user.salt = make_salt()
        pwd_match.pwd_hash = make_hash(str(loginform.pwd_hash.data) + str(user.salt))
        db.session.add(user)
        db.session.add(pwd_match)
        db.session.commit()
        login_user(user)
    return redirect(request.args.get('next') or url_for('index'))

def attempt_register(regform):
    test = models.User.query.filter_by(email=regform.email.data).first()
    if test:
        flash("Username " + str(test.email) + " already exists")
        return
    else:
        user = models.User(name=string.capwords(regform.name.data),
                       email=regform.email.data,
                       salt=make_salt())
        db.session.add(user)
        db.session.commit()
        hash = make_hash(str(regform.pwd_hash.data) + str(user.salt))
        pwd = models.User_pwd(user_id=user.id, #id available because commit made
                          pwd_hash=hash)
        db.session.add(pwd)
        db.session.commit()
        login_user(user)
        return redirect(request.args.get('next') or url_for('index'))

def make_salt():
    return ("%08d" % (random.randint(1, 99999999)))

def make_hash(text):
    return hashlib.sha512(text).hexdigest()