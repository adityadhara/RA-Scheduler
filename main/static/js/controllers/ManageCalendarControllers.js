app.controller('CreateCalendarController', ['$rootScope', '$scope', '$state', 'CalendarService', 'TeamService',
    function($rootScope, $scope, $state, CalendarService, TeamService) {

        var log = Logger('CreateCalendarController');

        var hidden_user_email = $('#hidden-user-email').val();
        if (TeamService.getCurrentTeam().leader != hidden_user_email) {
            log('nil', 'resetting team with user', hidden_user_email);
            TeamService.setLeaderAs(hidden_user_email, function() {
                TeamService.createTeam();
                $state.go($state.current, {}, {reload: true}); // refresh state
            }, function() {
                console.log("team update server request bad");
            });
        }

        CalendarService.createCalendar();

        $scope.states = [
            'manage.createcalendar.calendardata',
            'manage.createcalendar.shift_types',
            'manage.createcalendar.shifts',
            'manage.createcalendar.review'
        ];
        $scope.firstStep = $scope.states[0];
        $scope.lastStep = $scope.states[$scope.states.length - 1];
        $scope.state = $state;

        $scope.validateNextStep = {
            'manage.createcalendar.calendardata': CalendarService.validateCalendar,
            'manage.createcalendar.shift_types': CalendarService.validateAllShiftTypes,
            'manage.createcalendar.shifts': CalendarService.validateAllShifts,
            'manage.createcalendar.review': function () {
                return false;
            } // review is never true
        };

        $scope.validateEverything = CalendarService.validateEverything;

        $scope.toNextStep = function () {
            log('toNextStep', "called at ", $state.current.name);
            var next_index = $scope.states.indexOf($state.current.name) + 1;
            $state.go($scope.states[next_index]);
        };

        $scope.toPrevStep = function () {
            log('toPrevStep', 'called at ', $state.current.name);
            var prev_index = $scope.states.indexOf($state.current.name) - 1;
            $state.go($scope.states[prev_index]);
        };

        $scope.completeCreate = function () {
            TeamService.commitCurrentTeam(function(data) {
                $scope.flashes.addFlash('Woo! Your team "' + data.name + '" is ready!', 'info');
                $state.go('manage');
            }, function() {
                alert("Unable to commit the current team. Please check your Internet connection and try again!");
            });
            log('completeCreate', 'called');
        };

        var transitionControl = function() {
            for (var i = 0; i < $scope.states.length; i++) {
                if (!$scope.validateNextStep[$scope.states[i]]()) {
                    log('transitionControl', "setting timeout for", $scope.states[i]);
                    window.setTimeout(function () {
                        $state.go($scope.states[i]);
                    }, 0);
                    break;
                }
            }
        };

        var transitionHandler = $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name == 'manage.createteam') {
                event.preventDefault();
                transitionControl();
            }
        });

        $scope.$on('$destroy', function() {
            transitionHandler();
        });

        transitionControl(); // first load

        log('nil', 'Controller initialized');

    }]);

app.controller('CalendarDataController', ['$scope', '$state', 'CalendarService', 'TeamService',
    function($scope, $state, CalendarService, TeamService) {
        var log = Logger('CalendarDataController', true);

        $scope.teams = TeamService.teams;
        $scope.calendar = CalendarService.getCurrentCalendar();

        log ('nil', 'Controller initialized');

    }]);

app.controller('CalendarShiftTypesController', ['$scope', '$state', 'CalendarService',
    function($scope, $state, CalendarService) {
        var log = Logger('CalendarShiftTypesController', true);


        log ('nil', 'Controller initialized');

    }]);

app.controller('CalendarShiftsController', ['$scope', '$state', 'CalendarService',
    function($scope, $state, CalendarService) {
        var log = Logger('CalendarShiftsController', true);


        log ('nil', 'Controller initialized');

    }]);

app.controller('CalendarReviewController', ['$scope', '$state', 'CalendarService',
    function($scope, $state, CalendarService) {
        var log = Logger('CalendarReviewController', true);


        log ('nil', 'Controller initialized');

    }]);