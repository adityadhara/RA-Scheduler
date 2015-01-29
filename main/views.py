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


