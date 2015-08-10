from main import app, google, lm, dbmng
from flask import render_template


@app.route("/")
def index():
    """
    Take a wild guess at what this webpage is.
    """
    return render_template('index.html')


@app.route("/dashboard")
def dashboard():
    """
    This is the app that everyone sees! Everything is handled using JS and AJAX requests to "/api/..."
    (which are all handled by main.rest)
    :return:
    """
    return render_template("dashboard.html")