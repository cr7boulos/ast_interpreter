 (function(){
    angular
        .module('astInterpreter')
        .directive('animationButton', function(){
            return {
              restrict: 'E',
              replace: true,
              template: '<div><button ng-click="main.incrementIndex()">Advance</button><button ng-click="main.decrementIndex()">Reverse</button><div>',
            };
        });
    
})();   
    