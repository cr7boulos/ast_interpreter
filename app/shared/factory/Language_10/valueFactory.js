(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('l10.valueFactory', ['l10.consCellFactory', 'l10.IPEPFactory', function (consCellFactory, IPEPFactory) {
            
        //TODO: make this code DRY

        var ConsCell = consCellFactory.ConsCell;
        var IPEP = IPEPFactory.IPEP;

        function Value (value) {
            //console.log("Value passed:")
            //console.log(value);
            if(typeof value === "number") {
                this.tag = "int";
                this.valueI = value;
                this.valueB = false;//default value
                this.valueL = null;
                this.valueS = null;
                this.valueCC = null;
                //console.log("Got a number");
            }
            else if(typeof value === "boolean") {
                    this.tag = "bool";
                    this.valueI = 0;//default value
                    this.valueB = value;
                    this.valueL = null;
                    this.valueS = null;
                    this.valueCC = null;
                    //console.log("Got a boolean");
            }
            else if (typeof value === "string") {
                this.tag = "sym";
                this.valueI = 0;//default value
                this.valueB = false;// default value
                this.valueL = null;// valueL holds an IPEP object
                this.valueS = value;
                this.valueCC = null;
                //console.log("Got a symbol");
            }
            else if (value instanceof IPEP) {
                
                this.tag = "lambda";
                this.valueI = 0;//default value
                this.valueB = false;//default value
                this.valueL = value; // valueL holds an IPEP object
                this.valueS = null;
                this.valueCC = null;
                //console.log("Got an IPEP");
                
            }
            else if (value instanceof ConsCell) {
                //value := ConsCell
                this.tag = "list";
                this.valueI = 0;//default value
                this.valueB = false;//default value
                this.valueL = null; // valueL holds an IPEP object
                this.valueS = null;
                this.valueCC = value;
                //console.log("Got a ConsCell");
                
            }
            else if (value === undefined || value === null) {
                //this is functioning like a default constructor
                //e.g. var val = new Value()
                //value := ConsCell
                this.tag = "list";
                this.valueI = 0;//default value
                this.valueB = false;//default value
                this.valueL = null; // valueL holds an IPEP object
                this.valueS = null;
                this.valueCC = null;
                //console.log("Got a list");
            }
            else {
                this.tag = "unknown";
                this.valueI = 0;//default value
                this.valueB = false;//default value
                this.valueL = null;// valueL holds an IPEP object
                this.valueS = null;
                this.valueCC = null;
                //console.log("Got a unknown value:");
                //console.log(value);
                
            }
            this.INT_TAG = "int";
            this.BOOL_TAG = "bool";
            this.LAMBDA_TAG = "lambda";
            this.LIST_TAG = "list";
            this.SYMBOL_TAG = "sym";

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
                else if (this.tag === this.LIST_TAG) {
                    result += "[" + this.valueCC + " ]";
                }
                else if (this.tag === this.SYMBOL_TAG) {
                    result += this.valueS;
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