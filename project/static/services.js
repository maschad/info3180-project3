/**
 * Created by chad on 4/2/16.
 */

angular.module('myApp').factory('AuthService',['$q','$timeout','$http', function ($q, $timeout, $http) {

    var user = null;

    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register,
      getUserStatus: getUserStatus
    });

    function isLoggedIn() {
        return !!user;
    }

    function login(email,password) {
        var deferred = $q.defer();

        $http.post('/api/user/login', {email: email, password: password})

            .success(function (data, status) {
            if(status==200 && data.result){
                user = true;
                deferred.resolve();
            }else{
                user = false;
                deferred.reject();
            }
        })
        .error(function (data) {
            user = false;
            deferred.reject();
        });

        return deferred.promise;
    }
    
    function logout() {
        var deferred = $q.defer();

        $http.get('/api/user/logout')
            .success(function (data) {
                user = false;
                deferred.resolve();
            })
            .error(function (data) {
                user = false;
                deferred.reject();
            });
        return deferred.promise;
    }
    
    function register(email, password) {
        var deferred = $q.defer();

        $http.post('/api/user/register', {email: email, password: password})
            .success(function (data, status) {
                if(status==200 && data.result){
                    deferred.resolve();
                }else {
                    deferred.reject();
                }
            })
            .error(function (data) {
                deferred.reject();
            });

        return deferred.promise;
    }

    //persistant login for page refresh
    function getUserStatus() {
        $http.get('/api/user/status')
      // handle success
      .success(function (data) {
          if (data.status) {
              return true;
          } else {
              return false;
          }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }
}]);

