(function(){

    
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL0', [ 'l0.buildTreeFactory','tokenizerFactory', 'traverseFactory', 
                    function(buildTreeFactory, tokenizerFactory, traverseFactory ){
                        
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(){
                                    var Tokenizer = tokenizerFactory.Tokenizer;
                                    var BuildTree = buildTreeFactory.BuildTree;
                                    this.Traverse = traverseFactory.Traverse;
                                    
                                    this.createTree = function(tkStr){
                                        var t = new Tokenizer(tkStr);
                                        var b = new BuildTree(t);
                                        
                                        return b.getTreePreOrder();
                                    }
                                },
                                require: 'buildTreeL0',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        var ast = buildTreeController.createTree(newContent);

                                        var strResult;
                                        var Traverse =  buildTreeController.Traverse;
                                        var traverse = new Traverse(scope);

                                        if(!scope.preOrder){
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.postOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        else{
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.preOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        
                                        console.log(strResult);
                                        scope.main.setAST(ast);
                                        
                                    });

                                    attrs.$observe('ordering', function(){
                                        var ast = scope.main.getAST(); //note: the AST has not changed

                                        var strResult; 
                                        var Traverse =  buildTreeController.Traverse;
                                        var traverse = new Traverse(scope);

                                        if(!scope.preOrder){
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.postOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        else{
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.preOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        
                                        console.log(strResult);
                                        
                                        scope.main.setAST(ast);
                                        
                                    });
                                }
                            };
            }]);
            
})();

