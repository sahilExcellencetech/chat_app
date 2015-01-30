var mainmod2 = angular.module('users', []);
mainmod2.controller('ctrl2', ['$scope', '$rootScope', 'Facebook', 'ajax_request', 'local', function($scope, $rootScope, Facebook, ajax_request, local) {
        var socket = io.connect('http://localhost:8080/');
        $scope.logout = function() {
            var del = local.get();
            socket.emit('offline', {
                email: del.email,
                status: 'Offline'
            });
            socket.on('result', function(data) {
                for (var i = 0; i < data.arr.length; i++) {
                    if (del.email == data.arr[i].email3) {
                        data.arr.splice(i, 1);
                    }
                }
                $scope.$apply(function() {
                    $scope.array = data.arr;
                });
            });
            $scope.list = false;
            $rootScope.signup = true;
            delete del.email;
        };

        socket.on('disconnect', function() {
            var dis = local.get();
            socket.emit('discon', {
                email5: dis.email
            });
            socket.on('result', function(data) {
                for (var i = 0; i < data.arr.length; i++) {
                    if (dis.email == data.arr[i].email3) {
                        data.arr.splice(i, 1);
                    }
                }
                $scope.$apply(function() {
                    $scope.array = data.arr;
                });
            });
        });



    }]);
