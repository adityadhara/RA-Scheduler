app.factory('TeamService', ['RESTApi', function(RESTApi) {

    var log = Logger('TeamService', true);

    var teams = {};
    var leader = "";
    var current_team = 0;   // 0 signifies a team without an id. All other teams are referred to by id

    var getCurrentTeamIndex = function() {
        return current_team;
    };

    var setLeader = function(email, success_callback, failure_callback) {
        log("setLeader", "called with", email);
        if (validateMember(email)) {
            leader = email;
            getAllTeams(success_callback, function() {
                console.log("setLeader failed");
                if (typeof failure_callback === 'function') failure_callback();
            });
        } else {
            throw new Error('Cannot set leader to invalid email: ' + email);
        }
    };

    var newEmptyTeam = function() {
        log("newEmptyTeam", "new team created");
        return {
            leader: leader,
            name: "",
            org: "",
            desc: "",
            members: [],      // Array of email addresses
            calendars: []   // Array of Calendar IDs. The actual calendars are stored in CalendarService
        }
    };

    var getCurrentTeam = function() {
        log("getCurrentTeam", "current_team returned: " + current_team, teams[current_team]);
        return teams[current_team];
    };

    var setCurrentTeam = function(id) {
        if (teams.hasOwnProperty(id)) {
            log('setCurrentTeam', 'current_team set to', id);
            current_team = id;
        } else {
            throw new Error('Team doesnt exist: ' + id);
        }
    };

    var createNewTeam = function() {
        log('createNewTeam', 'new team created at index 0');
        teams[0] = newEmptyTeam();
        current_team = 0;
    };

    var resetTeams = function() {
        log('resetTeams', 'resetTeams called');

        // its important to preserve the teams object so that
        // TeamService.teams points to same thing at all times
        for (var key in teams) {
            delete teams[key];
        }

        createNewTeam();
        getAllTeams(null, function() {
            console.log("unable to fetch all teams while resetting teams");
        });
    };

    var updateTeamVars = function(data) {
        log('updateTeamVars', 'called with', data);
        for (var key in teams[current_team]) {
            if (data.hasOwnProperty(key))
                teams[current_team][key] = data[key];
        }
        log('updateTeamVars', "current_team " + current_team + " was updated", teams[current_team]);
    };

    /* Validations */
    var validateMember = function(user) {
        //Checks if user is an email address
        var isEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(user);
        log('validateMember', 'called on ' + user, isEmail);
        return !!isEmail;
    };

    var teamValidations = {
        name: function() {
            var team = teams[current_team];
            return ((team.name.length > 0)) &&
                    (/^[a-zA-Z]/.test(team.name));
        },
        org: function() {
            var team = teams[current_team];
            return ((team.org.length > 0)) &&
                    (/^[a-zA-Z]/.test(team.org));
        },
        desc: function() {
            var team = teams[current_team];
            return ((team.desc.length > 0)) &&
                    (/^[a-zA-Z]/.test(team.desc));
        }
    };

    var validateAllMembers =function() {
        var valid = (teams[current_team].members.length > 0);
        teams[current_team].members.forEach(function (user, index, arr) {
            valid = valid && validateMember(user);
        });
        return valid;
    };

    var validateCurrentTeam = function() {
        log('validateCurrentTeam', 'called on ' + current_team, teams[current_team]);
        var valid = true;
        for (var key in teamValidations) {
            valid = valid && teamValidations[key]();
            if (!valid) break;
        }
        log('validateCurrentTeam', valid);
        return valid;
    };

    var totalValidation = function() {
        var valid = validateCurrentTeam();
        if (valid) valid = valid && validateAllMembers();
        return valid;
    };

    /* REST requests */
    var commitChanges = function(success_callback, failure_callback) {

        var req;
        if (current_team == 0) {
            req = 'put';
            console.log("Put request called");
        } else {
            req = 'post';
            console.log("Post request called");
        }

        RESTApi.request('team', req, teams[0]).success(function(data) {
            log('commitChanges', 'Request Succeeded', data);

            log('commitChanges', 'data being placed on new empty team object at data.id', data.id);
            teams[data.id] = newEmptyTeam();
            current_team = data.id;
            updateTeamVars(data);

            createNewTeam();

            if (typeof success_callback === 'function') success_callback(data);
        }).error(function(e) {

            console.log("Server returned:");
            console.log(e);

            if (typeof failure_callback === 'function') failure_callback();
        });
    };

    var deleteTeamAtIndex = function(id) {
        log('deleteTeamAtIndex', 'called for', id);
    };

    var getAllTeams = function(success_callback, failure_callback) {
        if (leader === "") {
            log("getAllTeams", "leader not defined, getAllTeams aborted");
            return;
        }

        RESTApi.request('team', 'get').success(function(data) {
            // update teams variable
            data.teams.forEach(function(team, index, arr) {
                teams[team.id] = team;
            });
            log('getAllTeams', 'success! teams updated to', teams);
            // callback
            if (typeof success_callback === 'function') success_callback(data);
        }).error(function(e) {
            console.log('Server returned:');
            console.log(e);
            // callback
            if (typeof failure_callback === 'function') failure_callback();
        });
    };

    //initialize
    resetTeams();

    return {
        // basics
        teams: teams,
        getCurrentTeamIndex: getCurrentTeamIndex,
        createTeam: createNewTeam,
        getCurrentTeam: getCurrentTeam,
        setCurrentTeam: setCurrentTeam,
        setLeaderAs: setLeader,
        updateVarsWith: updateTeamVars,
        reset: resetTeams,

        // validations
        validations: teamValidations,
        validateCurrentTeam: validateCurrentTeam,
        validateMember: validateMember,
        validateAllMembers: validateAllMembers,
        validateEverything: totalValidation,

        // RESTApi
        commitCurrentTeam: commitChanges,
        deleteTeam: deleteTeamAtIndex,
        getTeams: getAllTeams
    };


}]);