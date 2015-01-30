from flask.ext.wtf import Form
import wtforms
from wtforms import validators

#we may not use this or registration if we are only using OpenID
class Login(Form):
    email = wtforms.StringField("Email (Username)", [validators.DataRequired(), validators.Email()])
    pass_hash = wtforms.HiddenField("pwdhidden", [validators.DataRequired()], id="pwd_secret")
    
class Registration(Login):
    #validator:
    def check_same(form, field):
        if field.data != form.password.data:
            raise validators.ValidationError("Password is not the same")
    
    name = wtforms.StringField("Full name", [validators.DataRequired()])
    pass2_hash = wtforms.HiddenField("pwd2hidden", [validators.DataRequired()], id="pwd2_secret")

#other forms
class CreateTeam(Form):
    name = wtforms.StringField("Team Name", [validators.DataRequired()])
    org = wtforms.StringField("Organization")
    
class EnterPreference(Form):
    preference = wtforms.StringField("Preference", [validators.DataRequired()])

class AddSingleUser(Form):
    email = wtforms.StringField("Email", [validators.DataRequired(), validators.Email()])
    
class AddUsersFile(Form):
    file = wtforms.FileField("CSV Team Data", [validators.DataRequired()])
    
class AddOffset(Form):
    eligible_types = wtforms.SelectMultipleField([])

