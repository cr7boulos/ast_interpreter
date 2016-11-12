(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('l6.valueFactory', function () {
            


            function Value(value) {
                if(typeof value === "number") {
                    this.tag = "int";
                    this.valueI = value;
                    this.valueB = false;//default value
                    this.INT_TAG = "int";
                    this.BOOL_TAG = "bool";
                    
                }
                else if(typeof value === "boolean") {
                        this.tag = "bool";
                        this.valueI = 0;//default value
                        this.valueB = value;
                        this.INT_TAG = "int";
                        this.BOOL_TAG = "bool";
                       
                }
                else {
                    this.tag = "unknown";
                    this.valueI = 0;//default value
                    this.valueB = false;//default value
                    this.valueL = null;// valueL holds a Tree object
                    this.INT_TAG = "int";
                    this.BOOL_TAG = "bool";
                    this.LAMBDA_TAG = "lambda";
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