let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule']);

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
        .when('/register', {
            templateUrl: 'components/register/register.html',
            controller: 'registerController as regCtrl'
        })
        .when('/favorites', {
            templateUrl: 'components/favorites/favorites.html',
            controller: 'favoritesController as favoritesCtrl'
        })
        .otherwise({redirectTo: '/'});
}]);