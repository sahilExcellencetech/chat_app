var mainmod = angular.module('chat_app', ['ngStorage', 'common', 'facebook', 'users', 'chat', 'signup', 'ngRoute']);
mainmod.config(function(FacebookProvider) {
    FacebookProvider.init('1600665563479778');
});
mainmod.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/signup', {
                    templateUrl: 'partials/signup.html',
                    controller: 'signupctrl'
                }).
                when('/login', {
                    templateUrl: 'partials/login.html',
                    controller: 'signupctrl'
                }).
                when('/users', {
                    templateUrl: 'partials/user_list.html',
                    controller: 'loginctrl'
                }).
                when('/users/:user_id', {
                    templateUrl: 'partials/chat.html',
                    controller: 'chatctrl'
                }).
                otherwise({
                    redirectTo: '/signup'
                });
    }]);