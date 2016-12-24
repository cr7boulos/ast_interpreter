(function() {
    "use strict"

    /**
     * This object does two things: create a String
     * of all the nodes on the tree in preOrder or
     * postOrder and numbers the nodes accordingly 
     * so that D3 can animate them in the correct order 
     * as well.
     */
angular
    .module('astInterpreter')
    .factory('traverseFactory', function(){
        function Traverse(){
            this.counter = 0; 

            this.preOrder = function(tree){
                var result = "";
                // "process" the root node
                result += tree.element + " ";
                tree.numId = this.counter++;
                
                // recursively traverse all the sub trees
                for (var i = 0; i < tree.degree(); i++) {
                    result += this.preOrder(tree.getSubTree(i));
                }
                
                return result;
            }//preOrder()

            this.postOrder = function(tree) {
                var result = "";
                // recursively traverse all the sub trees
                for (var i = 0; i < tree.degree(); i++) {
                    result += this.postOrder(tree.getSubTree(i));
                }
                
                // "process" the root node
                result += tree.element + " ";
                tree.numId = this.counter++;
                
                return result;
            }//postOrder()
        }

        return {
            'Traverse': Traverse,
        }
    });
    
    
    
    
    
    
    
})();