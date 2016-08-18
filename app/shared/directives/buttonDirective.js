 (function(){
    angular
        .module('astInterpreter')
        .directive('animationButton', function(){
            return {
              restrict: 'E',
              replace: true,
              template: '<button ng-click="index = index + 1">{{index}}</button>',
            };
        });
    
})();   
    