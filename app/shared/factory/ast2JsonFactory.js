(function(){
    
    'use strict';
    
    angular
        .module('astInterpreter')
        .factory('ast2JsonFactory', function(){
            function traverse(tree) {
                var obj = {};
            
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
            
            return {
                'traverse': traverse
            };
        });
    
})();