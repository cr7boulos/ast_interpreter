(function(){

    /*
        3.a
            This directive watches the 'editorcontent' attribute
            for changes and then creates an AST from the code 
            editor's contents. The AST is made available to the 
            other components on the page via the 'data' attribute on the 
            d3-ast tag. The next two brnaching stages can be found here:

                app/ast/astDirective.js
                app/shared/directives/Language_8/evaluateDirective.js
     */
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL8', [ 'l8.parserFactory', function(parserFactory){
                        
                        // console.log('Parser required');
                        
                        
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(){
                                    //var Tokenizer = tokenizerFactory.Tokenizer;
                                    //var BuildTree = buildTreeFactory.BuildTree;
                                    
                                    this.createTree = function(tkStr){
                                        var Parser = parserFactory.Parser;
                                        var p = new Parser();
                                        
                                        return p.parse(tkStr);
                                    }
                                },
                                require: 'buildTreeL8',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        scope.main.setAST(buildTreeController.createTree(newContent));
                                        
                                    });
                                }
                            };
            }]);
            
})();

