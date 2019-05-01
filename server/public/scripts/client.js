var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .warnPalette('red')
            .accentPalette('blue')
            .backgroundPalette('grey')
        //.dark();
    });

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $mdDialog, $mdMedia) {
    $routeProvider
        .when('/', {
            redirectTo: 'home'
        })
        .when('/home', {
            templateUrl: '/views/templates/home.html',
            controller: 'LoginController as vm',
        })
        .when('/register', {
            templateUrl: '/views/templates/register.html',
            controller: 'LoginController as vm'
        })
        .when('/user', {
            templateUrl: '/views/templates/user.html',
            controller: 'UserController as vm',
            resolve: {
                getuser: function (UserService) {
                    return UserService.getuser();
                }
            }
        })
        .when('/technologies', {
            templateUrl: '/views/templates/technologies.html',
            controller: 'UserController as vm'
        })
        .otherwise({
            template: '<h1>404</h1>'
        });
}]);