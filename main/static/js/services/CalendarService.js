app.factory('CalendarService', ['RESTApi', function(RESTApi) {
    var calendars = {};

    var newEmptyCalendar = function() {
        return {
            start: new Date.now(),
            end: new Date.now()
        }
    };

    return {};

}]);