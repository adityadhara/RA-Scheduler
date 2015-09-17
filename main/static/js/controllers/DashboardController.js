app.controller('DashboardController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

    /* State validation (hint: are you logged in?) */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if ($('#hidden-user-email').val() == '') {
                event.preventDefault();
                window.location = '/';
            }
        });


    /* Flashes. Because why not. */
    $scope.flashes = [];
    $scope.flashes.dismiss = function(index) {
        $scope.flashes.splice(index, 1);
    };
    $scope.flashes.addFlash = function(msg, intensity) {
        switch(intensity) {
            case 'info':
                $scope.flashes.append({
                    class: 'alert-info',
                    icon: 'fa-info-circle',
                    message: msg
                });
                return;
            case 'warning':
                $scope.flashes.append({
                    class: 'alert-warning',
                    icon: 'fa-exclamation-circle',
                    message: msg
                });
                return;
            case 'danger':
                $scope.flashes.append({
                    class: 'alert-danger',
                    icon: 'fa-exclamation-triangle',
                    message: msg
                });
                return;
        }

        console.log("Unknown value given to flashes:", intensity);
    };



}]);