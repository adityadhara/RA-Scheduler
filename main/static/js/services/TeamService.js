app.factory('TeamService', ['RESTApi', 'CalendarService', function(RESTApi, CalendarService) {

    var verbose = true;
    var log = function(func, msg, data) {
        if (verbose) console.log("TeamService - " + func + ":", msg, data?data:'');
    };

    var teams = {};
    var leader = "";
    var current_team = 0;   // 0 signifies a team without an id. All other teams are referred to by id

    var setLeader = function(email) {
        if (validateUser(email)) {
            leader = email;
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
            users: [],      // Array of email addresses
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
        teams = {};
        createNewTeam();
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
    var validateUser = function(user) {
        log('validateUser', 'called with', user);
        //Checks if user is an email address
        return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(user);
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

    var validateAllUsers =function() {
        var valid = true;
        teams[current_team].users.forEach(function (user, index, arr) {
            valid = valid && validateUser(user);
        });
        return valid;
    };


    var validateAllCalendars = function() {
        var valid = true;
        teams[current_team].calendars.forEach(function (calendar, index, arr) {
            valid = valid && CalendarService.validate(calendar);
        });
        return valid;
    };

    var validateCurrentTeam = function() {
        log('validateCurrentTeam', 'called on ' + current_team, teams[current_team]);
        var valid = true;
        for (var key in teamValidations) {
            valid = valid && teamValidations[key](current_team);
        }
        log('validateCurrentTeam', valid);
        return valid;
    };

    /* REST requests */
    var commitChanges = function() {
        if (current_team == 0) {
            console.log("Put request called");
        } else {
            console.log("Post request called");
        }
    };

    var getAllTeams = function() {
        console.log("Get request called");
    };

    //initialize
    resetTeams();

    return {
        // basics
        createTeam: createNewTeam,
        getCurrentTeam: getCurrentTeam,
        setCurrentTeam: setCurrentTeam,
        setLeaderAs: setLeader,
        updateVarsWith: updateTeamVars,
        reset: resetTeams,

        // validations
        validations: teamValidations,
        validateCurrentTeam: validateCurrentTeam,
        validateUser: validateUser,
        vaidateAllUsers: validateAllUsers,
        validateAllCalendars: validateAllCalendars,

        // RESTApi
        commitCurrentTeam: commitChanges,
        getTeams: getAllTeams
    };


}]);