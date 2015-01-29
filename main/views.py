from flask import render_template, flash, redirect
from main import app

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html",
                           title='Main pages')

@app.route('/manage_schedules')
def manage_schedules():
    return render_template("manage_schedules.html", title="Manage")

@app.route('/view_schedules')
def view_schedules():
    return render_template("view_schedules.html", title="View")

