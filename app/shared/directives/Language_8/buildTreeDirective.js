(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL8', [ 'l8.parserFactory', function(parserFactory){
                        
                        console.log('Parser required');
                        
                        
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

