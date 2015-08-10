from main import db
from flask.ext.login import UserMixin

'''
for the following model classes, indexing is added only for
    obvious cases. Add indexing as required
Using team_user_map as a model is a peculiar case: we might
    run into some weird errors and workarounds. Look at sqlalchemy's
    doc and see, they "strongly recommend" we don't use models for
    mapping many-to-many relationships
    https://pythonhosted.org/Flask-SQLAlchemy/models.html#many-to-many-relationships
'''

shift_user_map = db.Table(
    'shift_user_map',
    db.Column('shift', db.Integer, db.ForeignKey('shift.shift_id')),
    db.Column('user', db.Integer, db.ForeignKey('user.user_id'))
)


class Team(db.Model):
    team_id = db.Column(db.Integer, primary_key=True)
    leader = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    name = db.Column(db.String(64))
    org = db.Column(db.String(64))
    desc = db.Column(db.String(200))

    team_member_mapping = db.relationship('Team_User_map', backref='team_bk', lazy='dynamic')
    shifts = db.relationship('Shift', backref='team_bk', lazy='dynamic')

    def __repr__(self):
        return "<Team #%r: %r>" % (self.team_id, self.name)


class Team_User_map(db.Model):
    tum_id = db.Column(db.Integer, primary_key=True)
    team = db.Column(db.Integer, db.ForeignKey('team.team_id'))
    user = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    shift_type = db.Column(db.Integer, db.ForeignKey('shift_type.st_id'))
    offset = db.Column(db.Integer)

    def __repr__(self):
        return "<Team-User map %r to %r>" % (self.user, self.team)


class User(UserMixin, db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    given_name = db.Column(db.String(64))
    family_name = db.Column(db.String(64))
    gender = db.Column(db.String(6))
    picture = db.Column(db.String(256))
    email = db.Column(db.String(256), nullable=True, unique=True)
    is_active = db.Column(db.Boolean, default=False)

    leader_of = db.relationship('Team', backref='leader_bk', lazy='dynamic')
    team_mappings = db.relationship('Team_User_map', backref='user_bk', lazy='dynamic')
    preferences = db.relationship('Preference', backref='user_bk', lazy='dynamic')
    shifts = db.relationship('Shift', secondary=shift_user_map,
                             backref=db.backref('users_bk', lazy='dynamic'))

    def __repr__(self):
        prefix = "Mr." if self.gender == 'male' else "Ms."
        return "<User #%r, %r %r %r>" % (self.user_id, prefix, self.given_name, self.family_name)


class Shift(db.Model):
    shift_id = db.Column(db.Integer, primary_key=True)
    team = db.Column(db.Integer, db.ForeignKey('team.team_id'))
    start_dt = db.Column(db.DateTime)
    end_dt = db.Column(db.DateTime)
    shift_type = db.Column(db.Integer, db.ForeignKey('shift_type.st_id'))

    users = db.relationship('User', secondary=shift_user_map,
                             backref=db.backref('shifts_bk', lazy='dynamic'))

    def __repr__(self):
        return "<Shift from %r to %r>" % (self.start_dt, self.end_dt)


class Shift_type(db.Model):
    st_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))

    shifts = db.relationship('Shift', backref='shift_type_bk', lazy='dynamic')
    team_user_mappings = db.relationship('Team_User_map', backref='shift_type_bk', lazy='dynamic')

    def __repr__(self):
        return "<Shift type %r>" % (self.st_id)


class Preference(db.Model):
    pref_id = db.Column(db.Integer, primary_key=True)
    preference = db.Column(db.String(256))
    user = db.Column(db.Integer, db.ForeignKey('user.user_id'))

    def __repr__(self):
        return "<Preference %r by user %r>" % (self.preference, self.user)