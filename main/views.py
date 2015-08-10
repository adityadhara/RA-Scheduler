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
                           title='Welcome')


@login.login_required
@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html",
                           title="Dashboard")


@app.route('/logout')
def logout():
    logout_user()
    flash("See you again!")
    return redirect(url_for('index'))


@app.route("/login")
@app.route("/login/<serv>", methods=['GET', 'POST'])
def login(serv=None):
    if current_user is not None and current_user.is_authenticated():
        return redirect(url_for('dashboard'))

    loginform = forms.Login()
    #if a openid service is selected
    if serv:
        if serv=="login":
            if loginform.validate_on_submit():
                try_login = attempt_login(loginform)
                if try_login:
                    return try_login
        else:
            flash("Invalid request")
    return render_template("login.html", title="Login",
                           login=loginform)


#login management
@lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))


def attempt_login(loginform):
    tmp_data = {'email': loginform.email.data}
    user = models.User.query.filter_by(email=loginform.email.data).first()
    if user == None:
        flash("Email or password incorrect, try again or register")
        return
    pwd_match = models.User_pwd.query.filter_by(user_id=user.id).first()
    hash = make_hash(loginform.pwd_hash.data, user.salt)
    match = (pwd_match.pwd_hash == hash)
    if not match:
        flash("Email or password incorrect, try again or register")
        return
    else:
        user.salt = make_salt()
        pwd_match.pwd_hash = make_hash(str(loginform.pwd_hash.data), str(user.salt))
        db.session.add(user)
        db.session.add(pwd_match)
        db.session.commit()
        login_user(user)
    return redirect(request.args.get('next') or url_for('index'))


def make_salt():
    return ("%08d" % (random.randint(1, 99999999)))


def make_hash(text, salt):
    return hashlib.sha512(text + salt).hexdigest()
