angular
    .module('astInterpreter')
    .config(['$routeProvider', function($routeProvider){
        
        $routeProvider
        .when('/',
        {
            templateUrl: './app/routes/language7.html',
            
        })
        .when('/menu-toggle',
        {
            templateUrl: './app/routes/language7.html',
            
        })
        .when('/language1',
        {
            templateUrl: './app/routes/test.html',
            
        })
        .otherwise(
        {
            template: '<h1>Something is wrong<h1>',
        });
    }]);
    