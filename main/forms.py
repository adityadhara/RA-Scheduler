from flask.ext.wtf import Form
import wtforms
from wtforms import validators

#we may not use this or registration if we are only using OpenID
class Login(Form):
    email = wtforms.StringField("Email (Username)", [validators.DataRequired(message="Username missing"), validators.Email(message="Email address invalid")])
    pwd_hash = wtforms.HiddenField("pwd_secret", [validators.DataRequired(message="Password missing")], id="pwd_secret")
    
class Registration(Login):
    name = wtforms.StringField("Full name", [validators.DataRequired(message="Name required")])
    pwd2_hash = wtforms.HiddenField("pwd2_secret", [validators.DataRequired(message="Repeat password"), validators.EqualTo('pwd_hash', "Passwords must be the same")], id="pwd2_secret")

class Profile(Registration):
    #new validator for pwd2_hash 
    def check_equal_if_pwd(form, field):
        if form.pwd_hash.data and form.pwd_hash.data != "":
            if form.pwd_hash.data != field.data:
                raise validators.ValidationError("Passwords must be the same")
    
    #modify pwd_hash and pwd2_hash
    pwd_hash = wtforms.HiddenField("pwd_secret", [validators.Optional()], id="pwd_secret")
    pwd2_hash = wtforms.HiddenField("pwd2_secret", [check_equal_if_pwd], id="pwd2_secret")
    
    old_pwd_hash = wtforms.HiddenField("old_pwd_secret", [validators.DataRequired(message="Current password required")], id="old_pwd_secret")
    
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

