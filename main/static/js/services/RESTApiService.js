app.factory('RESTApi', ['$http', function($http) {

    log = Logger('RESTApi', false);

    var getURL = function(req_for) {
        switch(req_for) {
            case 'team':
                return '/api/team';
            case 'calendar':
                return '/api/calendar';
            case 'preference':
                return '/api/preference';
        }
        throw new Error("RESTApi: Requested item is invalid");
    };

    var createPromise = function(req_for, req_type, data) {
        log('createPromise', 'promise attempted', arguments);

        var url = getURL(req_for);
        log('createPromise', 'url determined', url);

        var resource_id = null;
        if (data && (data.hasOwnProperty('id'))) {
            url += "/" + data.id.toString();
            log('createPromise', 'id appended, url is now', url);
        }


        switch(req_type.toLowerCase()) {
            case 'get':
                log('createPromise', 'get request made');
                return $http.get(url);
            case 'post':
                log('createPromise', 'post request made');
                return $http.post(url, {data: data});
            case 'put':
                log('createPromise', 'put request made');
                return $http.put(url, {data: data});
            case 'delete':
                log('createPromise', 'delete request made');
                return $http.delete(url);
        }

        throw new Error("RESTApi: Invalid request type");
    };


    return {
        request: createPromise
    };
}]);