var mainmod = angular.module('chat_app', ['ngStorage', 'common', 'facebook', 'users']);
mainmod.config(function(FacebookProvider) {
    FacebookProvider.init('1600665563479778');
});
mainmod.controller('ctrl1', ['$scope', '$rootScope', 'Facebook', 'ajax_request', 'local', function($scope, $rootScope, Facebook, ajax_request, local) {
        var local_email = local.get();
        var socket = io.connect('http://localhost:8080/');
        if (local_email.email) {
            $rootScope.list = true;
            $scope.login = false;
            $scope.signup = false;
            socket.on('connect', function() {
                socket.emit('online', {
                    email2: local_email.email,
                    status: 'Online',
                    socket_id: socket.id
                });
                socket.on('result', function(data) {
                    var cur_user = local.get();
                    for (var i = 0; i < data.arr.length; i++) {
                        if (cur_user.email == data.arr[i].email3) {
                            data.arr.splice(i, 1);
                        }
                    }
                    $scope.$apply(function() {
                        $rootScope.array = data.arr;
                    });
                });
            });
        }
        else {
            $rootScope.list = false;
            $scope.login = false;
            $scope.signup = true;
        }
        $scope.submit = function(name, email, pwd) {
            if (name && email && pwd) {
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
                    local.set(email1);
                    $rootScope.list = true;
                    $scope.login = false;
                    socket.emit('online', {
                        email2: data.email2,
                        status: 'Online',
                        socket_id: socket.id
                    });
                    socket.on('result', function(data) {
                        var cur_user = local.get();
                        for (var i = 0; i < data.arr.length; i++) {
                            if (cur_user.email == data.arr[i].email3) {
                                data.arr.splice(i, 1);
                            }
                        }
                        $scope.$apply(function() {
                            $rootScope.array = data.arr;
                        });
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
                        if (data.val) {
                            local.set(data.email3);
                            $rootScope.list = true;
                            $scope.signup = false;
                            socket.emit('online', {
                                email2: data.email3,
                                status: 'Online',
                                socket_id: socket.id
                            });
                            socket.on('result', function(data) {
                                var cur_user = local.get();
                                for (var i = 0; i < data.arr.length; i++) {
                                    if (cur_user.email == data.arr[i].email3) {
                                        data.arr.splice(i, 1);
                                    }
                                }
                                $scope.$apply(function() {
                                    $rootScope.array = data.arr;
                                });
                            });
                        }
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