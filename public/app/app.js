/**
 * Created by mcfly on 02/09/2015.
 */
var app = angular.module('myApp', ['ngRoute','ngTouch', 'ngSanitize','ui.bootstrap','ui.bootstrap.tpls']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/base/index.html',
                controller: 'HomeController'
            }).
            when('/configure', {
                templateUrl: 'views/base/index.html',
                controller: 'ConfigureController'
            }).
            when('/instance/settings', {
                templateUrl: 'views/configure/base.html',
                controller: 'ConfigureSettingsInstance'
            }).
            when('/instance/study', {
                templateUrl: 'views/configure/base.html',
                controller: 'ConfigureStudy'
            }).
            when('/instance/sites', {
                templateUrl: 'views/configure/base.html',
                controller: 'ConfigureSites'
            }).
            when('/instance/metadata', {
                templateUrl: 'views/configure/base.html',
                controller: 'ConfigureMetadata'
            }).
            when('/home', {
                templateUrl: 'views/base/home.html',
                controller: 'HomeController'
            }).
            otherwise({
                redirectTo: '/'
            });
        //$locationProvider.html5Mode(true);
    }]);