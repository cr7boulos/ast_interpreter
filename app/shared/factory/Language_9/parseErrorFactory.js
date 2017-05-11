(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('l9.parseErrorFactory', function () {
            

            //the basic structure of these Errors follows
            //the template used here: http://eloquentjavascript.net/08_error.html
            function ParseError(errMessage) {
                this.message = errMessage;
                this.stack = (new Error()).stack;
                this.name = "ParseError";
            }
            ParseError.prototype = Object.create(Error.prototype);

            return {
                "ParseError": ParseError
            };

        });
})();