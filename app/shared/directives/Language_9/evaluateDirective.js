(function(){
    /*
        4.b
            This part of the data pipeline calls the actual interpreter
            (the Evaluate.evaluate function) every time the 'data' attribute
            on the d3-ast tag changes. This concludes this branch of the data pipeline.
            Please return to the previous stage (3.a) for info on viewing the other branch in the 
            pipeline.
     */
angular
    .module('astInterpreter')
    .directive('evaluateL9', ['l9.evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
            //   console.log('Language 8');
            //   console.log(scope);
            //   console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST(); //we grab the AST from the main controller
                                             //directly since the AST attached to the data
                                             //attribute is in JSON form and hence unsuited for
                                             //the Evaluate.evaluate function.
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    // console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast));
                    // console.log(ast);
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();
