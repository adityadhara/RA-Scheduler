app.factory('RESTApi', ['$http', function($http) {

    var getURL = function(req_for) {
        switch(req_for) {
            case 'team':
                return '/api/team/';
            case 'calendar':
                return '/api/calendar/';
            case 'preference':
                return '/api/preference/';
        }
        throw new Error("RESTApi: Requested item is invalid");
    };

    var createPromise = function(req_for, req_type, data) {
        var url = getURL(req_for);

        if (data.id) {
            url += data.id.toString();
        }

        switch(req_type.toLowerCase()) {
            case 'get':
                return $http.get(url);
            case 'post':
                return $http.post(url, {data: data});
            case 'put':
                return $http.put(url, {data: data});
            case 'delete':
                return $http.delete(url);
        }

        throw new Error("RESTApi: Invalid request type");
    };


    return {
        request: createPromise
    };
}]);