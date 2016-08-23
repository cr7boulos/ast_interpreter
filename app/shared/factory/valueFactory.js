(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('valueFactory', function () {
            


            function Value(value) {
                if(typeof value === "number") {
                    this.tag = "int";
                    this.valueI = value;
                    this.valueB = false;//default value
                    this.INT_TAG = "int";
                    this.BOOL_TAG = "bool";
                    this.LAMBDA_TAG = "lambda";
                }
                else if(typeof value === "boolean") {
                        this.tag = "bool";
                        this.valueI = 0;//default value
                        this.valueB = value;
                        this.INT_TAG = "int";
                        this.BOOL_TAG = "bool";
                        this.LAMBDA_TAG = "lambda";
                }
                else {
                    if (typeof value === "object") {
                        this.tag = "lambda";
                        this.valueI = 0;//default value
                        this.valueB = false;//default value
                        this.valueL = value;// valueL holds a Tree object
                        this.INT_TAG = "int";
                        this.BOOL_TAG = "bool";
                        this.LAMBDA_TAG = "lambda";
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
        });

    })();