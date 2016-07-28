(function () {
   "use strict"; 

   angular.module('astInterpreter')
   .factory('treeFactory', function(){
       
       function Tree(element) {
            this.element = element;
            this.subTrees = [];

            for(var x = 1; x < arguments.length; x++) {
                if (arguments[x] !== null) {
                    this.subTrees.push(arguments[x]);
                }

            }
            this.addSubTree = function(tree) {
                this.subTrees.push(tree);
            }
            this.getSubTree = function(index) {
                return this.subTrees[index];
            }

            this.degree = function() {
                return this.subTrees.length;
            }
            this.depth = function() {
                var result = 0;
                if (this.degree() > 0) {
                    var max = 0;
                    for(var y = 0; y < this.degree(); y++) {

                        var temp = this.getSubTree(y).depth();
                        if (temp > max) {
                            max = temp;
                        }
                    }
                    result = 1 + max;
                }
                return result;
            }

            this.toString = function() {
                var result = "";
                if (this.subTrees == []) {
                    result += element;
                }
                else {
                    result += "(" + this.element;
                    for(var z = 0; z < this.subTrees.length; z++) {
                        result += " " + this.subTrees[z];
                    }
                    result += ")";
                }
                return result;
            }

        }

        return {
            "Tree": Tree
        };

    });

})();
