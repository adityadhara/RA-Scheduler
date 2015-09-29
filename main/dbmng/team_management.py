from main import db, models


def get_team_data(team):
    """
    Creates and returns a dict with all team attributes. Also, all members of the team
    are determined by a ret_dict.members attribute which is a list of member emails.

    :param team: models.Team object
    :return: dict of all relevant values
    """
    ret = {c.name: getattr(team, c.name) for c in team.__table__.columns}
    ret['leader'] = models.User.query.get(ret['leader']).email  # replace leader value with actual email address
    ret['members'] = []
    for member_mapping in team.team_member_mapping:
        ret['members'].append(member_mapping.member.email)

    return ret


def put_team_with_data(team_data):
    """
    Creates a team in the database as well as any users that don't already exist. Then for each user,
    a team user mapping is created. Then team_data's id key is updated to the new team's id, and
    then returned.

    :param team_data: dict of team data
    :return: team_data with id attribute updated
    """
    team = models.Team()

    # identify leader
    leader_user = models.User.query.filter_by(email=team_data['leader']).first()
    team_data['leader'] = leader_user.id    # that way leader key updates team's leader with an id in next segment

    for key in team.__table__.columns:
        if key.name is not 'id':     # id should be an automatically generated value
            setattr(team, key.name, team_data[key.name])
    db.session.add(team)

    members = []
    for email in team_data['members']:
        existing_user = models.User.query.filter_by(email=email).first()
        if existing_user is None:
            new_user = models.User(email=email)
            db.session.add(new_user)
            members.append(new_user)
        else:
            members.append(existing_user)

    db.session.commit()     # commit created models

    for member in members:
        new_mapping = models.Team_Member_map(team_id=team.id, member_id=member.id, offset=0)
        db.session.add(new_mapping)

    db.session.commit()     # commit created mappings

    # update team_data's id key
    team_data['id'] = team.id
    team_data['leader'] = leader_user.email

    return team_data

