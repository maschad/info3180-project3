/**
 * Created by chad on 4/2/16.
 */

angular.module('myApp').factory('AuthService',['$q','$timeout','$http', function ($q, $timeout, $http) {

    var user = null;

    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
        return !!user;
    }

    function login(email,password) {
        var deferred = $q.defer();

        $http.post('/api/login',{email: email, password: password})

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

        $http.get('/api/logout')
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

        $http.post('/api/register',{email:email,password:password})
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
}]);

