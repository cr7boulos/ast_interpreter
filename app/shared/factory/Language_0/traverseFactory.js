(function() {
    "use strict"

   
angular
    .module('astInterpreter')
    .factory('traverseFactory', function(){
        function Traverse(scope){
            var traverseColor = "#14A84A"; // defualt color to use when highlighting the current node or: "#14A84A" "#3885A8"
                                                              //color codes from http://color.adobe.com  //^green   ^light-blue
            

            this.preOrder = function(tree){
                var result = "";
                // "process" the root node
                result += tree.element + " ";
                
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
               
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
                
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                
                
                return result;
            }//postOrder()
        }

        return {
            'Traverse': Traverse,
        }
    });
    
    
    
    
    
    
    
})();