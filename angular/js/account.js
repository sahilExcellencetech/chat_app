var mainmod = angular.module('chat_app', ['ngStorage', 'common', 'facebook', 'users']);
mainmod.config(function(FacebookProvider) {
    FacebookProvider.init('1600665563479778');
});
//mainmod.factory('mySocket', function(socketFactory) {
//    return socketFactory();
//});
mainmod.controller('ctrl1', ['$scope', '$rootScope', 'Facebook', 'ajax_request', 'local', function($scope, $rootScope, Facebook, ajax_request, local) {
        $scope.signup = true;
        $scope.login = true;
        $scope.submit = function(name, email, pwd) {

            if (name && email && pwd) {
                local.set(email);
                $scope.$watch('email', function(value) {
                    if (value) {
                        $scope.email1 = value;
                    }
                });
                ajax_request('/register', {name: name, email: email, pwd: pwd}).then(function(data) {
                    $scope.warning = data.warning;
                    if (!data.warning) {
                        $scope.signup = false;
                        $scope.login = true;
                    }
                });
            }
        };
        $scope.sign_in = function(email1, pwd1) {
            ajax_request('/login', {email1: email1, pwd1: pwd1}).then(function(data) {
                if (data.val) {
                    var socket = io.connect('http://localhost:8080/');
                    socket.on('news', function(data) {
                        $scope.$apply(function() {
                            $rootScope.array = data.arr;
                        });
                    });
                    $(".circle").css('color', 'green');
                    var socket = io.connect('http://localhost:8080/');
                    socket.emit('online', {
                        email2: data.email2,
                        status: 'Online'
                    });
                }

                if (data.temp) {
                    console.log(data.temp);
                }
                if (data.info) {
                    console.log(data.info);
                }
                if (data.req) {
                    console.log(data.req);
                }
            });
        };
        $scope.forgot = function() {
            ajax_request('/login', {frgt: 1}).then(function(data) {
                alert(data.random_pwd);
            });
        };

        $scope.memberlogin = function() {
            $scope.signup = false;
            $scope.login = true;
        };

        $scope.loginfb = function() {
            // From now on you can use the Facebook service just as Facebook api says
            Facebook.login(function(response) {
                // Do something with response.
                Facebook.api('/me', function(response) {
                    $scope.user = response;
                    ajax_request('/fblogin', {fbid: response.id, fbname: response.name, fbemail: response.email}).then(function(data) {

                    });
                });
            }, {scope: 'public_profile,email'});
        };

        $scope.getLoginStatus = function() {
            Facebook.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    $scope.loggedIn = true;
                } else {
                    $scope.loggedIn = false;
                }
            });
        };

    }]);