/**
 * Created by michaeldfti on 13/05/16.
 */

angular.module("cognitiveChatBox").config(['$routeProvider',function($routeProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'app/components/home/home.html',
            controller: 'homeController'
        }).
        otherwise({
            redirectTo: '/'
        });

}]);