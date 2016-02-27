from main import rest_api, models, db, dbmng
from flask import jsonify, request
from flask.ext.restful import Resource, abort, reqparse
from flask.ext.login import login_required, current_user


@rest_api.resource("/api/team/<int:team_id>", '/api/team')
class RESTTeamCommitHandler(Resource):
    @login_required
    def get(self, team_id=None):
        """
        get request handler for teams

        :param team_id: optional, id for team to get
        :return: a json object with all requested team data
        """
        ret_val = {
            'teams': []
        }

        if team_id is None:
            # return all teams relevant to current_user
            leader_teams_iterable = models.Team.query.filter_by(leader=current_user.email).all()
            team_member_mapping = models.Team_Member_map.query.filter_by(member_id=current_user.id).all()
            for team in leader_teams_iterable:
                ret_val['teams'].append(dbmng.get_team_data(team))
            for team_mapping in team_member_mapping:
                ret_val['teams'].append(dbmng.get_team_data(team_mapping.team))

        else:
            # return the specified team
            try_team = models.Team.query.filter_by(id=team_id)
            if try_team.leader != current_user.email:
                abort(401)
            else:
                ret_val['teams'].append(dbmng.get_team_data(try_team))

        return jsonify(ret_val)

    @login_required
    def put(self, team_id=None):
        """
        put request handler for teams

        :param team_id: should be None
        :return: dict with newly created team, and a valid team.id
        """
        new_team = request.json['data']
        if team_id is not None:
            abort(400)  # You can only use put to make new teams

        if new_team['leader'] != current_user.email:
            abort(401)  # this bitch is unauthorized

        created_team = dbmng.put_team_with_data(new_team)

        return jsonify(created_team)

    @login_required
    def post(self, team_id=None):
        """
        post request handler for teams

        :param team_id:
        :return:
        """
        post_team = request.json['data']
        if post_team['leader'] != current_user.email:
            abort(401)

        # do stuff

        return jsonify(post_team)

    @login_required
    def delete(self, team_id=None):
        dying_team = {}
        if team_id is not None:
            dying_team = models.Team.query.get(team_id)
        elif 'data' in request.json:
            dying_team = request.json['data']
        else:
            abort(400)

        if dying_team['leader'] != current_user.email:
            return abort(401)

        # Cleanly remove team and all connected calendars etc.

        return jsonify({})

