var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'static/partials/home.html',
      controller: 'homeController'
    })
    .when('/login',{
      templateUrl: 'static/partials/login.html',
      controller: 'loginController'

    })
      .when('/add', {
        templateUrl: 'static/partials/add.html',
        controller: 'addController'
    })
    .when('/register', {
      templateUrl: 'static/partials/register.html',
      controller: 'registerController'

    })
    .when('/one', {
      template: '<h1>This is page one!</h1>',

    })
    .when('/two', {
      template: '<h1>This is page two!</h1>',

    })
    .otherwise({
      redirectTo: '/login'
    });
});

