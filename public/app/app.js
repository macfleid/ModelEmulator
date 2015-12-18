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
                templateUrl: 'views/base/configure.html',
                controller: 'ConfigureController'
            }).
            when('/instance/settings', {
                templateUrl: 'views/configure/base.html',
                controller: 'ConfigureSettingsInstance'
            }).
            when('/instance/study', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureStudy'
            }).
            when('/instance/sites', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureSites'
            }).
            when('/instance/users', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureUsers'
            }).
            when('/instance/metadata', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureMetadata'
            }).
            when('/instance/events', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureEvents'
            }).
            when('/instance/EventForms', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureEventForms'
            }).
            when('/instance/forms', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureForms'
            }).
            when('/instance/itemdef', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureItemDef'
            }).
            when('/instance/formItems', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureFormItems'
            }).
            when('/instance/labels', {
                templateUrl: 'views/configure/repeatableBase.html',
                controller: 'ConfigureLabels'
            }).
            when('/wss/instance', {
                templateUrl: 'views/wss/consultation.html',
                controller: 'WssInstanceController'
            }).
            when('/wss/study', {
                templateUrl: 'views/wss/consultation.html',
                controller: 'WssStudyController'
            }).
            when('/home', {
                templateUrl: 'views/base/home.html',
                controller: 'HomeController'
            }).
            otherwise({
                redirectTo: '/home'
            });
        //$locationProvider.html5Mode(true);
    }]);