 (function(){
    angular
        .module('astInterpreter')
        .directive('animationButton', function(){
            return {
              restrict: 'E',
              replace: true,
              template: '<div><button id="advance" ng-click="main.incrementIndex()">Advance<div>',
            };
        });
    
})();   
    