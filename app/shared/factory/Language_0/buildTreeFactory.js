/**
   A Tree is defined by the following grammar.

     Tree ::= '(' String Tree+ ')'
            | String

   where '(' and ')' are literals, and Tree+ means "one or more".

   This language also assumes that all tokens have white space around them.

   The static method getTreePreOrder() is essentially a recursive descent
   parser for this Tree langauge.

   Notice that this version of BuildTree has a lot more error checking.
*/


(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('l0.buildTreeFactory', [ 'treeFactory',
          function ( treeFactory) {
            console.log("Hello world");
            var Tree = treeFactory.Tree;
            //var ParseError = parseErrorFactory.ParseError;

            function BuildTree(tokenizer) { 
                this.counter = 0;//numId should be zero-indexed not one-indexed. 8/21/16
                this.tokens = tokenizer;
                

                this.getTreePreOrder = function() {
                    //throws a ParseError

                    var result = null; //this will be a Tree object

                    if (!this.tokens.hasToken()) { // there should be another token

                        throw new ParseError("unexpected end of input: " + "\n" + tokens + "\n");
                    }
                    var token = this.tokens.nextToken(); // consume one token

                    if (token === "(") { // look for a parenthesized tree

                        if (!this.tokens.hasToken()) { // there should be another token

                            throw new ParseError("unexpected end of input: " + "\n" + this.tokens + "\n");
                        }

                        result = new Tree(this.tokens.nextToken()); // consume the root of the tree
                        result.numId = this.counter++;

                        result.addSubTree(this.getTreePreOrder(this.tokens));    // consume first sub tree

                        if (!this.tokens.hasToken()) { // there should be another token
                            
                            throw new ParseError("unexpected end of input: " + "\n" + this.tokens + "\n");
                        }

                        token = this.tokens.peekToken(); //one character look ahead

                        while (!(token === ")")) {

                            result.addSubTree(this.getTreePreOrder(this.tokens)); // consume the sub tree

                            if (!this.tokens.hasToken()) { // there should be another token
                                
                                throw new ParseError("unexpected end of input: " + "\n" + this.tokens + "\n");
                            }
                            token = this.tokens.peekToken(); //one character look ahead
                        }
                        this.tokens.match(")"); // consume the matching ")"

                    }
                    else {
                        result = new Tree(token); // the tree must be just the root
                        result.numId = this.counter++;
                    }
                    

                    return result;
                }; //getTreePreOrder()

                
        }

        return {
            "BuildTree": BuildTree
        };
    }]);
})();