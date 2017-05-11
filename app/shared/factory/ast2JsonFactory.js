(function(){
    
    'use strict';
    
    angular
        .module('astInterpreter')
        .factory('ast2JsonFactory', function(){
            function traverse(tree) {
                
                // To utilize D3's tree-building capabilities, our AST needs to be
                // properly formatted using the traverse() method in this file.
                // Due to the way AngularJS handles data stored on attributes
                // our tree data structure is no longer an
                // instance of a Tree object; it has been converted to 
                // JSON and thus has all the relevant data intact just without
                // the associated methods. At this point, however, the methods are no
                // longer needed. We traverse the data and return an object
                // that will be consumed by D3.

                var obj = {};
                
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
            
            return {
                'traverse': traverse
            };
        });
    
})();