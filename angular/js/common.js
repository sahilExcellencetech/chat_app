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
    local.set = function(email, arr1) {
        $localStorage[email] = {
            email: {
                eml: email,
                arr: arr1
            },
            email1: email
        };
//        var time = new Date().getTime();
//        time = time + (1 * 60 * 60 * 1000);
//        $localStorage[email].time = time;
        $localStorage.user = $localStorage[email];
    };
    local.get = function() {
        if (!$localStorage.user) {
            $localStorage.user = {
                email1: ''
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

mainmod1.factory('dataShare', function() {
    var data = {};
    data.data = {};
    data.set = function(array) {
        this.data = array;
    };
    data.get = function() {
        return this.data;
    };
    return data;
});

mainmod1.factory('filter', function() {
    function prettyDate(time) {
        var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
                diff = (((new Date()).getTime() - date.getTime()) / 1000),
                day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
            return;

        return day_diff == 0 && (
                diff < 60 && "just now" ||
                diff < 120 && "1 minute ago" ||
                diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
                diff < 7200 && "1 hour ago" ||
                diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
                day_diff == 1 && "Yesterday" ||
                day_diff < 7 && day_diff + " days ago" ||
                day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
    }
});