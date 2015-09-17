app.controller('TeamCreateController', ['$rootScope', '$scope', 'TeamService', function($rootScope, $scope, TeamService) {

    var verbose = true;
    var log = function(func, msg, data) {
        if (verbose) console.log("TeamService - " + func + ":", msg, data?data:'');
    };

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if ($('#hidden-user-email').val() == '') {
                event.preventDefault();
                window.location = '/';
            }
        });

    TeamService.setLeaderAs($('#hidden-user-email').val());
    TeamService.createTeam();
    $scope.team = TeamService.getCurrentTeam();

    $scope.proceedToNextStep = function() {
        console.log(TeamService.getCurrentTeam());
    };

}]);