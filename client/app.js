let app = angular.module('citiesApp', ["ngRoute"]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {


    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
        templateUrl: 'components/home/home.html',
        controller: 'homeController as homeCtrl'
    })
        .when('/about', {
            templateUrl: 'components/About/about.html'
        })
        .when('/poi', {
            templateUrl: 'components/POI/poi.html',
            controller: 'poiCtrl as poiCtrl'
        })
        .when('/login', {
            templateUrl: 'components/login/login.html',
            controller: 'LoginController as loginCtrl'
        })
        .otherwise({redirectTo: '/'});
}]);