// thanks to this YouTube Tutorial
//https://www.youtube.com/watch?v=ZtqzeYooMw4

angular
    .module('astInterpreter')
    .config(['$routeProvider', function($routeProvider){
        
        $routeProvider
        .when('/',
        {
            templateUrl: './app/routes/language7.html',
            
        })
        .when('/language1',
        {
            templateUrl: './app/routes/language0.html',
            
        })
        .when('/language6',
        {
            templateUrl: './app/routes/language6.html',
            
        })
        .when('/language7',
        {
            templateUrl: './app/routes/language7.html',
            
        })
        .when('/language8',
        {
            templateUrl: './app/routes/language8.html',
            
        })
        .when('/language9',
        {
            templateUrl: './app/routes/language9.html',
            
        })
        .otherwise(
        {
            template: '<h1>Something is wrong<h1>',
        });
    }]);
    