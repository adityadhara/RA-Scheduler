app.controller('CreateTeamController', ['$rootScope', '$scope', '$state', 'TeamService',
    function ($rootScope, $scope, $state, TeamService) {

        var log = Logger('CreateTeamController', true);

        var hidden_user_email = $('#hidden-user-email').val();
        if (TeamService.getCurrentTeam().leader != hidden_user_email) {
            log('nil', 'resetting team with user', hidden_user_email);
            TeamService.setLeaderAs(hidden_user_email, function() {
                TeamService.createTeam();
                $state.go($state.current, {}, {reload: true}); // refresh state
            }, function() {
                console.log("server request bad");
            });
        }

        $scope.states = [
            'manage.createteam.teamdata',
            'manage.createteam.memberdata',
            'manage.createteam.review'
        ];
        $scope.firstStep = $scope.states[0];
        $scope.lastStep = $scope.states[$scope.states.length - 1];
        $scope.state = $state;

        $scope.validateNextStep = {
            'manage.createteam.teamdata': TeamService.validateCurrentTeam,
            'manage.createteam.memberdata': TeamService.validateAllMembers,
            'manage.createteam.review': function () {
                return false;
            } // review is never true
        };

        $scope.validateEverything = TeamService.validateEverything;

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

app.controller('TeamDataController', ['$scope', 'TeamService',
    function ($scope, TeamService) {

        var log = Logger('CreateTeamDataController', true);

        $scope.team = TeamService.getCurrentTeam();

        log("nil", "Controller initialized");

    }]);

app.controller('TeamMembersController', ['$scope', 'TeamService',
    function ($scope, TeamService) {

        var log = Logger('CreateTeamMembersController', true);

        $scope.emails = TeamService.getCurrentTeam().members;
        $scope.emailstring = $scope.emails.join(',\n');
        $scope.emailvalidity = (function () {
            var ret = {};
            if ($scope.emails.length != 0) {
                $scope.emails.forEach(function (email, index, arr) {
                    ret[email] = true;
                });
            }
            return ret;
        }());

        $scope.emailduplicity = {};
        $scope.allEmailsValid = true;
        $scope.hasDuplicates = false;

        var validateEmails = function () {
            $scope.allEmailsValid = true;
            $scope.hasDuplicates = false;
            $scope.emailvalidity = {};
            $scope.emailduplicity = {};
            for (var i = 0; i < $scope.emails.length; i++) {
                if ($scope.emailvalidity.hasOwnProperty($scope.emails[i])) {
                    $scope.emailduplicity[$scope.emails[i]] = true;
                    $scope.hasDuplicates = true;
                } else {
                    $scope.emailvalidity[$scope.emails[i]] = TeamService.validateMember($scope.emails[i]);
                    if (!$scope.emailvalidity[$scope.emails[i]]) {
                        $scope.allEmailsValid = false;
                    }
                }

            }
        };

        var updateTeamMembersList = function () {
            validateEmails();

            if (($scope.allEmailsValid) && (!$scope.hasDuplicates)) {
                var lengthZero = $scope.emails.length == 0;
                var lengthEqual = TeamService.getCurrentTeam().members.length == $scope.emails.length;
                var containsNew = false;

                if (lengthEqual) {
                    $scope.emails.every(function (email, index, arr) {
                        if (TeamService.getCurrentTeam().members.indexOf(email) < 0) {
                            containsNew = true;
                            return false;
                        }
                        return true;
                    });
                }
                if (lengthZero || (!lengthEqual) || containsNew) {
                    TeamService.updateVarsWith({members: $scope.emails});
                    log('updateTeamMembersList', 'New members entered. Members updated', TeamService.getCurrentTeam());
                }
            }
        };

        var emailStringChangeTimeout = null;
        $scope.onEmailStringChange = function () {
            if (emailStringChangeTimeout) {
                window.clearTimeout(emailStringChangeTimeout);
            }
            emailStringChangeTimeout = window.setTimeout(function () {
                $scope.$apply(function () {
                    if ($scope.emailstring.length > 0) {
                        $scope.emails = [];
                        var try_emails = $scope.emailstring.trim().split(/[\s,]+/);
                        try_emails.forEach(function(item, index, arr) {
                            if (item.length > 0) {
                                $scope.emails.push(item);
                            }
                        });
                    } else {
                        $scope.emails = [];
                    }
                    updateTeamMembersList();
                    emailStringChangeTimeout = null;
                });
            }, 500);
        };

        $scope.show_x = {};

        $scope.removeEmailFromList = function (index) {
            $scope.emails.splice(index, 1);
            $scope.emailstring = $scope.emails.join(',\n');
            log('removeEmailFromList', 'email removed at index' + index, $scope.emails);
            updateTeamMembersList();
        };

        $scope.removeAllInvalid = function () {
            if (($scope.hasDuplicates) || (!$scope.allEmailsValid)) {
                $scope.emails = [];
                for (var email in $scope.emailvalidity) {
                    if ($scope.emailvalidity[email])
                        $scope.emails[$scope.emails.length] = email;
                }
                $scope.emailduplicity = false;
                $scope.emailvalidity = {};
                $scope.hasDuplicates = false;
                $scope.allEmailsValid = true;

                $scope.emailstring = $scope.emails.join(',\n');
                log('removeAllInvalid', 'all invalid emails removed', $scope.emails);
                updateTeamMembersList();
            }


        };

        $scope.emailsTextAreaHeight = function () {
            return Math.max(4, $scope.emails.length + 2);
        };

        log('nil', 'Controller initialized');

    }]);

app.controller('TeamReviewController', ['$scope', 'TeamService',
    function ($scope, TeamService) {
        var log = Logger('CreateTeamReviewController', true);

        $scope.team = TeamService.getCurrentTeam();

        log('nil', 'Controller initialized');
    }]);


