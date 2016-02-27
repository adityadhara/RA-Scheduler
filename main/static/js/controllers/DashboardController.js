app.controller('DashboardController', ['$rootScope', '$scope', '$state', 'TeamService',
    function ($rootScope, $scope, $state, TeamService) {

        /* State validation (hint: are you logged in?) */
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // Redirect IF NOT LOGGED IN
            if ($('#hidden-user-email').val() == '') {
                event.preventDefault();
                window.location = '/';
            }
        });


        /* logging */
        var log = Logger('DashboardController', false);

        /* Flashes. Because why not. */
        $scope.flashes = {};
        $scope.flashes.messages = [];
        $scope.flashes.dismiss = function (index) {
            log('flashes.dismiss', "called with", arguments);
            $scope.flashes.messages.splice(index, 1);
        };
        $scope.flashes.addFlash = function (msg, intensity) {
            log('flashes.addFlash', 'called with', arguments);
            switch (intensity) {
                case 'info':
                    $scope.flashes.messages.push({
                        class: 'alert-info',
                        icon: 'fa-info-circle',
                        message: msg
                    });
                    return;
                case 'warning':
                    $scope.flashes.messages.push({
                        class: 'alert-warning',
                        icon: 'fa-exclamation-circle',
                        message: msg
                    });
                    return;
                case 'danger':
                    $scope.flashes.messages.push({
                        class: 'alert-danger',
                        icon: 'fa-exclamation-triangle',
                        message: msg
                    });
                    return;
            }
            console.log("Unknown value given to flashes:", intensity);
        };

    }]);

app.controller('ManageController', ['$rootScope', '$scope', '$state', 'TeamService', 'CalendarService',
    function($rootScope, $scope, $state, TeamService, CalendarService) {
        var log = Logger('ManageController', true);

        $scope.hidden_user_email = $('#hidden-user-email').val();
        if (TeamService.getCurrentTeam().leader != $scope.hidden_user_email) {
            log('nil', 'resetting team with user', $scope.hidden_user_email);
            TeamService.setLeaderAs($scope.hidden_user_email, function() {
                TeamService.createTeam();
                $state.go($state.current, {}, {reload: true}); // refresh state
            }, function() {
                console.log("server request bad");
            });
        }

        $scope.teams = TeamService.teams;
        $scope.deleteTeam = function(id) {
            log('deleteTeam', 'called on id', id);
            if (confirm("Are you sure you want to delete this team? You won't be able to undo this operation.")) {
                TeamService.deleteTeam(id, function() {
                    alert("Successfully deleted team!");
                }, function() {
                    alert('Unable to delete team, check your internet connection and try again!');
                });
            }
        };

        $scope.calendars = CalendarService.calendars;
        $scope.createCalendar = function(id) {
            TeamService.setCurrentTeam(id);
            $state.go('manage.createcalendar');
        }

    }]);