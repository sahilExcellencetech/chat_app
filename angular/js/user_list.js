var mainmod2 = angular.module('users', []);
mainmod2.controller('ctrl2', ['$scope', '$rootScope', 'Facebook', 'ajax_request', 'local', function($scope, $rootScope, Facebook, ajax_request, local) {
//        setInterval(function() {
//            ajax_request('/register', {num: 1}).then(function(data) {
//                $scope.array = data.arr;
//            });
//        }, 1000);
//        var socket = io('localhost:3000/login');
//        socket.on('connect', function() {
//            console.log('connect event');
//        });
//        socket.on('hello', function(data) {
//            console.log(data);
//            socket.emit('hello_reply', {
//                time: new Date()
//            });
//        });
//        socket.on('disconnect', function() {
//            console.log('disconnect event');
//        });
//        var socket = io.connect('http://localhost:8080/');
//        socket.on('news', function(data) {
//            $scope.array = data.arr;
//        });
    }]);
