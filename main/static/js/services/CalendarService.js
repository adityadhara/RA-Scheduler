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
            all_preferences_entered: false,
            locked: false,
            shifts: [],
            shift_types: []
        }
    };

    var newEmptyShift = function() {
        return {
            start_dt: new Date(),
            end_dt: new Date(),
            shift_type: null
        };
    };

    var newEmptyShiftType = function() {
        return {
            id: 0,
            color: '#ffffff',
            name: ''
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

        addShift({});
        addShiftType({});
    };

    var addShift = function(data) {
        var new_shift = newEmptyShift();
        for (var key in data) {
            new_shift[key] = data[key];
        }
        calendars[current_calendar].shifts.push(new_shift);
        log('addShift', 'new shift created with', data);
    };

    var removeShiftAt = function(index) {
        calendars[current_calendar].shifts.splice(index, 1);
    };

    var addShiftType = function(data) {
        var new_shift_type = newEmptyShiftType();
        for (var key in data) {
            new_shift_type[key] = data[key];
        }
        calendars[current_calendar].shift_types.push(new_shift_type);
        log('addShiftType', 'new shift_type created with', data);
    };

    var removeShiftTypeAt = function(index) {
        calendars[current_calendar].shift_types.splice(index, 1);
    };

    var resetCalendars = function() {
        log('resetCalendars', 'resetCalendars called');

        // its important to preserve the calendars object so that
        // CalendarService.calendars points to same thing at all times
        for (var key in calendars) {
            delete calendars[key];
        }

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
        var truth = (shift_type.name.length > 0) &&
            (/^[a-zA-Z]/.test(shift_type.name)) &&
            (parseInt(shift_type.color, 16) < parseInt("ffffff", 16));
        log('validateShiftType', 'called on ' + shift_type, truth);
        return truth;
    };

    var validateShift = function(shift) {
        var truth = (shift.start_dt > calendars[current_calendar].start_dt) &&
            (shift.end_dt < calendars[current_calendar].end_dt) &&
            (calendars[current_calendar].shift_types.indexOf(shift.shift_type) > -1);
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
        addShift: addShift,
        removeShiftAt: removeShiftAt,
        addShiftType: addShiftType,
        removeShiftTypeAt: removeShiftTypeAt,

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