(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('l6.valueFactory', function () {
            


            function Value(value) {

                //default values
                this.tag = "unknown";
                this.valueI = 0;
                this.valueB = false;
                this.INT_TAG = "int";
                this.BOOL_TAG = "bool";

                if(typeof value === "number") {
                    this.tag = "int";
                    this.valueI = value;
                    
                }
                else if(typeof value === "boolean") {
                    this.tag = "bool";
                    this.valueB = value;
                       
                }
                else {
                    console.log("Bad Value param passed:");
                    console.log(value);
                }
            
            

        
                this.toString = function () {
                    var result = "";

                    if (this.tag === this.BOOL_TAG) {
                        result += this.valueB;
                    }
                    else if (this.tag === this.INT_TAG) {
                        result += this.valueI;
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
        });

    })();