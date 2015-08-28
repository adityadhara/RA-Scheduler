app.factory('FlashService', function() {
    var flashes = [];

    var queueFlash = function(alert, data) {
        var newFlash = {
            icon: '',
            message: ''
        };
        switch(alert) {
            case 'info':
                newFlash.icon = 'fa-info-circle';
                break;
            case 'alert':
                newFlash.icon = 'fa-exclamation-circle';
                break;
            case 'danger':
                newFlash.icon = 'fa-exclamation-triangle';
                break;
        }

        newFlash.message = data;
        flashes[flashes.length] = newFlash;
    };

    var popFlash = function() {
        if (flashes.length == 0) return null;

        var ret = flashes[flashes.length-1];
        delete flashes[flashes.length-1];
        return ret;
    }

    return {
        flashes: flashes,
        queueFlash: queueFlash,
        popFlash: popFlash
    };
});