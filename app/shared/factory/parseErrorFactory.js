(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('parseErrorFactory', ['$scope', function ($scope) {
            $scope.ParseError = ParseError;

            //the basic structure of these Errors follows
            //the template used here: http://eloquentjavascript.net/08_error.html
            function ParseError(errMessage) {
                this.message = errMessage;
                this.stack = (new Error()).stack;
                this.name = "ParseError";
            }
            ParseError.prototype = Object.create(Error.prototype);

        }]);
})();