from main import db
from flask.ext.login import UserMixin

'''
for the following model classes, indexing is added only for
    obvious cases. Add indexing as required
Using team_member_map as a model is a peculiar case: we might
    run into some weird errors and workarounds. Look at sqlalchemy's
    doc and see, they "strongly recommend" we don't use models for
    mapping many-to-many relationships
    https://pythonhosted.org/Flask-SQLAlchemy/models.html#many-to-many-relationships
'''

shift_user_map = db.Table(
    'shift_user_map',
    db.Column('shift', db.Integer, db.ForeignKey('shift.id')),
    db.Column('user', db.Integer, db.ForeignKey('user.id'))
)


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    leader = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(64))
    org = db.Column(db.String(64))
    desc = db.Column(db.String(200))

    team_member_mapping = db.relationship('Team_Member_map', backref='team_bk', lazy='dynamic')
    calendars = db.relationship('Calendar', backref='team_bk', lazy='dynamic')

    def __repr__(self):
        return "<Team #%r: %r>" % (self.id, self.name)


class Team_Member_map(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    member_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    offset = db.Column(db.Integer)

    team = db.relationship('Team', backref='mapping_bk')
    member = db.relationship('User', backref='mapping_bk')

    def __repr__(self):
        return "<Team-Member map %r to %r>" % (self.member, self.team)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    given_name = db.Column(db.String(64))
    family_name = db.Column(db.String(64))
    gender = db.Column(db.String(6))
    picture = db.Column(db.String(256))
    email = db.Column(db.String(256), nullable=True, unique=True)
    is_activated = db.Column(db.Boolean, default=False)

    leader_of = db.relationship('Team', backref='leader_bk', lazy='dynamic')
    team_mappings = db.relationship('Team_Member_map', backref='user_bk', lazy='dynamic')
    preferences = db.relationship('Preference', backref='user_bk', lazy='dynamic')
    shifts = db.relationship('Shift', secondary=shift_user_map,
                             backref=db.backref('user_bk', lazy='dynamic'))

    def __repr__(self):
        prefix = "Mr." if self.gender == 'male' else "Ms."
        return "<User #%r, %r %r %r, %r>" % (self.id, prefix, self.given_name, self.family_name, self.email)


class Calendar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))
    desc = db.Column(db.String(256))
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    start_dt = db.Column(db.DateTime)
    end_dt = db.Column(db.DateTime)

    shift_types = db.relationship('Shift_type', backref='calendar_bk', lazy='dynamic')
    shifts = db.relationship('Shift', backref='calendar_bk', lazy='dynamic')


class Shift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    calendar = db.Column(db.Integer, db.ForeignKey('calendar.id'))
    start_dt = db.Column(db.DateTime)
    end_dt = db.Column(db.DateTime)
    shift_type = db.Column(db.Integer, db.ForeignKey('shift_type.id'))

    members_on_shift = db.relationship('User', secondary=shift_user_map,
                                       backref=db.backref('shifts_bk', lazy='dynamic'))

    def __repr__(self):
        return "<Shift from %r to %r>" % (self.start_dt, self.end_dt)


class Shift_type(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    calendar = db.Column(db.Integer, db.ForeignKey('calendar.id'))
    color = db.Column(db.String(6))
    name = db.Column(db.String(32))

    shifts = db.relationship('Shift', backref='shift_type_bk', lazy='dynamic')

    def __repr__(self):
        return "<Shift type %r>" % (self.id)


class Preference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    preference = db.Column(db.String(256))
    member = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return "<Preference %r by member %r>" % (self.preference, self.member)