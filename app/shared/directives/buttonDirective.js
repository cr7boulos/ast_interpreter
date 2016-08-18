 (function(){
    angular
        .module('astInterpreter')
        .directive('animationButton', function(){
            return {
              restrict: 'E',
              replace: true,
              template: '<div><button ng-click="index = index + 1">Advance</button><button ng-click="index = index - 1">Reverse</button><div>',
            };
        });
    
})();   
    