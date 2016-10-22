(function(){
    
angular
    .module('astInterpreter')
    .directive('evaluateL8', ['l8.evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
              console.log('Language 8');
              console.log(scope);
              console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST();
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast));
                    console.log(ast);
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();
