from flask import render_template, flash, redirect, request, url_for, g
from flask.ext.login import current_user, logout_user, login_user
from flask.ext import login
from main import app, db, lm, oid
import models
import forms

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
    #make a mock schedule list
    schedule2 = {'status': 'pending',
                 'name': 'Warren Towers',
                 'start_date_str': 'February 15, 2015',
                 'end_date_str': 'March 20, 2015' }

    mock_schedule_list = [
        {
            'status': 'pending',
            'name': 'Warren Towers 1',
            'start_date_str': 'January 15, 2015',
            'end_date_str': 'March 20, 2015'
        },
        {
            'status': 'waiting',
            'name': 'Warren Towers 2',
            'start_date_str': 'February 15, 2015',
            'end_date_str': 'March 20, 2015'
        },
        {
            'status': 'active',
            'name': 'Warren Towers 3',
            'start_date_str': 'January 10, 2015',
            'end_date_str': 'March 20, 2015'
        },
        {
            'status': 'expired',
            'name': 'Warren Towers 4',
            'start_date_str': 'February 15, 2014',
            'end_date_str': 'March 20, 2014'
        },
    ]
    
    return render_template("view_schedules.html", title="View",
                           schedules=mock_schedule_list)



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
    user = User.query.filter_by(email=resp.email).first()
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
                match = models.User.query.filter(email=loginform.email.data).first()
                if match == None:
                    flash("Email not found, you need to register")
                    regform.populate_obj(tmp_data)
                    #goes to --default
                pwd_match = models.User_pwds.query.filter(user_id=match.id, pwd_hash=loginform.pass_hash.data).first()
                if pwd_match == None:
                    flash("Password incorrect, try again")
                    loginform.populate_obj(tmp_data)
                    #goes to --default
                login_user(match)
                return redirect(request.args.get('next') or url_for('index'))
        elif serv=="register":
            if regform.validate_on_submit():
                user = models.User(name=regform.name.data,
                                   email=regform.email.data,
                                   pwd=regform.pass_hash.data)
                db.session.add(user)
                db.session.commit()
            return redirect(request.args.get('next') or url_for('index'))
        else:
            req = app.config['OPENID_PROVIDERS'][buttonslist.index(serv)]['url']
            return oid.try_login(req, ask_for=['email'])
    #--default
    return render_template("login.html", title="Login",
                           buttons=buttonslist,
                           login=loginform,
                           reg=regform)
    
    
    
    
    
    
