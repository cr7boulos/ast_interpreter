(function () {
   "use strict"; 
   angular.module('astInterpreter')
        .factory('tokenizerFactory', function () {
           

            function Tokenizer(str) {

            //Code is based off C code snippets from the following book:
            //Sebesta, Robert W. Concepts of programming languages. Boston: Pearson, 2016. Print.
            //See pages 163-171

            this._DIGIT = 1;//make const in ES6
            this._LETTER = 0;
            this._UNKNOWN = 99;
            this._WHITESPACE = 101;
            this._EOI = 100; //End of Input

            this._charClass = 0; //used for determining what kind of character we are working with.
            this._currentChar = "";
            
            this._rawString = str;
            this._currentIndex = 0;
            this._lexeme = "";
            this._tokens = [];
            // this._tokens = str.trim().split(/\s+/);//RegEx for whitespace
            this._currentToken = 0;


            

            /**
             * This method "consumes" the next character in the raw input string.
             */
            this._getChar = function(){
                //console.log("Current index: ");
                //console.log(this._currentIndex);
                if(this._currentIndex < this._rawString.length){
                    this._currentChar = this._rawString[this._currentIndex++];

                    if(this._currentChar.match(/[A-Za-z]/)){
                        this._charClass = this._LETTER;
                    }
                    else if(this._currentChar.match(/\d/)){
                        this._charClass = this._DIGIT;
                    }
                    else if(this._currentChar.match(/\s/)){
                        this._charClass = this._WHITESPACE;
                    }
                    else{
                        this._charClass = this._UNKNOWN;
                    }
                }
                else{
                    this._charClass = this._EOI;
                }
                //console.log("Current char");
                //console.log(this._currentChar);
            }

            /**
             * This handles the same responsibilities as the "lookup" function
             * in the Sebesta book on page 168.
             */
            this._addUnknown = function(){
                this._tokens.push(this._currentChar); //all characters of class UNKNOWN are single-
                                                      //character lexemes. Thus we add the character directly 
                                                      //into the array of tokens
                //console.log(this._tokens);
            }
                    
            

            /**
             * This method appends the current character onto the lexeme we 
             * are currently creating.
             */
            this._addChar = function(){
                this._lexeme = this._lexeme + this._currentChar;
            }

            this._lex = function(){
                //console.log("Lex was called!");
                //console.log("length of string input");
                //console.log(this._rawString.length);
                this._getChar(); //initialize all the required variables

                while(this._charClass != this._EOI){
                    switch(this._charClass){

                        case this._LETTER:
                            this._addChar();
                            this._getChar();
                            while(this._charClass == this._LETTER || 
                                  this._charClass == this._DIGIT) {
                                    this._addChar();
                                    this._getChar();
                            }
                            this._tokens.push(this._lexeme); //add the lexeme we have created to the array
                            //console.log(this._tokens);

                            //always remember to execute the following line!!!
                            this._lexeme = ""; //reset the variable in preparation for building the next lexeme. 
                            break;

                        case this._DIGIT:
                            this._addChar();
                            this._getChar();
                            while(this._charClass == this._DIGIT){
                                this._addChar();
                                this._getChar();
                            }
                            this._tokens.push(this._lexeme); //add the lexeme we have created to the array
                            //console.log(this._tokens);

                            //always remember to execute the following line!!!
                            this._lexeme = ""; //reset the variable in preparation for building the next lexeme. 
                            break;

                            case this._WHITESPACE:
                                this._getChar();
                                break;

                        //Parentheses and operands
                        case this._UNKNOWN:
                            this._addUnknown();
                            this._getChar();
                            break;

                    }
                }
                //console.log("Exited the loop");
            }

            this._lex(); //this method call will properly initialize the tokens array.

            //Code above is based off of C code from the programming langauges textbook

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