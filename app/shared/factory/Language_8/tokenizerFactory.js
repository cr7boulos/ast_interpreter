(function () {
   "use strict"; 
   angular.module('astInterpreter')
        .factory('l8.tokenizerFactory', function () {
           

            function Tokenizer(str) {
            this._tokens = str.trim().split(/\s+/);//RegEx for whitespace
            this._currentToken = 0;

            /**
             This method "consumes" the current token.
            */
            this.nextToken = function() {
                return this._tokens[this._currentToken++];
            }

            /**
             This method both tests and consumes the current token.
            */
            this.match = function(tk) {
                return tk === this._tokens[this._currentToken++];
            }

            /**
             This method allows you to look at the current
            token without consuming it.
            */
            this.peekToken = function() {
                return this._tokens[this._currentToken];
            }

            /**
             This method allows you to look at the token after
            the current token (without consuming any token).
            */
            this.peek2Token = function() {
                return this._tokens[this._currentToken+1];
            }


            /**
             Returns false if all of the tokens have been "consumed".
            */
            this.hasToken = function () {
                return (this._currentToken < this._tokens.length);
            }

            /**
             Use this method for information purposes. It
            allows you to see how a string gets "tokenized".
            */
            this.toString = function() {
                var result = "index = " + this._currentToken + ", _tokens =[";
                result += this._tokens[0];
                for(var x = 1; x < this._tokens.length; x++) {
                    result += ", " + this._tokens[x];
                }
                return result + "]";
            }
        }

        return {
            "Tokenizer": Tokenizer
        };

    });

   
})();