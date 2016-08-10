(function(){
    
    'use strict';
    
    angular
        .module('astInterpreter')
        .factory('ast2JsonFactory', function(){
            function traverse(tree) {
                var obj = {};
                if (tree.degree !== undefined) {
                    
                    if (tree.degree() == 0) {
                    obj.name = tree.element;
                    }
                    else {
                        obj.name = tree.element;
                        obj.children = [];
                        for (var i = 0; i < tree.degree() ; i++) {
                            obj.children.push(traverse(tree.getSubTree(i)));
                        }
                        
                    }
                    return obj;
                }
                else{
                    if (tree.subTrees.length === 0) {
                        obj.name = tree.element;
                    }
                    else{
                        obj.name = tree.element;
                        obj.children = [];
                        for(var x = 0; x < tree.subTrees.length; x++){
                            obj.children.push(traverse(tree.subTrees[x]));
                        }
                    }
                    return obj;
                }
            
                
            }
            
            return {
                'traverse': traverse
            };
        });
    
})();