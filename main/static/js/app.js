var app = angular.module('RAScheduler', ['ui.router']);

var global_verbose = false;
var Logger = function(cls, verbosity) {
    var verbose = global_verbose || verbosity;
    return function (func, msg, data) {
        if (verbose) console.log(cls + " - " + func + ":", msg, data ? data : '');
    };
};

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('ang{');
    $interpolateProvider.endSymbol('}ang');
});

app.config(function($stateProvider, $urlRouterProvider) {

    //default goes to index
    $urlRouterProvider.otherwise('/index');

    //States
    $stateProvider
        .state('index', {
            url:'/index',
            views: {
                'title@': { template: 'Dashboard'},
                'subtitle@': { template: 'Welcome!'},
                'main@': {
                    templateUrl: '/static/partials/routes/index.html'
                }
            }
        })
        .state('manage', {
            url: '/manage',
            views: {
                'title@': { template: 'Manage Teams'},
                'subtitle@': { template: 'Overview'},
                'main@': {
                    templateUrl: '/static/partials/routes/manage.html',
                    controller: 'ManageController'
                }
            }
        })
        .state('manage.createteam', {
            url: '/createteam',
            parent: 'manage',
            views: {
                'subtitle@': { template: 'Create Team'},
                'main@': {
                    templateUrl: '/static/partials/routes/manage.createteam.html',
                    controller: 'CreateTeamController'
                }
            }
        })
        .state('manage.createteam.teamdata', {
            url: '/teamdata',
            parent: 'manage.createteam',
            sub_subtitle: 'Team Information',
            views: {
                subsection: {
                    templateUrl: '/static/partials/routes/manage.createteam.teamdata.html',
                    controller: 'TeamDataController'
                }
            }
        })
        .state('manage.createteam.memberdata', {
            url: '/memberdata',
            parent: 'manage.createteam',
            sub_subtitle: 'Members',
            views: {
                subsection: {
                    templateUrl: '/static/partials/routes/manage.createteam.memberdata.html',
                    controller: 'TeamMembersController'
                }
            }
        })
        .state('manage.createteam.review', {
            url: '/review',
            parent: 'manage.createteam',
            sub_subtitle: 'Review',
            views: {
                subsection: {
                    templateUrl: '/static/partials/routes/manage.createteam.review.html',
                    controller: 'TeamReviewController'
                }
            }
        })
        .state('manage.createcalendar', {
            url: '/createcalendar',
            parent: 'manage',
            views: {
                'subtitle@': { template: 'Create Calendar'},
                'main@': {
                    templateUrl: '/static/partials/routes/manage.createcalendar.html',
                    controller: 'CreateCalendarController'
                }
            }
        })
        .state('manage.createcalendar.calendardata', {
            url: '/calendardata',
            parent: 'manage.createcalendar',
            sub_subtitle: 'Calendar Information',
            views: {
                subsection: {
                    templateUrl: '/static/partials/routes/manage.createcalendar.calendardata.html',
                    controller: 'CalendarDataController'
                }
            }
        })
        .state('manage.createcalendar.shift_types', {
            url: '/shifttypes',
            parent: 'manage.createcalendar',
            sub_subtitle: 'Shift Types',
            views: {
                subsection: {
                    templateUrl: '/static/partials/routes/manage.createcalendar.shifttypes.html',
                    controller: 'CalendarShiftTypesController'
                }
            }
        })
        .state('manage.createcalendar.shifts', {
            url: '/shifts',
            parent: 'manage.createcalendar',
            sub_subtitle: 'Shifts',
            views: {
                subsection: {
                    templateUrl: '/static/partials/routes/manage.createcalendar.shifts.html',
                    controller: 'CalendarShiftsController'
                }
            }
        })
        .state('manage.createcalendar.review', {
            url: '/review',
            parent: 'manage.createcalendar',
            sub_subtitle: 'Review',
            views: {
                subsection: {
                    templateUrl: '/static/partials/routes/manage.createcalendar.review.html',
                    controller: 'CalendarReviewController'
                }
            }
        })
        .state('manage.modify', {
            url: '/modify',
            parent: 'manage',
            views: {
                'subtitle@': { template: 'Modify teams'},
                'main@': {
                    templateUrl: '/static/partials/routes/manage.modify.html'
                }
            }
        })
        .state('view', {
            url: '/view',
            views: {
                'title@': { template: 'Teams You are in'},
                'subtitle@': { template: 'Overview'},
                'main@': {
                    templateUrl: '/static/partials/routes/view.html'
                }
            }
        })
        .state('view.shifts', {
            url: '/shifts',
            parent: 'view',
            views: {
                'subtitle@': {template: 'Your shifts'},
                'main@': {
                    templateUrl: '/static/partials/routes/view.shifts.html'
                }
            }
        })
        .state('view.requests', {
            url: '/requests',
            parent: 'view',
            views: {
                'subtitle@': {template: 'Swap requests'},
                'main@': {
                    templateUrl: '/static/partials/routes/view.requests.html'
                }
            }
        });

});