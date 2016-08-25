 (function(){
    angular
        .module('astInterpreter')
        .directive('animationButton', function(){
            return {
              restrict: 'E',
              replace: true,
              template: '<div><button id="advance" ng-click="main.incrementIndex()">Advance</button><button id="reverse" ng-click="main.decrementIndex()">Reverse</button><div>',
            };
        });
    
})();   
    