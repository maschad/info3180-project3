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

        return deferred.promise();
    }
}]);

