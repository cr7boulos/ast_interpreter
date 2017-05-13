(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('valueFactory', ['treeFactory', function (treeFactory) {
            
            var Tree = treeFactory.Tree;

            function Value(value) {

                //default values
                this.tag = "unknown";
                this.valueI = 0;
                this.valueB = false;
                this.valueL = null;

                this.INT_TAG = "int";
                this.BOOL_TAG = "bool";
                this.LAMBDA_TAG = "lambda";

                if(typeof value === "number") {
                    this.tag = "int";
                    this.valueI = value;
                }
                else if(typeof value === "boolean") {
                    this.tag = "bool";
                    this.valueB = value;
                }
                else if (value instanceof Tree) {
                    this.tag = "lambda";
                    this.valueL = value;
                }
                    
                else{
                    console.log("Something went wrong");
                    console.log(Value);
                }

        
                this.toString = function () {
                    var result = "";

                    if (this.tag === this.BOOL_TAG) {
                        result += this.valueB;
                    }
                    else if (this.tag === this.INT_TAG) {
                        result += this.valueI;
                    }
                    else if (this.tag === this.LAMBDA_TAG) {
                        result += "function";
                    }
                    else {
                        // bad tag (shouldn't get here)
                        result += "[tag->" + this.tag + ", valueI->" + this.valueI
                                            + ", valueB->" + this.valueB
                                            + ", valueL->" + this.valueL + "]";
                    }

                    return result;

                    }
            }

            return {
                "Value": Value
            };
        }]);

    })();