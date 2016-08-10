(function(){
    'use strict';

    angular
        .module('astInterpreter')
        .controller("AController", 
            ['$scope', 'tokenizerFactory', 'buildTreeFactory',
            'evaluateFactory', function($scope, tokenizerFactory, buildTreeFactory, evaluateFactory){
               

                var program = "( prog " +
                                "( var y 6 ) " +
                                "( fun f ( lambda x ( * x y ) ) ) " +  // y is a non-local reference
                                "( apply f 5 ) )";
                                
                

                var Tokenizer = tokenizerFactory.Tokenizer;
                var BuildTree = buildTreeFactory.BuildTree;
                var Evaluate = evaluateFactory.Evaluate;

                var t = new Tokenizer(program);
                var b = new BuildTree(t);
                var ast = b.getTree();

                var e = new Evaluate();
                this.result = e.evaluate(ast);
                console.log(this.result.valueI);
                
                

            }]);
})();