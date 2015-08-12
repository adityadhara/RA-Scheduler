from main import app, google, lm, dbmng
from flask import request, url_for, redirect, session, flash
from flask.ext.login import login_user, logout_user, login_required


@app.route("/login")
def attempt_login():
    """
    This is the url that handles the Google login. Pretty straightforward - this redirects to the much too
    familiar webpage google has to select your emails etc.
    adds after login 'success' and 'failure' urls to session.

    :return: flask request after google's auth
    """
    session['after_login_success'] = request.args.get('next') or request.referrer or url_for('index')
    session['after_login_failure'] = url_for('index')
    return google.authorize(callback=url_for('handle_login', _external=True))


@app.route(app.config['GOOGLE_AUTHORIZED_URI'])
@google.authorized_handler
def handle_login(resp):
    """
    Once google responds from attempt_login, this does the heavy lifting:
    1 - determines the success and failure url from session
    2 - does magic stolen from https://github.com/mitsuhiko/flask-oauth/blob/master/example/google.py
    3 - logs in user through login manager

    :param resp:
    :return:
    """
    access_token = resp['access_token']
    if access_token is None:
        return redirect(url_for('index'))

    success_url = session.pop('after_login_success', url_for('index'))
    failure_url = session.pop('after_login_failure', url_for('index'))

    ### I'm not going to pretend like I know exactly what's happening here:
    from urllib2 import Request, urlopen, URLError
    import json

    headers = {'Authorization': 'OAuth '+access_token}
    req = Request('https://www.googleapis.com/oauth2/v1/userinfo',
                  None, headers)
    try:
        res = urlopen(req)
    except URLError, e:
        if hasattr(e, 'code') and e.code == 401:
            # Unauthorized - bad token
            return redirect(url_for('login'))
        flash(e)
        return redirect(failure_url)

    ### Stolen from https://github.com/mitsuhiko/flask-oauth/blob/master/example/google.py

    user_data = json.load(res)
    del user_data['id']     # Remove the id attribute - this confuses everything
    user = dbmng.get_user_by_email(user_data['email'])
    if user is None:
        user = dbmng.put_active_user(user_data)
    if not user.is_activated:
        user = dbmng.activate_user(user, user_data)
    login_user(user, remember=True)

    return redirect(success_url)


@lm.user_loader
def user_loader(id):
    """
    Utility function for login manager
    :param id:
    :return:
    """
    return dbmng.get_user(int(id))


@app.route('/logout')
@login_required
def logout_fn():
    """
    Once again - guess what this does
    :return:
    """
    logout_user()
    return redirect(url_for('index'))

