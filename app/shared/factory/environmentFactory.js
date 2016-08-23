(function(){
    "use strict";
    angular
        .module('astInterpreter')
        .factory('environmentFactory', function () {
           var envId = 0;

           function Environment(scope, env, label ) {
            var self = this;
            this.variables = [];
            this.values = [];
            this.id = envId++;
            this.label = null; //label is used for debugging purposes; Update: use the label property for naming an env <div> on a webpage
            if (label !== undefined) {
                this.label = label;
            }
            this.nonLocalLink = null;
            if (env !== undefined) {
                this.nonLocalLink = env;
            }
            
            

            /**
                Add a <variable, value> pair to this environment object.
            */
            this.add = function (variable, value) {
                this.variables.push(variable);
                this.values.push(value);
                //emit an "envAdd" event
                //pass along the proper env id when creating the associated <div> on a webpage 
                //text to be displayed in <div> on web pages should be formatted like so:
                //  "var" + [variable name] + "=" + [ VALUE | "function" ]
                // where 'VALUE' := 'INTEGER' | 'BOOLEAN'
                scope.main.addAnimationData({'name': "envAdd",
                    data: {
                        'id': self.id,
                        'label': self.label, //this will name the environment; e.g. 'Global Env'
                        'value': variable + " = " + value, //this will be the text in the new p element
                    }
                });
            };

            this.defined = function (variable) {
                return (null !== this.lookUp(variable));
            };

            this.lookUp = function (variable) {
                //when emitting events an id to the current env ( represented as a div) will need to be passed along
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        // set the color to be green i.e found the variable we are looking for
                        //emit an "envSearch" event
                        break;
                    }
                    //set the color to be red (i.e the variable currently looked up is not the one we want)
                    //emit an "envSearch" event
                }

                if (i < this.variables.length) {
                    return this.values[i];
                }
                else {
                    if (null === this.nonLocalLink) {
                        return null; //variable cannot be found
                    }
                    else {
                        // recursively search the rest of the environment chain
                        return this.nonLocalLink.lookUp(variable);
                    }
                }
            };

            this.definedLocal = function (variable) {
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        break;
                    }
                }

                if (i < this.variables.length) {
                    return true;
                }
                else {
                    return false;
                }
            };

            this.update = function (variable, value) {
                //when emitting events an id to the current env ( represented as a div) will need to be passed along
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        // set the color to be green i.e found the variable we are looking for
                        //emit an "envSearch" event
                        break;
                    }
                    //set the color to be red (i.e the variable currently looked up is not the one we want)
                    //emit an "envSearch" event
                }

                if (i < this.variables.length) {
                    this.values[i] = value;
                    return true;
                }
                else {
                    if (null === this.nonLocalLink) {
                        return false; // variable cannot be found
                    }
                    else {
                        // recursively search the rest of the environment chain
                        return this.nonLocalLink.update(variable, value);
                    }
                }
            };

            /**
                Convert the contents of the environment chain into a string.
                This is mainly for debugging purposes.
                In this JS version I will never need to use the toString() method
            */

            this.toString = function () {
                var result = "";
                if (null !== this.nonLocalLink) {
                    result = this.nonLocalLink.toString() + "\n/\\\n||\n[" + this.label + " Environment";
                }
                else {
                    result += "[Global Environment";
                }

                // Now convert this Environment object.
                for (var i = 0; i < this.variables.length; i++) {
                    result += "\n[ " + this.variables[i] + " = " + this.values[i];
                }


                return result;

                
            };
        } 
        return {
            "Environment": Environment
        };

    });
})();