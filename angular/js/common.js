var mainmod1 = angular.module('common', []);
mainmod1.factory('ajax_request', function($http, $q) {
    return function(path, data) {
        var deferred = $q.defer();
        deferred.notify('Loading...');
        if (path) {
            $http.post('http://localhost:3000' + path, data).success(function(result) {
                if (result.err) {
                    alert(result.err);
                }
                deferred.resolve(result);
            });
        } else {
            deferred.reject('Error');
        }
        return deferred.promise;
    };
});

mainmod1.factory('local', function($localStorage) {
    var local = {};
    local.set = function(email) {
        $localStorage[email] = {
            email: email
        };
//        var time = new Date().getTime();
//        time = time + (1 * 60 * 60 * 1000);
//        $localStorage[email].time = time;
        $localStorage.user = $localStorage[email];
    };
    local.get = function() {
        if (!$localStorage.user) {
            $localStorage.user = {
                email: ''
            };
        }
//        var expire = $localStorage.user.time * 1;
//        if (new Date().getTime() > expire) {
//            $localStorage.user = null;
//            return false;
//        }
        return $localStorage.user;
    };
    return local;

});