(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('l9.valueFactory', ['l9.IPEPFactory', function (IPEPFactory) {
            
            var IPEP = IPEPFactory.IPEP;

            function Value(value) {

                // setup code
                this.INT_TAG = "int";
                this.BOOL_TAG = "bool";
                this.LAMBDA_TAG = "lambda";

                this.tag = "unknown";
                this.valueI = 0;
                this.valueB = false;

                if(typeof value === "number") {
                    this.tag = "int";
                    this.valueI = value;
                    
                }
                else if(typeof value === "boolean") {
                        this.tag = "bool";
                        this.valueB = value;
                        
                }
                else  if (value instanceof IPEP) {
                        this.tag = "lambda";
                        this.valueL = value;                   
                }
                else{
                    console.log("we have an error");
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
                        //result += this.valueL;
                        //changing this function may break code somewhere else; be careful!!! D.B. 8/23/16
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