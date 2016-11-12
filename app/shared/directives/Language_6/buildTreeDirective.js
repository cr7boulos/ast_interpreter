(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL6', ['tokenizerFactory', 'buildTreeFactory', function(){
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(tokenizerFactory, buildTreeFactory){
                                    var Tokenizer = tokenizerFactory.Tokenizer;
                                    var BuildTree = buildTreeFactory.BuildTree;
                                    
                                    this.createTree = function(tkStr){
                                        var t = new Tokenizer(tkStr);
                                        var b = new BuildTree(t);
                                        return b.getTree();
                                    }
                                },
                                require: 'buildTreeL6',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        scope.main.setAST(buildTreeController.createTree(newContent));
                                        
                                    });
                                }
                            };
            }]);
            
})();

