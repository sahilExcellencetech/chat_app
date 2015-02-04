var mainmod2 = angular.module('users', []);
mainmod2.controller('loginctrl', ['$scope', '$rootScope', '$location', 'Facebook', 'ajax_request', 'local', 'dataShare', '$timeout', function($scope, $rootScope, $location, Facebook, ajax_request, local, dataShare, $timeout) {
        var socket = io.connect('http://localhost:8080/');
        var local_email = local.get();
        if (local_email.email1) {

            socket.on('connect', function() {
                socket.emit('online', {
                    email2: local_email.email1,
                    status: 'Online',
                    socket_id: socket.id
                });
                socket.on('result', function(data) {
                    var cur_user = local.get();
                    for (var i = 0; i < data.arr.length; i++) {
                        if (cur_user.email1 == data.arr[i].email3) {
                            data.arr.splice(i, 1);
                        }
                    }
                    $scope.$apply(function() {
                        $scope.array = data.arr;
                    });
                });
            });
        }
        else {
            $location.path('/signup');
        }

//        var arr1=[];
//        socket.on('msg_reply', function(data) {
//            arr1.push({receive_msg: data.msg_reply, bb: 2});
//            dataShare.set(arr1);
//            $timeout(function() {
//                $rootScope.$broadcast('chat_notification');
//            }, 100);
//        });

        socket.on('chat_init1', function(data) {
            socket.emit('chat_init1_reply', {
                new_room1: data.new_room
            });
        });

        $scope.$on('array', function() {
            var arr = dataShare.get();
            $scope.$apply(function() {
                $scope.array = arr;
            });
        });

        $scope.$on('back', function() {
            var arr = dataShare.get();
            $scope.$apply(function() {
                $scope.array = arr;
            });
        });

        $scope.logout = function() {
            var del = local.get();
            socket.emit('offline', {
                email: del.email1,
                status: 'Offline'
            });
            socket.on('result', function(data) {
                console.log("data");
                for (var i = 0; i < data.arr.length; i++) {
                    if (del.email1 == data.arr[i].email3) {
                        data.arr.splice(i, 1);
                    }
                }
                $scope.$apply(function() {
                    $scope.array = data.arr;
                });
            });
            $location.path('/signup');
            delete del.email1;
        };

        socket.on('disconnect', function() {
            var dis = local.get();
            socket.emit('discon', {
                email5: dis.email1
            });
            socket.on('result', function(data) {
                for (var i = 0; i < data.arr.length; i++) {
                    if (dis.email1 == data.arr[i].email3) {
                        data.arr.splice(i, 1);
                    }
                }
                $scope.$apply(function() {
                    $scope.array = data.arr;
                });
            });
        });

    }]);
