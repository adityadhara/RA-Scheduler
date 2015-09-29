app.factory('CalendarService', ['RESTApi', 'TeamService', function(RESTApi, TeamService) {

    var log = Logger('CalendarService', true);

    var calendars = {};
    var current_calendar = 0;

    var newEmptyCalendar = function() {
        return {
            name: "",
            desc: "",
            start_dt: new Date(),
            end_dt: new Date(),
            team_id: "0",
            shifts: [],
            shift_types: []
        }
    };

    var newEmptyShift = function() {
        return {
            start_dt: 0,
            end_dt: 0,
            shift_type: ""
        };
    };

    var getCurrentCalendar = function() {
        log("getCurrentCalendar", "current calendar returned: " + current_calendar, calendars[current_calendar]);
        return calendars[current_calendar];
    };

    var setCurrentCalendar = function(id) {
        if (calendars.hasOwnProperty(id)) {
            log('setCurrentCalendar', 'current_calendar set to', id);
            current_calendar = id;
        } else {
            throw new Error('Calendar doesnt exist: ' + id);
        }
    };

    var createNewCalendar = function() {
        calendars[0] = newEmptyCalendar();
        calendars[0].team_id = TeamService.getCurrentTeamIndex().toString();
        current_calendar = 0;
        log('createNewCalendar', 'new calendar created at index 0 for team', calendars[0].team_id);
    };

    var resetCalendars = function() {
        log('resetCalendars', 'resetCalendars called');
        calendars = {};
        createNewCalendar();
    };

    var updateCalendarVars = function(data) {
        log('updateCalendarVars', 'called with', data);
        for (var key in calendars[current_calendar]) {
            if (data.hasOwnProperty(key))
                calendars[current_calendar][key] = data[key];
        }
        log('updateCalendarVars', "current_calendar " + current_calendar + " was updated", calendars[current_calendar]);
    };

    /* Validations */
    var calendarValidations = {
        name: function() {
            var calendar = calendars[current_calendar];
            return ((calendar.name.length > 0)) &&
                    (/^[a-zA-Z]/.test(calendar.name));
        },
        desc: function() {
            var calendar = calendars[current_calendar];
            return ((calendar.desc.length > 0)) &&
                    (/^[a-zA-Z]/.test(calendar.desc));
        },
        start_dt: function() {
            return (calendars[current_calendar].start_dt instanceof Date);
        },
        end_dt: function() {
            return (calendars[current_calendar].end_dt instanceof Date) &&
                (calendars[current_calendar].start_dt < calendars[current_calendar].end_dt);
        },
        team_id: function() {
            return (parseInt(calendars[current_calendar].team_id, 10) > 0);
        }
    };

    var validateCurrentCalendar = function() {
        log('validateCurrentCalendar', 'called on ' + current_calendar, calendars[current_calendar]);
        var valid = true;
        for (var key in calendarValidations) {
            valid = valid && calendarValidations[key]();
            log('validateCurrentCalendar', 'checking ' + key, valid);
            if (!valid) break;
        }
        log('validateCurrentCalendar', valid);
        return valid;
    };

    var validateAllShiftTypes = function() {
        log('validateAllShiftTypes', 'called on ' + current_calendar, calendars[current_calendar]);
        var valid = calendars[current_calendar].shift_types.length > 0;
        calendars[current_calendar].shift_types.every(function(shift_type) {
            valid = valid && validateShiftType(shift_type);
            return valid;
        });
        log('validateAllShiftTypes', valid);
        return valid;
    };

    var validateAllShifts = function(shift) {
        log('validateAllShifts', 'called on ' + current_calendar, calendars[current_calendar]);
        var valid = calendars[current_calendar].shifts.length > 0;
        calendars[current_calendar].shifts.every(function(shift) {
            valid = valid && validateShift(shift);
            return valid;
        });
        return valid;
    };

    var validateShiftType = function(shift_type) {
        var truth = (shift_type.length > 0) &&
            (/^[a-zA-Z]/.test(shift_type));
        log('validateShiftType', 'called on ' + shift_type, truth);
        return truth;
    };

    var validateShift = function(shift) {
        var truth = (shift.start_dt > calendars[current_calendar].start_dt) &&
            (shift.end_dt < calendars[current_calendar].end_dt) &&
            (calendars[current_calendar].indexOf(shift.shift_type) > -1);
        log ('validateShift', 'called on ' + shift, truth);
        return truth;
    };

    var validateEverything = function() {
        var truth = validateCurrentCalendar() &&
            validateAllShiftTypes() &&
            validateAllShifts();
        log('validateEverything', 'called on ' + current_calendar, truth);
        return truth;
    };

    /* REST requests */
    var commitChanges = function() {
        if (current_calendar == 0) {
            console.log("Put request called");
        } else {
            console.log("Post request called");
        }
    };

    var getAllCalendars = function() {
        console.log("Get request called");
    };

    return {
        // basics
        current_calendar: current_calendar,
        calendars: calendars,
        createCalendar: createNewCalendar,
        getCurrentCalendar: getCurrentCalendar,
        setCurrentTeam: setCurrentCalendar,
        updateVarsWith: updateCalendarVars,
        reset: resetCalendars,

        // shift management



        // validations
        validations: calendarValidations,
        validateEverything: validateEverything,
        validateCalendar: validateCurrentCalendar,
        validateShiftType: validateShiftType,
        validateShift: validateShift,
        validateAllShiftTypes: validateAllShiftTypes,
        validateAllShifts: validateAllShifts,

        //REST stuff
        commitCurrentCalendar: commitChanges,
        getCalendars: getAllCalendars
    };

}]);