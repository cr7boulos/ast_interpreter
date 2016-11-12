(function(){
    
angular
    .module('astInterpreter')
    .directive('evaluateL6', ['l6.evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
              console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST();
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast));
                    console.log(scope.main.getAnimationData());
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();
