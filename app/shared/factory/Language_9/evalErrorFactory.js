(function () {
    "use strict";

    angular
        .module('astInterpreter')
        .factory('l8.evalErrorFactory', function(){
            

            //the basic structure of these Errors follows
            //the template used here: http://eloquentjavascript.net/08_error.html

            //used the more verbose EvaluationError since EvalError is
            //already in use by the JavaScript language
            
            function EvaluationError(errMessage) {
                this.message = errMessage;
                this.stack = (new Error() ).stack;
                this.name = "EvaluationError";
            }

            

            EvaluationError.prototype = Object.create(Error.prototype);
            return {
                "EvaluationError": EvaluationError
            };
    });
})();