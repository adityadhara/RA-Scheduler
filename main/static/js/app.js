var app = angular.module('RAScheduler', ['ui.router']);

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
                    templateUrl: '/static/partials/routes/manage.html'
                }
            }
        })
        .state('manage.create', {
            url: '/create',
            parent: 'manage',
            views: {
                'subtitle@': { template: 'Create Team'},
                'main@': {
                    templateUrl: '/static/partials/routes/manage.create.html'
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