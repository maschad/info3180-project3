/**
 * Created by chad on 4/2/16.
 */

angular.module('myApp').controller('loginController',
    ['$scope', '$location', 'AuthService', '$cookies', '$rootScope',
        function ($scope, $location, AuthService, $cookies, $rootScope) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.email, $scope.loginForm.password)
        // handle success
        .then(function () {
            $cookies.put('online', true);
            $rootScope.user = true;
            $location.path('/home');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

  }])

    .controller('homeController',
        ['$scope', '$location', 'AuthService', '$cookies', '$rootScope',
            function ($scope, $location, AuthService, $cookies, $rootScope) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
            $cookies.put('online', false);
            $rootScope.user = false;
          $location.path('/login');
        });

    };

  }])

    .controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.email,
                           $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

  }])

    .controller('addController', ['$scope', '$location', '$http', '$log',
  function ($scope, $location, $http, $log) {

    $scope.add = function (url) {
        $http.post('/api/thumbnail/process', {'url': url})
          .success(function (data) {
            $scope.images = data.images;
            $scope.imgUrl = $scope.images[0];
          }).error(function (data) {
        $log.log(data);
      })
    };

    $scope.changeImage = function (image) {
      $scope.imgUrl = image;
    }
  }]);

