var mainmod3 = angular.module('chat', []);
mainmod3.controller('chatctrl', ['$scope', '$rootScope', '$routeParams', '$location', 'ajax_request', 'local', 'dataShare', '$timeout', function($scope, $rootScope, $routeParams, $location, ajax_request, local, dataShare, $timeout) {
        var socket = io.connect('http://localhost:8080');
        var arr1 = [];
        var local_email = local.get();
        if (local_email.email1) {
            socket.on('connect', function() {
                socket.emit('online', {
                    email2: local_email.email1,
                    status: 'Online',
                    socket_id: socket.id
                });
            });
//                socket.on('result', function(data) {
//                    var cur_user = local.get();
//                    for (var i = 0; i < data.arr.length; i++) {
//                        if (cur_user.email1 == data.arr[i].email3) {
//                            data.arr.splice(i, 1);
//                        }
//                    }
//                    dataShare.set(data.arr);
//                    $timeout(function() {
//                        $rootScope.$broadcast('array');
//                    }, 100);
//                });
        }
        else {
            $location.path('/signup');
        }
        var room;
        var user_id = $routeParams.user_id;
        var email3;
        ajax_request('/messages', {id1: user_id}).then(function(data) {
            $scope.name2 = data.name;
            $scope.image2 = data.image;
            $scope.status2 = data.status;
            $scope.time2 = data.time;
            email3 = data.email3;
            socket.emit('chat_init', {
                email3: email3
            });
        });
        socket.on('self', function(data) {
            room = data.new_room;
        });
        $scope.send_msg = function(msg) {
            $scope.msg = '';
            arr1.push({send_msg: msg, bb: 1});
            ajax_request('/msgstore', {array1: arr1}).then(function(data) {

            });
            local.set(local_email.email1, arr1);
            socket.emit('msg', {
                msg: msg,
                room: room
            });
            $scope.message = arr1;

        };
        socket.on('msg_reply', function(data) {
            arr1.push({receive_msg: data.msg_reply, bb: 2});
            local.set(local_email.email1, arr1);
            $scope.$apply(function() {
                $scope.message = arr1;
            });

        });

        $scope.back = function() {
            $location.path('/users');
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
                dataShare.set(data.arr);
                $timeout(function() {
                    $rootScope.$broadcast('back');
                }, 100);
            });
        };

//        $scope.$on('chat_notification', function() {
//            var arr2 = dataShare.get();
//            $scope.$apply(function() {
//                $scope.message = arr2;
//            });
//        });

    }]);