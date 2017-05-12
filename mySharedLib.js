(function(){
    
    'use strict';
    
    angular
        .module('astInterpreter')
        .factory('ast2JsonFactory', function(){
            function traverse(tree) {
                
                // To utilize D3's tree-building capabilities, our AST needs to be
                // properly formatted using the traverse() method in this file.
                // Due to the way AngularJS handles data stored on attributes
                // our tree data structure is no longer an
                // instance of a Tree object; it has been converted to 
                // JSON and thus has all the relevant data intact just without
                // the associated methods. At this point, however, the methods are no
                // longer needed. We traverse the data and return an object
                // that will be consumed by D3.

                var obj = {};
                
                if (tree.subTrees.length === 0) {
                    obj.name = tree.element;
                }
                else{
                    obj.name = tree.element;
                    obj.children = [];
                    for(var x = 0; x < tree.subTrees.length; x++){
                        obj.children.push(traverse(tree.subTrees[x]));
                    }
                }
                return obj;
            }
            
            return {
                'traverse': traverse
            };
        });
    
})();

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

(function() {
    "use strict"

   
angular
    .module('astInterpreter')
    .factory('traverseFactory', function(){
        function Traverse(scope){
            var traverseColor = "#14A84A"; // defualt color to use when highlighting the current node or: "#14A84A" "#3885A8"
                                                              //color codes from http://color.adobe.com  //^green   ^light-blue
            

            this.preOrder = function(tree){
                var result = "";
                // "process" the root node
                result += tree.element + " ";
                
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
               
                // recursively traverse all the sub trees
                for (var i = 0; i < tree.degree(); i++) {
                    result += this.preOrder(tree.getSubTree(i));
                }
                
                return result;
            }//preOrder()

            this.postOrder = function(tree) {
                var result = "";
                // recursively traverse all the sub trees
                for (var i = 0; i < tree.degree(); i++) {
                    result += this.postOrder(tree.getSubTree(i));
                }
                
                // "process" the root node
                result += tree.element + " ";
                
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                
                
                return result;
            }//postOrder()
        }

        return {
            'Traverse': Traverse,
        }
    });
    
    
    
    
    
    
    
})();

(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('l10.buildTreeFactory', [ 'treeFactory',
          function ( treeFactory) {
            
            var Tree = treeFactory.Tree;
            //var ParseError = parseErrorFactory.ParseError;

            function BuildTree(tokenizer) { 
                this.counter = 0;//numId should be zero-indexed not one-indexed. 8/21/16
                this.tokens = tokenizer;
                

                this.getTree = function() {
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

                        result.addSubTree(this.getTree(this.tokens));    // consume first sub tree

                        if (!this.tokens.hasToken()) { // there should be another token
                            
                            throw new ParseError("unexpected end of input: " + "\n" + this.tokens + "\n");
                        }

                        token = this.tokens.peekToken(); //one character look ahead

                        while (!(token === ")")) {

                            result.addSubTree(this.getTree(this.tokens)); // consume the sub tree

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
                }; //getTree()
        }

        return {
            "BuildTree": BuildTree
        };
    }]);
})();

(function () {
   "use strict"; 

   angular.module('astInterpreter')
   .factory('l10.consCellFactory', function(){
       
       function ConsCell(carValue, cdrCC) {
            this.car = carValue;
            this.cdr = cdrCC;

            this.toString = function () {
                var result = "";
                if (this.car !== null) {
                    result += " " + this.car;
                    if (this.cdr !== null) {
                        result += this.cdr;
                    }
                }
                return result;
            }
        }//ConsCell

        return {
            "ConsCell": ConsCell
        };

    });

})();


(function(){
    /**
   An Environment object holds <variable,value> pairs and
   it has a link to the rest of the objects in the environment
   chain. This link is used to look up "non-local" variable
   references.

   The Environment interface has methods for
   1) Adding new <variable,value> pairs to this environment object.
   2) Looking up a variable to see if it is in the Environment chain.
   2) Looking up a variable to see if it is in this Environment object.
   3) Looking up a variable's value from the variable's <variable,value> pair.
   4) Mutating the value part of a varaible's <variable,value> pair.
*/
    "use strict";
    angular
        .module('astInterpreter')
        .factory('l10.environmentFactory', function () {
           var envId = 1;

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

            this.defined = function (variable, emitEvents) {
                return (null !== this.lookUp(variable, emitEvents));
            };
            
            
            //I need to set a parameter to tell the lookUp function if it should emit events or not
            this.lookUp = function (variable, emitEvents) {
                //when emitting events an id to the current env ( represented as a div) will need to be passed along
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        //if emitEvents is undefined assume the user wants events emitted
                        if (emitEvents) {
                            // set the color to be green i.e found the variable we are looking for
                            //emit an "envSearch" event
                            scope.main.addAnimationData({'name': "envSearch",
                                data: {
                                    'id': self.id,
                                    'label': self.label, 
                                    'childRank': i + 1,
                                    'color': "#5FAD00", //green; color code from color.adobe.com
                                }
                            });
                        }
                        
                        break;
                    }
                    //if emitEvents is undefined assume the user wants events emitted
                    if (emitEvents) {
                       //set the color to be red (i.e the variable currently looked up is not the one we want)
                       //emit an "envSearch" event
                       scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#FF4", //yellow; color code from color.adobe.com
                            }
                        });
                    }
                    
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
                        return this.nonLocalLink.lookUp(variable, emitEvents);
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
                        scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#5FAD00", //green; color code from color.adobe.com
                            }
                        });
                        break;
                    }
                    //set the color to be red (i.e the variable currently looked up is not the one we want)
                    //emit an "envSearch" event
                    scope.main.addAnimationData({'name': "envSearch",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'color': "#FF4", //yellow; color code from color.adobe.com "#FF4"
                        }
                    });
                }

                if (i < this.variables.length) {
                    this.values[i] = value;
                    scope.main.addAnimationData({'name': "envUpdate",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'value': variable + " = " + value,
                            'color': "#FF0302", //red; I want the user to note the change made
                        }
                    });
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

(function () {
    "use strict";

    angular
        .module('astInterpreter')
        .factory('l9.evalErrorFactory', function(){
            

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

(function () {
    "use strict";

    angular
    .module('astInterpreter')
    .factory('l10.evaluateFactory', 
    [ 'l10.environmentFactory',
         'l10.valueFactory', 'l8.evalErrorFactory', 'l10.IPEPFactory', 'l10.consCellFactory', 
        function(environmentFactory, valueFactory, evalErrorFactory, IPEPFactory, consCellFactory) {
            
        
        //Be careful of code breaking due to angular module name!!!
        var EvalError = evalErrorFactory.EvaluationError;
        
        var Environment = environmentFactory.Environment;
        var Value = valueFactory.Value;
        
        var IPEP = IPEPFactory.IPEP;

        var ConsCell = consCellFactory.ConsCell;
        //var EvalError = evalErrorFactory.EvaluationError;

    function Evaluate(scope) {
        //don't set this variable to 1 when running large programs
        //can cuase stack overflows due to large environments!!
        this.DEBUG = 0; //always keep this set to zero when running on Angularjs!
        var self = this;
        this.globalEnv = null;
        this.env = null;
        var traverseColor = "#14A84A"; // defualt color to use when highlighting the current node or: "#14A84A" "#3885A8"
        var id = 0; //used for the animation of nodes      //color codes from http://color.adobe.com  //^green   ^light-blue
        this.evaluate = function (tree) {
            //throws EvalError
            
            return this.evaluateProg(tree);
        }//evaluate()

        this.evaluateProg = function (tree) {


            //var result := Value
            var result = null;

            // Instantiate the global environment
            // (it will always be at the end of the
            // environment chain).
            this.globalEnv = new Environment(scope, null, "Global Env");
            this.env = this.globalEnv;
            
            //emit a "envStackPush" event
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.globalEnv.id,
                        'label': self.globalEnv.label,
                    }
            });

            // Check whick kind of Prog we have.
            if (!(tree.element === "prog")) {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate the single expression.
                //console.log("calling evaluateExp");
                result = this.evaluateExp(tree);
            }
            else {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate each Fun or Exp in the Prog.
                // Any Fun will have the side effect of putting
                // a function name in the global environment.
                // Any Var expressions will have the side effect
                // of putting a variable in the environment chain.
                // Any Set expressions will have the side effect
                // of changing a value in the environment chain.
                // Any Print expressions will have the side effect
                // of printing an output.
                // Any other expressions would be pointless!
                for (var i = 0; i < tree.degree() - 1 ; i++) {

                    //if (tree.getSubTree(i).element === "fun") {
                    //      scope.main.addAnimationData({'name': "nodeTraversal",
                    //            data: {
                    //                'id': tree.getSubTree(i).numId,
                    //                'color': traverseColor,
                    //                'node': tree.getSubTree(i).element,
                    //            }
                    //      });                      
                    //    this.handleFun(tree.getSubTree(i));
                    //}
                    //else {
                        this.evaluateExp(tree.getSubTree(i));
                    //}
                }

                // Evaluate the last expression and use its
                // value as the value of the prog expression.

                result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            }

            return result;

        }//evaluateProg()

        /**
         Handle a function definition. Notice that the return type
        is void since Fun isn't an expression.
        
        This method mutates the global environment object.
        The Value object put into the environment by this method
        has the tag "lambda" and its value field is a reference
        to the function's "lambda expression".
        */
        //this.handleFun = function (tree) {
        //    //throws EvalError
        //
        //    //get the function name
        //    var name = tree.getSubTree(0).element;
        //    //emit a "nodeTraversal" event
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': tree.getSubTree(0).numId,
        //                'color': traverseColor,
        //                'node': name,
        //            }
        //    });
        //
        //    // check if this function has already been defined
        //    if (this.env.definedLocal(name)) {
        //        //emit a "envLocalSearch" event
        //        throw new EvalError("function already exists: " + name);
        //    }
        //
        //    // get the "lambda expression" (the function value)
        //
        //    //var lambda := Tree
        //    var lambda = tree.getSubTree(1);
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': lambda.numId,
        //                'color': traverseColor,
        //                'node': lambda.element,
        //            }
        //    });
        //
        //    // check if the definition really is a function
        //    if (!(lambda.element === "lambda")) {
        //        throw new EvalError("bad function definition: " + tree);
        //    }
        //
        //    // create a function Value and
        //    // add a <name, lambda> pair to the environment
        //    this.env.add(name, new Value(lambda));
        //    //emit an "envAdd" event
        //    //note: handled in the environmentFactory.js file
        //
        //    if (this.DEBUG > 0) {
        //        // for debugging purposes
        //        document.body.innerHTML += "<pre>" + this.env + "</pre>";
        //    }
        //}//handleFun()

        //Evaluate an expression
        this.evaluateExp = function (tree) {
            //throws EvalError
            //console.log(tree + "evaluateExp param");


            var result = null;

            var node = tree.element;

            if (node === "list") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateList(tree);
            }

            else if (node === "sym") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateSymbol(tree);
            }

            else if (  (node === "car") 
                    || (node === "cdr")
                    || (node === "cons") 
                    || (node === "empty?") ) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateListOp(tree); 
            }
            
            else if (node === "fun") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateFun(tree);
            }
            else if (node === "lambda") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateLambda(tree);
            }
            else if (node === "apply") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateApply(tree);
            }
            else if (node === "if") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateIf(tree);
            }
            else if (node === "while") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateWhile(tree);
            }
            else if (node === "set") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateSet(tree);
            }
            else if (node === "begin") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBegin(tree);
            }
            else if (node === "var") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateVar(tree);
            }
            else if (node === "print") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluatePrint(tree);
            }
            else if ((node === "&&") || (node === "||") || (node === "!")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBexp(tree) //boolean expression
            }
            else if ((node === "<") || (node === ">")
                    || (node === "<=") || (node === ">=")
                    || (node === "==") || (node === "!=")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateRexp(tree); //relational operator
            }
            else if ((node === "+") || (node === "-")
                || (node === "*") || (node === "/")
                || (node === "%") || (node === "^")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateAexp(tree); //arithmetic expression
            }
            else if (tree.degree() === 0) {

                if ((node === "true") || (node === "false")) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(node === "true");
                }
                else if (node.match(/^[-]*[0-9][0-9]*/)) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(parseInt(node, 10));
                }
                else if (this.env.defined(node, false)) { // a variable
                    //since env.defined is basically a wrapper function
                    //for env.lookUp we will only emit one event
                    //I need to think about how this will work
                    
                    //emit "nodeTraversal" event
                    
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    //emit "envSearch" event
                    result = this.env.lookUp(node, true);
                }
                else {
                    //runtime check
                    throw new EvalError("undefined variable: " + node + "\n");
                }
            }
            else {

                throw new EvalError("invalid expression: " + tree + "\n");
            }

            return result;
        }//EvaluateExp()

        //Evaluate a list literal
        this.evaluateList = function(tree){
            var result = new Value(); //create an empty list

            // fill up the list (notice that we work from right to left in the list)
            for( var i = tree.degree() - 1; i >= 0; i--){
                var element = tree.getSubTree(i).element;

                if((tree.getSubTree(i).degree() !== 0) || (element === "list")){
                    result.valueCC = new ConsCell(this.evaluateExp(tree.getSubTree(i)), result.valueCC);
                }
                else {
                    var value;

                    if (element.match(/^[0-9][0-9]*/)) {
                        value = new Value(parseInt(element, 10));
                    }
                    else if ((element === "true") || (element === "false")) {
                        value = new Value(element === "true");
                    }
                    else if (this.env.defined(element)) {
                        value = this.env.lookUp(element);
                    }
                    else {
                        // unevaluated string (a "symbol")
                        value = new Value(element);
                    }

                    result.valueCC = new ConsCell(value, result.valueCC);
                }
            }
            console.log("Created a new list:");
            console.log(result.toString());
            return result;
        }

        // Evaluate a symbol literal
        this.evaluateSymbol = function(tree){
            //throws EvalError
            return new Value(tree.getSubTree(0).element);
        }

        /**
         * Apply a list operation to the actual parameters
         * contained in the child nodes of the tree.
         */
        this.evaluateListOp = function(tree){
            //throws EvalError

            var result = null;

            var op = tree.element;

            if (op === "car") {
                var list = this.evaluateExp(tree.getSubTree(0));
                if (!(list.tag === list.LIST_TAG)) {
                    throw new EvalError("car: argument is not a list: " + list);
                }
                if (list.valueCC === null) {
                    throw new EvalError("car: argument is an empty list: " + list);
                }
                else {
                    result = list.valueCC.car;
                }
            }
            else if (op === "cdr"){
                var list = this.evaluateExp(tree.getSubTree(0));
                if (!(list.tag === list.LIST_TAG)) {
                    throw new EvalError("cdr: argument is not a list: " + list);
                }
                if (list.valueCC === null) {
                    throw new EvalError("cdr: argument is an empty list: " + list);
                }
                else {
                    result = new Value(list.valueCC.cdr);
                }
            }
            else if (op === "cons") {
                var list = this.evaluateExp(tree.getSubTree(1));
                if (!(list.tag === list.LIST_TAG)) {
                    throw new EvalError("cons: 2nd argument is not a list: " + list);
                }
                else {
                    var car = this.evaluateExp(tree.getSubTree(0));

                    result = new Value(new ConsCell(car, list.valueCC));
                    console.log("Added a new element to the list. List contains:");
                    console.log(result.toString());
                }
            }
            else if (op === "empty?") {
                var list = this.evaluateExp(tree.getSubTree(0));
                if (!(list.tag === list.LIST_TAG)) {
                    throw new EvalError("empty?: argument is not a list: " + list);
                }
                else {
                    result = new Value(list.valueCC === null);
                }
            }
            else {
                // shouldn't get here
                throw new EvalError("illegal list function: " + op);
            }

            return result;
        }
        
        /**
            Evalute a function definition expression.
      
            This method mutates the current local environment object.
            The Value object put into the environment by this method
            has the tag "lambda" and its value field is a reference
            to an IPEP object.
      
            An IPEP object is usually called a "closure" and it contains
            two references. The first reference in a closure is an IP
            (an "Instruction Pointer") and the other a reference is an EP
            (an "Environment Pointer"). The IP reference refer's to the
            function's lambda expression (its "instructions"). The EP
            reference refer's to the function's outer scope, the scope
            that is needed for looking up the function's non-local references.
      
            Since functions in this language can be nested, the function's
            outer scope need no longer be the global environment (as it was
            in the previous languages). The function's outer scope is whatever
            local environment is being used at the time this evaluateFun()
            is called.
        */
        this.evaluateFun = function (tree){
            /**** Language_9 change (1) ***/
            //throws EvalError
    
            var result = null; /*** Language_9 change (2) ***/
    
            // get the function name
            var name = tree.getSubTree(0).element;
            
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': name,
                    }
            });
    
            // check if this function has already been defined
            if (this.env.definedLocal(name)) {
                throw new EvalError("function already exists: " + name);
            }
            // get the "lambda expression" (the function's IP)
            var lambda = tree.getSubTree(1);
            // check if the definition really is a function
            if (!(lambda.element === "lambda")) {
                throw new EvalError("bad function definition: " + tree);
            }
            
            result = this.evaluateLambda(lambda);
            // add the <name, value> pair to the environment
            this.env.add(name, result);              /*** Language_9 change (6) ***/
            
            //if (DEBUG > 0) {
            //    // for debugging purposes
            //    document.body.innerHTML += "<pre>" + env + "</pre>";
            //}
    
            return result;   /*** Language_9 change (7) ***/
        }//evaluateFun()

        this.evaluateLambda = function(tree){
            //throws EvalError

            var result = null;
            // get the "lambda expression" (the function's IP)
            var lambda = tree;
            // check if the definition really is a function
            if (!(lambda.element === "lambda")) {
                throw new EvalError("bad function definition: " + tree);
            }
            // get a reference to the current local Environment object (the function's EP)
            var ep = this.env; /*** Language_9 change (3) ***/
            // create an IPEP object (a closure)
            var ipep = new IPEP(lambda, ep); /*** Language_9 change (4) ***/
            // create the return value
            result = new Value(ipep);           /*** Language_9 change (5) ***/
            console.log("IPEP really is an IPEP?");
            console.log(ipep instanceof IPEP);
            return result;
        }
        

        /**
            This method "applies" a function value to actual parameters.
        This method evaluates the body of the function in an environment
        that binds the actual parameter values (from this function application)
        to the formal parameters (from the function's lambda expression).

            Since this language allows nested functions, the function's outer
        scope (where the function finds its non-local references) may no
        longer be the global Environment object. The function's closure
        (the IPEP object that is the functions "value") points us to the
        Environment object that the function should use for non-local
        references.
        */
        this.evaluateApply = function (tree) {
            //throw EvalError
            // Evaluate the apply's first parameter to a function value,
            /*1*/
            var funValue = this.evaluateExp(tree.getSubTree(0));

            // check that what we are applying really is a function,
            if (!(funValue.tag === funValue.LAMBDA_TAG)) {
                //runtime check
                throw new EvalError("bad function value: " + tree);
            }


            // get a reference to the function's  closure
            var ipep = funValue.valueL; /*** Language_8 change (1) ***/
            // and to the function's "lambda expression" and its "nesting link".
            var lambda = ipep.ip; /*** Language_8 change (2) ***/
            var ep = ipep.ep; /*** Language_8 change (3) ***/

            // Check that the number of actual parameters
            // is equal to the number of formal parameters.
            // (Actually, all we really need to know is that
            // the number of actual parameters is at least
            // the number of formal parameters.)

            if (tree.degree() !== lambda.degree()) {
                //runtime check

                throw new Evalerror("wrong number of parameters: " + tree);
            }

            // Create a new environment object that is "nested"
            // in this function's outer environment (lexical scope).
            // This environment is used to bind actual parameter
            // values to formal paramter names.
            /*2*/
            var localEnv = new Environment(scope, ep, "Function Activation");
            //emit "envStackPush" event
            //I might need to create a new event emitter named envStackPushFun
            //with a reference to the enclosing ep.id
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                        'epId': ep.id, //added a link to the environment pointer's id for drawing Bezier curves.
                    }
            });

            // Bind, in the new environment object, the actual parameter
            // values to the formal parameter names.
            /*3*/
            for (var zz = 1; zz < tree.degree() ; zz++) {
                // iterate through the actual parameters

                // Evaluate, using the current environment chain
                // (NOT the new local environment object)
                // an actual parameter expression's value.
                /*4*/
                var actualParamValue = this.evaluateExp(tree.getSubTree(zz));

                // Retrieve, from within the lambda expression,
                // a formal parameter name.
                /*5*/
                var formalParamName = lambda.getSubTree(zz - 1).element;
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': lambda.getSubTree(zz - 1).numId,
                            'color': traverseColor,
                            'node': formalParamName,
                        },
                });
                //console.log("Formal name : " + formalParamName);

                // Bind, in the new local environment object, the actual
                // paramter value to a formal parameter name.
                /*6*/
                localEnv.add(formalParamName, actualParamValue);
                //emit "envAdd" event; I don't believe we need an event emitter here

            }
            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + localEnv + "</pre>";// for debugging purposes
            }

            // Evaluate the body of the lambda expression using the
            // new environment (which contains the binding of the actual
            // parameter values to the function's formal parameter names).
            /*7*/
            var originalEnv = this.env;
            //ask Professor Kraft to draw a diagram of this code behavior on paper.
            /*8*/
            this.env = localEnv;

            /*9*/
            var result = this.evaluateExp(lambda.getSubTree(tree.degree() - 1));

            // Finally, restore the environment chain.
            /*10*/
            this.env = originalEnv;
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                        'closure': result.tag === 'lambda',
                        'epId': result.tag === 'lambda' ? ep.id : null,
                    }
            });
            // emit "envRemove" event?

            return result;
        



        }//evaluateApply()


        //Evaluate an if-expression
        this.evaluateIf = function (tree) {


            if (3 !== tree.degree()) {
                //runtime check
                throw new EvalError("incorrect conditional expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            if (conditionalExp.valueB) {

                result = this.evaluateExp(tree.getSubTree(1));
            }
            else {

                result = this.evaluateExp(tree.getSubTree(2));
            }

            return result;
        }//evaluateIf()

        //Evalaute a while-loop expression
        this.evaluateWhile = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                throw new EvalError("incorrect while expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //evaluate the boolean condition
            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime type check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            while (conditionalExp.valueB) {
                //evaluate the body of the loop (for its side effects)
                this.evaluateExp(tree.getSubTree(1));
                // re-evaluate the boolean condition
                conditionalExp = this.evaluateExp(tree.getSubTree(0));
                //do a runtime type check
                if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                    throw new EvalError("illegal boolean expression: " + tree);
                }
            }

            // always return false for a while-loop expression
            result = new Value(false);

            return result;
        }//evaluateWhile()

        // Evaluate a set expression
        this.evaluateSet = function (tree) {
            //throws EvalError

            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            //emit an "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.getSubTree(0).numId,
                            'color': traverseColor,
                            'node': variable,
                        },
            });
            // check if this variable has already been declared
            if (!this.env.defined(variable, true)) {
                //runtime check
                throw new EvalError("undefined variable: " + variable);
            }

            // get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);
            // update this variable in the environment
            this.env.update(variable, result);

            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + this.env + "</pre>"; // for debugging purposes
            }

            return result;
        }

        this.evaluateBegin = function (tree) {

            //var result := Value
            var result = null;

            // Create a new Environment object chained to (or "nested in")
            // the previous (:outer") environment object.
            var previousEnv = this.env;
            this.env = new Environment(scope, previousEnv, "Local (begin)");
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                        'epId': previousEnv.id,
                    }
            });

            // Evaluate each sub expression in the begin
            // expression (using the new environment chain).
            // The return value of each expression is
            // discarded, so any expression without a
            // side-effect is worthless.
            for (var i = 0; i < tree.degree() - 1; i++) {
                this.evaluateExp(tree.getSubTree(i));
            }

            // Evaluate the last expression and use its
            // value as the value of the begin expression.
            result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                        'closure': result.tag === 'lambda',
                        'epId': result.tag === 'lambda' ? previousEnv.id : null,
                    }
            });

            this.env = previousEnv;  // Just before this method returns, we remove from the
            // chain of Environment objects the local Environment
            // object we created at the beginning of this method.
            // The local Environment object becomes a garbage object,
            
            return result;

        }//evaluateBegin()

        //Evaluate a var expression
        this.evaluateVar = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                //runtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            // emit "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': variable,
                    },
            });

            //check if this variable has already been declared
            //in the local environment
            if (this.env.definedLocal(variable)) {
                //runtime check
                throw new EvalError("variable already declared: " + variable + "\n");
            }

            //get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);

            // declare the new, local, variable
            this.env.add(variable, result);

            if (this.DEBUG > 0) {
                //for debugging purposes
                document.body.innerHTML += "<pre>" + this.env + "</pre>";
            }

            return result;
        }//evaluateVar()

        //Evaluate a print expression
        this.evaluatePrint = function (tree) {
            //throws EvakError

            if (1 != tree.degree()) {
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = this.evaluateExp(tree.getSubTree(0));

            //print the expression on the console.
            console.log("The printed result is" + result);

            return result;
        }//evalautePrint()

        //Evaluate a boolean expression
        this.evaluateBexp = function (tree) {
            //throws EvalError



            var result = false;
            var node = tree.element;


            var value = this.evaluateExp(tree.getSubTree(0));

            if (!(value.tag === value.BOOL_TAG)) {
                //runtime check
                throw new EvalError("not a boolean expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            result = value.valueB;

            if (node === "&&") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var xyz = 1; xyz < tree.degree() ; xyz++) {
                    if (result) {
                        value = this.evaluateExp(tree.getSubTree(xyz));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                                + tree.getSubTree(xyz) + "\n");
                        }
                        result = result && value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "&&"
                        result = false;
                        break;
                    }
                }
            }
            else if (node === "||") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var x = 1; x < tree.degree() ; x++) {
                    if (!result) {
                        value = this.evaluateExp(tree.getSubTree(x));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                            + tree.getSubTree(i) + "\n");
                        }
                        result = result || value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "||"
                        result = true;
                        break;
                    }
                }
            }
            else if (node === "!") {
                if (1 != tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = !result;
            }

            return new Value(result);
        }//evaluateBexp()

        // Evaluate a relational expression (which is a kind of boolean expression)
        this.evaluateRexp = function (tree) {


            if (2 != tree.degree()) {
                //rumtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = false;

            var opStr = tree.element;
            //emit a "nodeTraversal" event
            //the event code is further down in the function definition

            var valueL = this.evaluateExp(tree.getSubTree(0));

            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }

            var valueR = this.evaluateExp(tree.getSubTree(1));
            if (!(valueR.tag === valueR.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
            }

            var resultL = valueL.valueI;
            var resultR = valueR.valueI;

            if (opStr === "<") {
                result = resultL < resultR;
            }
            else if (opStr === ">") {
                result = resultL > resultR;
            }
            else if (opStr === "<=") {
                result = resultL <= resultR;
            }
            else if (opStr === ">=") {
                result = resultL >= resultR;
            }
            else if (opStr === "==") {
                result = resultL == resultR;
            }
            else if (opStr === "!=") {
                result = resultL != resultR;
            }

            //emit a "nodeTraversal" event: tree.element == relational operator
            var colorCode = "#ff0000"; //red color; code from http://html-color-codes.info/
            if (result) {
                //Color code from http://color.adobe.com
                colorCode = "#87ff1d"; //green
            }
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': colorCode,
                        'node' : opStr,
                    },
            });
            
            //if var result == T => highlight tree.element green, else highlight it red.
            //see the code in Evaluate.js of Language_6 for more info.
            return new Value(result);
        }//evaluateRexp()

        // Evaluate an arithmetic expression
        this.evaluateAexp = function (tree) {
            //throws EvalError


            var result = 0;
            var node = tree.element;
            //do not emit a "nodeTraversal" event since we
            //already did so in the evaluateExp function
            

            var valueL = this.evaluateExp(tree.getSubTree(0));
            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            var resultL = valueL.valueI;
            var resultR = 0;

            var valueR = null;
            if (tree.degree() >= 2) {
                valueR = this.evaluateExp(tree.getSubTree(1));
                if (!(valueR.tag === valueR.INT_TAG)) {
                    //runtime check
                    throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
                }
                resultR = valueR.valueI;
            }

            if (node === "+") {
                if (tree.degree() === 1) {
                    result = resultL;
                }
                else {
                    result = resultL + resultR;

                    for (var z = 2; z < tree.degree() ; z++) {
                        //temp := Value
                        var temp = this.evaluateExp(tree.getSubTree(z));
                        if (!(temp.tag === temp.INT_TAG)) {
                            //runtime check
                            throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(z) + "\n");
                        }
                        result += temp.valueI;
                    }
                }
            }
            else if (node === "-") {
                if (2 < tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                if (tree.degree() === 1) {
                    result = -resultL;
                }
                else {
                    result = resultL - resultR;
                }
            }
            else if (node === "*") {
                if (1 === tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                result = resultL * resultR;

                for (var a = 2; a < tree.degree() ; a++) {
                    var temp = this.evaluateExp(tree.getSubTree(a));
                    if (!(temp.tag === temp.INT_TAG)) {
                        //runtime check
                        throw new EvalError("not a integer expression: "
                                            + tree.getSubTree(a) + "\n");
                    }
                    result *= temp.valueI;
                }
            }
            else if (node === "/") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL / resultR;
            }
            else if (node === "%") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL % resultR;
            }
            else if (node === "^") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = Math.floor(Math.pow(resultL, resultR));
            }

            return new Value(result);
        }//evaluateAexp()
    }

    return {
            "Evaluate": Evaluate
        };

    }]);
    

})();

(function(){
    'use strict';
    
    angular.module('astInterpreter')
        .factory('l10.IPEPFactory', function(){
            
            /*
                Construct a IPEP object
            */
            function IPEP(tree, env) {
                this.ip = tree; // the ip, the "instruction pointer"
                this.ep = env;  // the ep, the "environment pointer"
            }
            
            return{
                'IPEP': IPEP,
            }
            
        });
})();

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

(function(){
//this factory needs a strong unit test!!
'use strict';
angular
        .module('astInterpreter')
        .factory('l10.prettyPrinterFactory', function () {
            
            var counter = 0;

            function prettyPrint2(formatting, tree) {
                var result = "";

                if (tree.depth() === 0) {
                    return formatting + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                }
                else if (tree.depth() === 1) {
                    result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                    for (var i = 0; i < tree.degree() - 1; i++) {
                        result += prettyPrint2(" ", tree.getSubTree(i));
                    }
                    result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                    return result;
                }
                else if (tree.depth() > 1) {
                    if(tree.element === "prog" ||
                        tree.element === "begin") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var x = 0; x < tree.degree() ; x++) {
                            result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(x));
                        }
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "print") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var y = 0; y < tree.degree() - 1; y++) {
                            result += prettyPrint2(" ", tree.getSubTree(y));
                        }
                        result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                        return result;
                    }
                    else if (tree.element === "if") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(1));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(2));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "while") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "        ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "fun") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "lambda") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var t = 0; t < tree.degree() - 1; t++) {
                            result += prettyPrint2(" ", tree.getSubTree(t));
                        }
                        result += "\n" + prettyPrint2(formatting + "    ", tree.getSubTree(tree.degree() - 1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element == "apply") {
                        if(tree.depth() <= 2) // changed from == 2 to <= 2 19/22/16
                        {
                            result +=  formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var c = 0; c < tree.degree() ; c++) {
                                result += prettyPrint2(" ", tree.getSubTree(c));
                            }
                            return result + " )";
                        }
                        else //tree.depth > 2
                        {
                            //TODO: Implement this feature
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var app = 0; app < tree.degree() ; app++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(app));
                            }

                            return result + "\n" + formatting + ")";
                        }
                    }
                    else if(tree.element === "var" ||
                            tree.element === "set") {
                        if (tree.depth() === 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += prettyPrint2(" ", tree.getSubTree(1)) + " )";
                            return result;
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                            return result + "\n" + formatting + ")";

                        }
                    }
                    else if(tree.element === "+"  ||
                            tree.element === "-"  ||
                            tree.element === "*"  ||
                            tree.element === "/"  ||
                            tree.element === "^"  ||
                            tree.element === "%"  ||
                            tree.element === "--" ||
                            tree.element === "++" ||
                            tree.element === "||" ||
                            tree.element === "!=" ||
                            tree.element === "&&" ||
                            tree.element === "==" ||
                            tree.element === "<"  ||
                            tree.element === "<=" ||
                            tree.element === ">"  ||
                            tree.element === "empty?"  ||
                            tree.element === ">=" ){
                        if (tree.depth() > 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var z = 0; z < tree.degree() ; z++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(z));
                            }
                            return result + "\n" + formatting + ")";
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var q = 0; q < tree.degree() - 1; q++) {
                                result += prettyPrint2(" ", tree.getSubTree(q));
                            }
                            result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                            return result;
                        }
                    }
                }

                // Make sure this is never reached!
                //If this section of code is reached
                //there is a keyword in the program not accounted for
                //in this prettyprinter
                return "Needs to be Implemented 2";

            }

            function prettyPrint(tree) {
                var result = prettyPrint2("", tree);
                //console.log("Printing from prettyPrintFactory");
                //console.log(result);
                counter = 0; //reset the counter for proper highlighting of nodes
                return result;
            }

            return {
                'prettyPrint': prettyPrint
            }
        });
        
})();

(function () {
   "use strict"; 
   angular.module('astInterpreter')
        .factory('l10.tokenizerFactory', function () {
           

            function Tokenizer(str) {

            //Code is based off C code snippets from the following book:
            //Sebesta, Robert W. Concepts of programming languages. Boston: Pearson, 2016. Print.
            //See pages 163-171

            this._DIGIT = 1;//make const in ES6
            this._LETTER = 0;
            this._UNKNOWN = 99;
            this._WHITESPACE = 101;
            this._EQOP = 102; //since equality is a double-character operand it needs to be handled seperately
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

                    // nice cheat sheet for RegEx: http://www.rexegg.com/regex-quickstart.html
                    // for Lang 10 we need to catch the "empty?" token. 
                    if(this._currentChar.match(/[A-Za-z]|\?/)){
                        this._charClass = this._LETTER;
                    }
                    else if(this._currentChar.match(/\d/)){
                        this._charClass = this._DIGIT;
                    }
                    else if(this._currentChar.match(/\s/)){
                        this._charClass = this._WHITESPACE;
                    }
                     else if(this._currentChar.match(/=/)){
                        this._charClass = this._EQOP;
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

                        case this._EQOP:
                            this._addChar();
                            this._getChar();
                            while(this._charClass == this._EQOP){
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

                        //Parentheses and single-character operands
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
			
			/*
            * Returns false if all, or all but one, of the tokens have been "consumed".
            */  
            this.has2Token = function () {
               return (this._currentToken < this._tokens.length - 1);
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

(function () {
   "use strict"; 

   angular.module('astInterpreter')
   .factory('l9.treeFactory', function(){
       
       function Tree(element) {
            this.element = element;
            this.subTrees = [];

            for(var x = 1; x < arguments.length; x++) {
                if (arguments[x] !== null) {
                    this.subTrees.push(arguments[x]);
                }

            }
            this.addSubTree = function(tree) {
                this.subTrees.push(tree);
            }
            this.getSubTree = function(index) {
                return this.subTrees[index];
            }

            this.degree = function() {
                return this.subTrees.length;
            }
            this.depth = function() {
                var result = 0;
                if (this.degree() > 0) {
                    var max = 0;
                    for(var y = 0; y < this.degree(); y++) {

                        var temp = this.getSubTree(y).depth();
                        if (temp > max) {
                            max = temp;
                        }
                    }
                    result = 1 + max;
                }
                return result;
            }

            this.toString = function() {
                var result = "";
                if (this.subTrees == []) {
                    result += element;
                }
                else {
                    result += "(" + this.element;
                    for(var z = 0; z < this.subTrees.length; z++) {
                        result += " " + this.subTrees[z];
                    }
                    result += ")";
                }
                return result;
            }

        }

        return {
            "Tree": Tree
        };

    });

})();


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

(function () {
    "use strict";

    angular
    .module('astInterpreter')
    .factory('l6.evaluateFactory', 
    [ 'environmentFactory',
         'l6.valueFactory', 
        function(environmentFactory, valueFactory) {
        
        
        
        var Environment = environmentFactory.Environment;
        var Value = valueFactory.Value;
        //var EvalError = evalErrorFactory.EvaluationError;

    function Evaluate(scope) {
        //don't set this variable to 1 when running large programs
        //can cuase stack overflows due to large environments!!
        this.DEBUG = 0; //always keep this set to zero when running on Angularjs!
        var self = this;
        this.globalEnv = null;
        this.env = null;
        var traverseColor = "#14A84A"; // defualt color to use when highlighting the current node or: "#14A84A" "#3885A8"
        var id = 0; //used for the animation of nodes      //color codes from http://color.adobe.com  //^green   ^light-blue
        this.evaluate = function (tree) {
            //throws EvalError
            
            return this.evaluateProg(tree);
        }//evaluate()

        this.evaluateProg = function (tree) {


            //var result := Value
            var result = null;

            // Instantiate the global environment
            // (it will always be at the end of the
            // environment chain).
            this.globalEnv = new Environment(scope, null, "Global Env");
            this.env = this.globalEnv;
            
            //emit a "envStackPush" event
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.globalEnv.id,
                        'label': self.globalEnv.label,
                    }
            });

            // Check whick kind of Prog we have.
            if (!(tree.element === "prog")) {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate the single expression.
                //console.log("calling evaluateExp");
                result = this.evaluateExp(tree);
            }
            else {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate each Fun or Exp in the Prog.
                // Any Fun will have the side effect of putting
                // a function name in the global environment.
                // Any Var expressions will have the side effect
                // of putting a variable in the environment chain.
                // Any Set expressions will have the side effect
                // of changing a value in the environment chain.
                // Any Print expressions will have the side effect
                // of printing an output.
                // Any other expressions would be pointless!
                for (var i = 0; i < tree.degree() - 1 ; i++) {

                    if (tree.getSubTree(i).element === "fun") {
                          scope.main.addAnimationData({'name': "nodeTraversal",
                                data: {
                                    'id': tree.getSubTree(i).numId,
                                    'color': traverseColor,
                                    'node': tree.getSubTree(i).element,
                                }
                          });                      
                        this.handleFun(tree.getSubTree(i));
                    }
                    else {
                        this.evaluateExp(tree.getSubTree(i));
                    }
                }

                // Evaluate the last expression and use its
                // value as the value of the prog expression.

                result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            }

            return result;

        }//evaluateProg()

        /**
         Handle a function definition. Notice that the return type
        is void since Fun isn't an expression.
        
        This method mutates the global environment object.
        The Value object put into the environment by this method
        has the tag "lambda" and its value field is a reference
        to the function's "lambda expression".
        */
        //this.handleFun = function (tree) {
        //    //throws EvalError
        //
        //    //get the function name
        //    var name = tree.getSubTree(0).element;
        //    //emit a "nodeTraversal" event
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': tree.getSubTree(0).numId,
        //                'color': traverseColor,
        //                'node': name,
        //            }
        //    });
        //
        //    // check if this function has already been defined
        //    if (this.env.definedLocal(name)) {
        //        //emit a "envLocalSearch" event
        //        throw new EvalError("function already exists: " + name);
        //    }
        //
        //    // get the "lambda expression" (the function value)
        //
        //    //var lambda := Tree
        //    var lambda = tree.getSubTree(1);
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': lambda.numId,
        //                'color': traverseColor,
        //                'node': lambda.element,
        //            }
        //    });
        //
        //    // check if the definition really is a function
        //    if (!(lambda.element === "lambda")) {
        //        throw new EvalError("bad function definition: " + tree);
        //    }
        //
        //    // create a function Value and
        //    // add a <name, lambda> pair to the environment
        //    this.env.add(name, new Value(lambda));
        //    //emit an "envAdd" event
        //    //note: handled in the environmentFactory.js file
        //
        //    if (this.DEBUG > 0) {
        //        // for debugging purposes
        //        document.body.innerHTML += "<pre>" + this.env + "</pre>";
        //    }
        //}//handleFun()

        //Evaluate an expression
        this.evaluateExp = function (tree) {
            //throws EvalError
            //console.log(tree + "evaluateExp param");


            var result = null;

            var node = tree.element;

            if (node === "apply") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateApply(tree);
            }
            else if (node === "if") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateIf(tree);
            }
            else if (node === "while") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateWhile(tree);
            }
            else if (node === "set") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateSet(tree);
            }
            else if (node === "begin") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBegin(tree);
            }
            else if (node === "var") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateVar(tree);
            }
            else if (node === "print") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluatePrint(tree);
            }
            else if ((node === "&&") || (node === "||") || (node === "!")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBexp(tree) //boolean expression
            }
            else if ((node === "<") || (node === ">")
                    || (node === "<=") || (node === ">=")
                    || (node === "==") || (node === "!=")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateRexp(tree); //relational operator
            }
            else if ((node === "+") || (node === "-")
                || (node === "*") || (node === "/")
                || (node === "%") || (node === "^")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateAexp(tree); //arithmetic expression
            }
            else if (tree.degree() === 0) {

                if ((node === "true") || (node === "false")) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(node === "true");
                }
                else if (node.match(/^[-]*[0-9][0-9]*/)) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(parseInt(node, 10));
                }
                else if (this.env.defined(node, false)) { // a variable
                    //since env.defined is basically a wrapper function
                    //for env.lookUp we will only emit one event
                    //I need to think about how this will work
                    
                    //emit "nodeTraversal" event
                    
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    //emit "envSearch" event
                    result = this.env.lookUp(node, true);
                }
                else {
                    //runtime check
                    throw new EvalError("undefined variable: " + node + "\n");
                }
            }
            else {

                throw new EvalError("invalid expression: " + tree + "\n");
            }

            return result;
        }//EvaluateExp()

        /**
         This method "applies" a function value to actual parameters.
        This method evaluates the body of the function in an environment
        that binds the actual parameter values (from this function application)
        to the formal parameters (from the function's lambda expression).
        */
        this.evaluateApply = function (tree) {
            //throw EvalError
            // Evaluate the apply's first parameter to a function value,
            /*1*/
            var funValue = this.evaluateExp(tree.getSubTree(0));

            // check that what we are applying really is a function,
            if (!(funValue.tag === funValue.LAMBDA_TAG)) {
                //runtime check
                throw new EvalError("bad function value: " + tree);
            }


            // and get a reference to the function's "lambda expression".
            //var lambda := Tree
            var lambda = funValue.valueL;

            // Check that the number of actual parameters
            // is equal to the number of formal parameters.
            // (Actually, all we really need to know is that
            // the number of actual parameters is at least
            // the number of formal parameters.)

            if (tree.degree() !== lambda.degree()) {
                //runtime check

                throw new evalerror("wrong number of parameters: " + tree);
            }

            // Create a new environment object that is "nested"
            // in the global environment (lexical scope).
            // This environment is used to bind actual parameter
            // values to formal paramter names.
            /*2*/
            var localEnv = new Environment(scope, this.globalEnv, "Function Activation");
            //emit "envStackPush" event
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                    }
            });

            // Bind, in the new environment object, the actual parameter
            // values to the formal parameter names.
            /*3*/
            for (var zz = 1; zz < tree.degree() ; zz++) {
                // iterate through the actual parameters

                // Evaluate, using the current environment chain
                // (NOT the new local environment object)
                // an actual parameter expression's value.
                /*4*/
                var actualParamValue = this.evaluateExp(tree.getSubTree(zz));

                // Retrieve, from within the lambda expression,
                // a formal parameter name.
                /*5*/
                var formalParamName = lambda.getSubTree(zz - 1).element;
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': lambda.getSubTree(zz - 1).numId,
                            'color': traverseColor,
                            'node': formalParamName,
                        },
                });
                //console.log("Formal name : " + formalParamName);

                // Bind, in the new local environment object, the actual
                // paramter value to a formal parameter name.
                /*6*/
                localEnv.add(formalParamName, actualParamValue);
                //emit "envAdd" event

            }
            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + localEnv + "</pre>";// for debugging purposes
            }

            // Evaluate the body of the lambda expression using the
            // new environment (which contains the binding of the actual
            // parameter values to the function's formal parameter names).
            /*7*/
            var originalEnv = this.env;
            //ask Professor Kraft to draw a diagram of this code behavior on paper.
            /*8*/
            this.env = localEnv;

            /*9*/
            var result = this.evaluateExp(lambda.getSubTree(tree.degree() - 1));

            // Finally, restore the environment chain.
            /*10*/
            this.env = originalEnv;
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                    }
            });
            // emit "envRemove" event?

            return result;
        



        }//evaluateApply()


        //Evaluate an if-expression
        this.evaluateIf = function (tree) {


            if (3 !== tree.degree()) {
                //runtime check
                throw new EvalError("incorrect conditional expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            if (conditionalExp.valueB) {

                result = this.evaluateExp(tree.getSubTree(1));
            }
            else {

                result = this.evaluateExp(tree.getSubTree(2));
            }

            return result;
        }//evaluateIf()

        //Evalaute a while-loop expression
        this.evaluateWhile = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                throw new EvalError("incorrect while expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //evaluate the boolean condition
            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime type check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            while (conditionalExp.valueB) {
                //evaluate the body of the loop (for its side effects)
                this.evaluateExp(tree.getSubTree(1));
                // re-evaluate the boolean condition
                conditionalExp = this.evaluateExp(tree.getSubTree(0));
                //do a runtime type check
                if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                    throw new EvalError("illegal boolean expression: " + tree);
                }
            }

            // always return false for a while-loop expression
            result = new Value(false);

            return result;
        }//evaluateWhile()

        // Evaluate a set expression
        this.evaluateSet = function (tree) {
            //throws EvalError

            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            //emit an "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.getSubTree(0).numId,
                            'color': traverseColor,
                            'node': variable,
                        },
            });
            // check if this variable has already been declared
            if (!this.env.defined(variable, true)) {
                //runtime check
                throw new EvalError("undefined variable: " + variable);
            }

            // get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);
            // update this variable in the environment
            this.env.update(variable, result);

            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + this.env + "</pre>"; // for debugging purposes
            }

            return result;
        }

        this.evaluateBegin = function (tree) {

            //var result := Value
            var result = null;

            // Create a new Environment object chained to (or "nested in")
            // the previous (:outer") environment object.
            var previousEnv = this.env;
            this.env = new Environment(scope, previousEnv, "Local (begin)");
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                    }
            });

            // Evaluate each sub expression in the begin
            // expression (using the new environment chain).
            // The return value of each expression is
            // discarded, so any expression without a
            // side-effect is worthless.
            for (var i = 0; i < tree.degree() - 1; i++) {
                this.evaluateExp(tree.getSubTree(i));
            }

            // Evaluate the last expression and use its
            // value as the value of the begin expression.
            result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));

            this.env = previousEnv;  // Just before this method returns, we remove from the
            // chain of Environment objects the local Environment
            // object we created at the beginning of this method.
            // The local Environment object becomes a garbage object,
            return result;

        }//evaluateBegin()

        //Evaluate a var expression
        this.evaluateVar = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                //runtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            // emit "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': variable,
                    },
            });

            //check if this variable has already been declared
            //in the local environment
            if (this.env.definedLocal(variable)) {
                //runtime check
                throw new EvalError("variable already declared: " + variable + "\n");
            }

            //get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);

            // declare the new, local, variable
            this.env.add(variable, result);

            if (this.DEBUG > 0) {
                //for debugging purposes
                document.body.innerHTML += "<pre>" + this.env + "</pre>";
            }

            return result;
        }//evaluateVar()

        //Evaluate a print expression
        this.evaluatePrint = function (tree) {
            //throws EvakError

            if (1 != tree.degree()) {
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = this.evaluateExp(tree.getSubTree(0));

            //print the expression on the console.
            console.log("The printed result is" + result);

            return result;
        }//evalautePrint()

        //Evaluate a boolean expression
        this.evaluateBexp = function (tree) {
            //throws EvalError



            var result = false;
            var node = tree.element;


            var value = this.evaluateExp(tree.getSubTree(0));

            if (!(value.tag === value.BOOL_TAG)) {
                //runtime check
                throw new EvalError("not a boolean expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            result = value.valueB;

            if (node === "&&") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var xyz = 1; xyz < tree.degree() ; xyz++) {
                    if (result) {
                        value = this.evaluateExp(tree.getSubTree(xyz));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                                + tree.getSubTree(xyz) + "\n");
                        }
                        result = result && value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "&&"
                        result = false;
                        break;
                    }
                }
            }
            else if (node === "||") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var x = 1; x < tree.degree() ; x++) {
                    if (!result) {
                        value = this.evaluateExp(tree.getSubTree(x));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                            + tree.getSubTree(i) + "\n");
                        }
                        result = result || value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "||"
                        result = true;
                        break;
                    }
                }
            }
            else if (node === "!") {
                if (1 != tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = !result;
            }

            return new Value(result);
        }//evaluateBexp()

        // Evaluate a relational expression (which is a kind of boolean expression)
        this.evaluateRexp = function (tree) {


            if (2 != tree.degree()) {
                //rumtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = false;

            var opStr = tree.element;
            //emit a "nodeTraversal" event
            //the event code is further down in the function definition

            var valueL = this.evaluateExp(tree.getSubTree(0));

            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }

            var valueR = this.evaluateExp(tree.getSubTree(1));
            if (!(valueR.tag === valueR.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
            }

            var resultL = valueL.valueI;
            var resultR = valueR.valueI;

            if (opStr === "<") {
                result = resultL < resultR;
            }
            else if (opStr === ">") {
                result = resultL > resultR;
            }
            else if (opStr === "<=") {
                result = resultL <= resultR;
            }
            else if (opStr === ">=") {
                result = resultL >= resultR;
            }
            else if (opStr === "==") {
                result = resultL == resultR;
            }
            else if (opStr === "!=") {
                result = resultL != resultR;
            }

            //emit a "nodeTraversal" event: tree.element == relational operator
            var colorCode = "#ff0000"; //red color; code from http://html-color-codes.info/
            if (result) {
                //Color code from http://color.adobe.com
                colorCode = "#87ff1d"; //green
            }
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': colorCode,
                        'node' : opStr,
                    },
            });
            
            //if var result == T => highlight tree.element green, else highlight it red.
            //see the code in Evaluate.js of Language_6 for more info.
            return new Value(result);
        }//evaluateRexp()

        // Evaluate an arithmetic expression
        this.evaluateAexp = function (tree) {
            //throws EvalError


            var result = 0;
            var node = tree.element;
            //do not emit a "nodeTraversal" event since we
            //already did so in the evaluateExp function
            

            var valueL = this.evaluateExp(tree.getSubTree(0));
            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            var resultL = valueL.valueI;
            var resultR = 0;

            var valueR = null;
            if (tree.degree() >= 2) {
                valueR = this.evaluateExp(tree.getSubTree(1));
                if (!(valueR.tag === valueR.INT_TAG)) {
                    //runtime check
                    throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
                }
                resultR = valueR.valueI;
            }

            if (node === "+") {
                if (tree.degree() === 1) {
                    result = resultL;
                }
                else {
                    result = resultL + resultR;

                    for (var z = 2; z < tree.degree() ; z++) {
                        //temp := Value
                        var temp = this.evaluateExp(tree.getSubTree(z));
                        if (!(temp.tag === temp.INT_TAG)) {
                            //runtime check
                            throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(z) + "\n");
                        }
                        result += temp.valueI;
                    }
                }
            }
            else if (node === "-") {
                if (2 < tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                if (tree.degree() === 1) {
                    result = -resultL;
                }
                else {
                    result = resultL - resultR;
                }
            }
            else if (node === "*") {
                if (1 === tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                result = resultL * resultR;

                for (var a = 2; a < tree.degree() ; a++) {
                    var temp = this.evaluateExp(tree.getSubTree(a));
                    if (!(temp.tag === temp.INT_TAG)) {
                        //runtime check
                        throw new EvalError("not a integer expression: "
                                            + tree.getSubTree(a) + "\n");
                    }
                    result *= temp.valueI;
                }
            }
            else if (node === "/") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL / resultR;
            }
            else if (node === "%") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL % resultR;
            }
            else if (node === "^") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = Math.floor(Math.pow(resultL, resultR));
            }

            return new Value(result);
        }//evaluateAexp()
    }

    return {
            "Evaluate": Evaluate
        };

    }]);
    

})();

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

(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('buildTreeFactory', [ 'treeFactory',
          function ( treeFactory) {
            
            var Tree = treeFactory.Tree;
            //var ParseError = parseErrorFactory.ParseError;

            function BuildTree(tokenizer) { 
                this.counter = 0;//numId should be zero-indexed not one-indexed. 8/21/16
                this.tokens = tokenizer;
                

                this.getTree = function() {
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

                        result.addSubTree(this.getTree(this.tokens));    // consume first sub tree

                        if (!this.tokens.hasToken()) { // there should be another token
                            
                            throw new ParseError("unexpected end of input: " + "\n" + this.tokens + "\n");
                        }

                        token = this.tokens.peekToken(); //one character look ahead

                        while (!(token === ")")) {

                            result.addSubTree(this.getTree(this.tokens)); // consume the sub tree

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
                }; //getTree()
        }

        return {
            "BuildTree": BuildTree
        };
    }]);
})();

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

            this.defined = function (variable, emitEvents) {
                return (null !== this.lookUp(variable, emitEvents));
            };
            
            
            //I need to set a parameter to tell the lookUp function if it should emit events or not
            this.lookUp = function (variable, emitEvents) {
                //when emitting events an id to the current env ( represented as a div) will need to be passed along
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        //if emitEvents is undefined assume the user wants events emitted
                        if (emitEvents) {
                            // set the color to be green i.e found the variable we are looking for
                            //emit an "envSearch" event
                            scope.main.addAnimationData({'name': "envSearch",
                                data: {
                                    'id': self.id,
                                    'label': self.label, 
                                    'childRank': i + 1,
                                    'color': "#5FAD00", //green; color code from color.adobe.com
                                }
                            });
                        }
                        
                        break;
                    }
                    //if emitEvents is undefined assume the user wants events emitted
                    if (emitEvents) {
                       //set the color to be red (i.e the variable currently looked up is not the one we want)
                       //emit an "envSearch" event
                       scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#FF0302", //red; color code from color.adobe.com
                            }
                        });
                    }
                    
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
                        return this.nonLocalLink.lookUp(variable, emitEvents);
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
                        scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#5FAD00", //green; color code from color.adobe.com
                            }
                        });
                        break;
                    }
                    //set the color to be red (i.e the variable currently looked up is not the one we want)
                    //emit an "envSearch" event
                    scope.main.addAnimationData({'name': "envSearch",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'color': "#FF0302", //red; color code from color.adobe.com
                        }
                    });
                }

                if (i < this.variables.length) {
                    this.values[i] = value;
                    scope.main.addAnimationData({'name': "envUpdate",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'value': variable + " = " + value,
                            'color': "#FF4", //yellow; I want the user to note the change made
                        }
                    });
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

(function () {
    "use strict";

    angular
        .module('astInterpreter')
        .factory('evalErrorFactory', function(){
            

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

(function () {
    "use strict";

    angular
    .module('astInterpreter')
    .factory('evaluateFactory', 
    [ 'environmentFactory',
         'valueFactory', 
        function(environmentFactory, valueFactory) {
        
        
        
        var Environment = environmentFactory.Environment;
        var Value = valueFactory.Value;
        //var EvalError = evalErrorFactory.EvaluationError;

    function Evaluate(scope) {
        //don't set this variable to 1 when running large programs
        //can cuase stack overflows due to large environments!!
        this.DEBUG = 0; //always keep this set to zero when running on Angularjs!
        var self = this;
        this.globalEnv = null;
        this.env = null;
        var traverseColor = "#14A84A"; // default color to use when highlighting the current node or: "#14A84A" "#3885A8"
        var id = 0; //used for the animation of nodes      //color codes from http://color.adobe.com  //^green   ^light-blue
        this.evaluate = function (tree) {
            //throws EvalError
            
            return this.evaluateProg(tree);
        }//evaluate()

        this.evaluateProg = function (tree) {


            //var result := Value
            var result = null;

            // Instantiate the global environment
            // (it will always be at the end of the
            // environment chain).
            this.globalEnv = new Environment(scope, null, "Global Env");
            this.env = this.globalEnv;
            
            //emit a "envStackPush" event
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.globalEnv.id,
                        'label': self.globalEnv.label,
                    }
            });

            // Check whick kind of Prog we have.
            if (!(tree.element === "prog")) {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate the single expression.
                //console.log("calling evaluateExp");
                result = this.evaluateExp(tree);
            }
            else {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate each Fun or Exp in the Prog.
                // Any Fun will have the side effect of putting
                // a function name in the global environment.
                // Any Var expressions will have the side effect
                // of putting a variable in the environment chain.
                // Any Set expressions will have the side effect
                // of changing a value in the environment chain.
                // Any Print expressions will have the side effect
                // of printing an output.
                // Any other expressions would be pointless!
                for (var i = 0; i < tree.degree() - 1 ; i++) {

                    if (tree.getSubTree(i).element === "fun") {
                          scope.main.addAnimationData({'name': "nodeTraversal",
                                data: {
                                    'id': tree.getSubTree(i).numId,
                                    'color': traverseColor,
                                    'node': tree.getSubTree(i).element,
                                }
                          });                      
                        this.handleFun(tree.getSubTree(i));
                    }
                    else {
                        this.evaluateExp(tree.getSubTree(i));
                    }
                }

                // Evaluate the last expression and use its
                // value as the value of the prog expression.

                result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            }

            return result;

        }//evaluateProg()

        /**
         Handle a function definition. Notice that the return type
        is void since Fun isn't an expression.
        
        This method mutates the global environment object.
        The Value object put into the environment by this method
        has the tag "lambda" and its value field is a reference
        to the function's "lambda expression".
        */
        this.handleFun = function (tree) {
            //throws EvalError

            //get the function name
            var name = tree.getSubTree(0).element;
            //emit a "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': name,
                    }
            });

            // check if this function has already been defined
            if (this.env.definedLocal(name)) {
                //emit a "envLocalSearch" event
                throw new EvalError("function already exists: " + name);
            }

            // get the "lambda expression" (the function value)

            //var lambda := Tree
            var lambda = tree.getSubTree(1);
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': lambda.numId,
                        'color': traverseColor,
                        'node': lambda.element,
                    }
            });

            // check if the definition really is a function
            if (!(lambda.element === "lambda")) {
                throw new EvalError("bad function definition: " + tree);
            }

            // create a function Value and
            // add a <name, lambda> pair to the environment
            this.env.add(name, new Value(lambda));
            //emit an "envAdd" event
            //note: handled in the environmentFactory.js file

            if (this.DEBUG > 0) {
                // for debugging purposes
                document.body.innerHTML += "<pre>" + this.env + "</pre>";
            }
        }//handleFun()

        //Evaluate an expression
        this.evaluateExp = function (tree) {
            //throws EvalError
            //console.log(tree + "evaluateExp param");


            var result = null;

            var node = tree.element;

            if (node === "apply") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateApply(tree);
            }
            else if (node === "if") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateIf(tree);
            }
            else if (node === "while") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateWhile(tree);
            }
            else if (node === "set") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateSet(tree);
            }
            else if (node === "begin") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBegin(tree);
            }
            else if (node === "var") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateVar(tree);
            }
            else if (node === "print") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluatePrint(tree);
            }
            else if ((node === "&&") || (node === "||") || (node === "!")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBexp(tree) //boolean expression
            }
            else if ((node === "<") || (node === ">")
                    || (node === "<=") || (node === ">=")
                    || (node === "==") || (node === "!=")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateRexp(tree); //relational operator
            }
            else if ((node === "+") || (node === "-")
                || (node === "*") || (node === "/")
                || (node === "%") || (node === "^")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateAexp(tree); //arithmetic expression
            }
            else if (tree.degree() === 0) {

                if ((node === "true") || (node === "false")) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(node === "true");
                }
                else if (node.match(/^[-]*[0-9][0-9]*/)) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(parseInt(node, 10));
                }
                else if (this.env.defined(node, false)) { // a variable
                    //since env.defined is basically a wrapper function
                    //for env.lookUp we will only emit one event
                    //I need to think about how this will work
                    
                    //emit "nodeTraversal" event
                    
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    //emit "envSearch" event
                    result = this.env.lookUp(node, true);
                }
                else {
                    //runtime check
                    throw new EvalError("undefined variable: " + node + "\n");
                }
            }
            else {

                throw new EvalError("invalid expression: " + tree + "\n");
            }

            return result;
        }//EvaluateExp()

        /**
         This method "applies" a function value to actual parameters.
        This method evaluates the body of the function in an environment
        that binds the actual parameter values (from this function application)
        to the formal parameters (from the function's lambda expression).
        */
        this.evaluateApply = function (tree) {
            //throw EvalError
            // Evaluate the apply's first parameter to a function value,
            /*1*/
            var funValue = this.evaluateExp(tree.getSubTree(0));

            // check that what we are applying really is a function,
            if (!(funValue.tag === funValue.LAMBDA_TAG)) {
                //runtime check
                throw new EvalError("bad function value: " + tree);
            }


            // and get a reference to the function's "lambda expression".
            //var lambda := Tree
            var lambda = funValue.valueL;

            // Check that the number of actual parameters
            // is equal to the number of formal parameters.
            // (Actually, all we really need to know is that
            // the number of actual parameters is at least
            // the number of formal parameters.)

            if (tree.degree() !== lambda.degree()) {
                //runtime check

                throw new evalerror("wrong number of parameters: " + tree);
            }

            // Create a new environment object that is "nested"
            // in the global environment (lexical scope).
            // This environment is used to bind actual parameter
            // values to formal paramter names.
            /*2*/
            var localEnv = new Environment(scope, this.globalEnv, "Function Activation");
            //emit "envStackPush" event
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                    }
            });

            // Bind, in the new environment object, the actual parameter
            // values to the formal parameter names.
            /*3*/
            for (var zz = 1; zz < tree.degree() ; zz++) {
                // iterate through the actual parameters

                // Evaluate, using the current environment chain
                // (NOT the new local environment object)
                // an actual parameter expression's value.
                /*4*/
                var actualParamValue = this.evaluateExp(tree.getSubTree(zz));

                // Retrieve, from within the lambda expression,
                // a formal parameter name.
                /*5*/
                var formalParamName = lambda.getSubTree(zz - 1).element;
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': lambda.getSubTree(zz - 1).numId,
                            'color': traverseColor,
                            'node': formalParamName,
                        },
                });
                //console.log("Formal name : " + formalParamName);

                // Bind, in the new local environment object, the actual
                // paramter value to a formal parameter name.
                /*6*/
                localEnv.add(formalParamName, actualParamValue);
                //emit "envAdd" event

            }
            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + localEnv + "</pre>";// for debugging purposes
            }

            // Evaluate the body of the lambda expression using the
            // new environment (which contains the binding of the actual
            // parameter values to the function's formal parameter names).
            /*7*/
            var originalEnv = this.env;
            //ask Professor Kraft to draw a diagram of this code behavior on paper.
            /*8*/
            this.env = localEnv;

            /*9*/
            var result = this.evaluateExp(lambda.getSubTree(tree.degree() - 1));

            // Finally, restore the environment chain.
            /*10*/
            this.env = originalEnv;
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                    }
            });
            // emit "envRemove" event?

            return result;
        



        }//evaluateApply()


        //Evaluate an if-expression
        this.evaluateIf = function (tree) {


            if (3 !== tree.degree()) {
                //runtime check
                throw new EvalError("incorrect conditional expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            if (conditionalExp.valueB) {

                result = this.evaluateExp(tree.getSubTree(1));
            }
            else {

                result = this.evaluateExp(tree.getSubTree(2));
            }

            return result;
        }//evaluateIf()

        //Evalaute a while-loop expression
        this.evaluateWhile = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                throw new EvalError("incorrect while expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //evaluate the boolean condition
            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime type check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            while (conditionalExp.valueB) {
                //evaluate the body of the loop (for its side effects)
                this.evaluateExp(tree.getSubTree(1));
                // re-evaluate the boolean condition
                conditionalExp = this.evaluateExp(tree.getSubTree(0));
                //do a runtime type check
                if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                    throw new EvalError("illegal boolean expression: " + tree);
                }
            }

            // always return false for a while-loop expression
            result = new Value(false);

            return result;
        }//evaluateWhile()

        // Evaluate a set expression
        this.evaluateSet = function (tree) {
            //throws EvalError

            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            //emit an "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.getSubTree(0).numId,
                            'color': traverseColor,
                            'node': variable,
                        },
            });
            // check if this variable has already been declared
            if (!this.env.defined(variable, true)) {
                //runtime check
                throw new EvalError("undefined variable: " + variable);
            }

            // get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);
            // update this variable in the environment
            this.env.update(variable, result);

            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + this.env + "</pre>"; // for debugging purposes
            }

            return result;
        }

        this.evaluateBegin = function (tree) {

            //var result := Value
            var result = null;

            // Create a new Environment object chained to (or "nested in")
            // the previous (:outer") environment object.
            var previousEnv = this.env;
            this.env = new Environment(scope, previousEnv, "Local (begin)");
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                    }
            });

            // Evaluate each sub expression in the begin
            // expression (using the new environment chain).
            // The return value of each expression is
            // discarded, so any expression without a
            // side-effect is worthless.
            for (var i = 0; i < tree.degree() - 1; i++) {
                this.evaluateExp(tree.getSubTree(i));
            }

            // Evaluate the last expression and use its
            // value as the value of the begin expression.
            result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));

            this.env = previousEnv;  // Just before this method returns, we remove from the
            // chain of Environment objects the local Environment
            // object we created at the beginning of this method.
            // The local Environment object becomes a garbage object,
            return result;

        }//evaluateBegin()

        //Evaluate a var expression
        this.evaluateVar = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                //runtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            // emit "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': variable,
                    },
            });

            //check if this variable has already been declared
            //in the local environment
            if (this.env.definedLocal(variable)) {
                //runtime check
                throw new EvalError("variable already declared: " + variable + "\n");
            }

            //get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);

            // declare the new, local, variable
            this.env.add(variable, result);

            if (this.DEBUG > 0) {
                //for debugging purposes
                document.body.innerHTML += "<pre>" + this.env + "</pre>";
            }

            return result;
        }//evaluateVar()

        //Evaluate a print expression
        this.evaluatePrint = function (tree) {
            //throws EvakError

            if (1 != tree.degree()) {
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = this.evaluateExp(tree.getSubTree(0));

            //print the expression on the console.
            console.log("The printed result is" + result);

            return result;
        }//evalautePrint()

        //Evaluate a boolean expression
        this.evaluateBexp = function (tree) {
            //throws EvalError



            var result = false;
            var node = tree.element;


            var value = this.evaluateExp(tree.getSubTree(0));

            if (!(value.tag === value.BOOL_TAG)) {
                //runtime check
                throw new EvalError("not a boolean expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            result = value.valueB;

            if (node === "&&") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var xyz = 1; xyz < tree.degree() ; xyz++) {
                    if (result) {
                        value = this.evaluateExp(tree.getSubTree(xyz));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                                + tree.getSubTree(xyz) + "\n");
                        }
                        result = result && value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "&&"
                        result = false;
                        break;
                    }
                }
            }
            else if (node === "||") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var x = 1; x < tree.degree() ; x++) {
                    if (!result) {
                        value = this.evaluateExp(tree.getSubTree(x));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                            + tree.getSubTree(i) + "\n");
                        }
                        result = result || value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "||"
                        result = true;
                        break;
                    }
                }
            }
            else if (node === "!") {
                if (1 != tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = !result;
            }

            return new Value(result);
        }//evaluateBexp()

        // Evaluate a relational expression (which is a kind of boolean expression)
        this.evaluateRexp = function (tree) {


            if (2 != tree.degree()) {
                //rumtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = false;

            var opStr = tree.element;
            //emit a "nodeTraversal" event
            //the event code is further down in the function definition

            var valueL = this.evaluateExp(tree.getSubTree(0));

            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }

            var valueR = this.evaluateExp(tree.getSubTree(1));
            if (!(valueR.tag === valueR.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
            }

            var resultL = valueL.valueI;
            var resultR = valueR.valueI;

            if (opStr === "<") {
                result = resultL < resultR;
            }
            else if (opStr === ">") {
                result = resultL > resultR;
            }
            else if (opStr === "<=") {
                result = resultL <= resultR;
            }
            else if (opStr === ">=") {
                result = resultL >= resultR;
            }
            else if (opStr === "==") {
                result = resultL == resultR;
            }
            else if (opStr === "!=") {
                result = resultL != resultR;
            }

            //emit a "nodeTraversal" event: tree.element == relational operator
            var colorCode = "#ff0000"; //red color; code from http://html-color-codes.info/
            if (result) {
                //Color code from http://color.adobe.com
                colorCode = "#87ff1d"; //green
            }
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': colorCode,
                        'node' : opStr,
                    },
            });
            
            //if var result == T => highlight tree.element green, else highlight it red.
            //see the code in Evaluate.js of Language_6 for more info.
            return new Value(result);
        }//evaluateRexp()

        // Evaluate an arithmetic expression
        this.evaluateAexp = function (tree) {
            //throws EvalError


            var result = 0;
            var node = tree.element;
            //do not emit a "nodeTraversal" event since we
            //already did so in the evaluateExp function
            

            var valueL = this.evaluateExp(tree.getSubTree(0));
            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            var resultL = valueL.valueI;
            var resultR = 0;

            var valueR = null;
            if (tree.degree() >= 2) {
                valueR = this.evaluateExp(tree.getSubTree(1));
                if (!(valueR.tag === valueR.INT_TAG)) {
                    //runtime check
                    throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
                }
                resultR = valueR.valueI;
            }

            if (node === "+") {
                if (tree.degree() === 1) {
                    result = resultL;
                }
                else {
                    result = resultL + resultR;

                    for (var z = 2; z < tree.degree() ; z++) {
                        //temp := Value
                        var temp = this.evaluateExp(tree.getSubTree(z));
                        if (!(temp.tag === temp.INT_TAG)) {
                            //runtime check
                            throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(z) + "\n");
                        }
                        result += temp.valueI;
                    }
                }
            }
            else if (node === "-") {
                if (2 < tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                if (tree.degree() === 1) {
                    result = -resultL;
                }
                else {
                    result = resultL - resultR;
                }
            }
            else if (node === "*") {
                if (1 === tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                result = resultL * resultR;

                for (var a = 2; a < tree.degree() ; a++) {
                    var temp = this.evaluateExp(tree.getSubTree(a));
                    if (!(temp.tag === temp.INT_TAG)) {
                        //runtime check
                        throw new EvalError("not a integer expression: "
                                            + tree.getSubTree(a) + "\n");
                    }
                    result *= temp.valueI;
                }
            }
            else if (node === "/") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL / resultR;
            }
            else if (node === "%") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL % resultR;
            }
            else if (node === "^") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = Math.floor(Math.pow(resultL, resultR));
            }

            return new Value(result);
        }//evaluateAexp()
    }

    return {
            "Evaluate": Evaluate
        };

    }]);
    

})();

(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('parseErrorFactory', function () {
            

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

(function(){
//this factory needs a strong unit test!!
'use strict';
angular
        .module('astInterpreter')
        .factory('prettyPrinterFactory', function () {
            
            var counter = 0;

            function prettyPrint2(formatting, tree) {
                var result = "";

                if (tree.depth() === 0) {
                    return formatting + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                }
                else if (tree.depth() === 1) {
                    result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                    for (var i = 0; i < tree.degree() - 1; i++) {
                        result += prettyPrint2(" ", tree.getSubTree(i));
                    }
                    result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                    return result;
                }
                else if (tree.depth() > 1) {
                    if(tree.element === "prog" ||
                        tree.element === "begin") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var x = 0; x < tree.degree() ; x++) {
                            result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(x));
                        }
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "print") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var y = 0; y < tree.degree() - 1; y++) {
                            result += prettyPrint2(" ", tree.getSubTree(y));
                        }
                        result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                        return result;
                    }
                    else if (tree.element === "if") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(1));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(2));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "while") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "        ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "fun") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "lambda") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var t = 0; t < tree.degree() - 1; t++) {
                            result += prettyPrint2(" ", tree.getSubTree(t));
                        }
                        result += "\n" + prettyPrint2(formatting + "    ", tree.getSubTree(tree.degree() - 1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element == "apply") {
                        if(tree.depth() <= 2)
                        {
                            result +=  formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var c = 0; c < tree.degree() ; c++) {
                                result += prettyPrint2(" ", tree.getSubTree(c));
                            }
                            return result + " )";
                        }
                        else // tree.depth() > 2
                        {
                            //TODO: Implement this feature
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var app = 0; app < tree.degree() ; app++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(app));
                            }

                            return result + "\n" + formatting + ")";
                        }
                    }
                    else if(tree.element === "var" ||
                            tree.element === "set") {
                        if (tree.depth() === 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += prettyPrint2(" ", tree.getSubTree(1)) + " )";
                            return result;
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                            return result + "\n" + formatting + ")";

                        }
                    }
                    else if(tree.element === "+"  ||
                            tree.element === "-"  ||
                            tree.element === "*"  ||
                            tree.element === "/"  ||
                            tree.element === "^"  ||
                            tree.element === "%"  ||
                            tree.element === "--" ||
                            tree.element === "++" ||
                            tree.element === "||" ||
                            tree.element === "!=" ||
                            tree.element === "&&" ||
                            tree.element === "==" ||
                            tree.element === "<"  ||
                            tree.element === "<=" ||
                            tree.element === ">"  ||
                            tree.element === ">=" ){
                        if (tree.depth() > 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var z = 0; z < tree.degree() ; z++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(z));
                            }
                            return result + "\n" + formatting + ")";
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var q = 0; q < tree.degree() - 1; q++) {
                                result += prettyPrint2(" ", tree.getSubTree(q));
                            }
                            result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                            return result;
                        }
                    }
                }

                // Make sure this is never reached!
                //If this section of code is reached
                //there is a keyword in the program not accounted for
                //in this prettyprinter
                return "Needs to be Implemented 2";

            }

            function prettyPrint(tree) {
                var result = prettyPrint2("", tree);
                //console.log("Printing from prettyPrintFactory");
                //console.log(result);
                counter = 0; //reset the counter for proper highlighting of nodes
                return result;
            }

            return {
                'prettyPrint': prettyPrint
            }
        });
        
})();

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
            this._EQOP = 102; //since equality is a double-character operand it needs to be handled seperately
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
                     else if(this._currentChar.match(/=/)){
                        this._charClass = this._EQOP;
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

                        case this._EQOP:
                            this._addChar();
                            this._getChar();
                            while(this._charClass == this._EQOP){
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

                        //Parentheses and single-character operands
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
			
			/*
            * Returns false if all, or all but one, of the tokens have been "consumed".
            */  
            this.has2Token = function () {
               return (this._currentToken < this._tokens.length - 1);
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

(function () {
   "use strict"; 

   angular.module('astInterpreter')
   .factory('treeFactory', function(){
       
       function Tree(element) {
            this.element = element;
            this.subTrees = [];

            for(var x = 1; x < arguments.length; x++) {
                if (arguments[x] !== null) {
                    this.subTrees.push(arguments[x]);
                }

            }
            this.addSubTree = function(tree) {
                this.subTrees.push(tree);
            }
            this.getSubTree = function(index) {
                return this.subTrees[index];
            }

            this.degree = function() {
                return this.subTrees.length;
            }
            this.depth = function() {
                var result = 0;
                if (this.degree() > 0) {
                    var max = 0;
                    for(var y = 0; y < this.degree(); y++) {

                        var temp = this.getSubTree(y).depth();
                        if (temp > max) {
                            max = temp;
                        }
                    }
                    result = 1 + max;
                }
                return result;
            }

            this.toString = function() {
                var result = "";
                if (this.subTrees == []) {
                    result += element;
                }
                else {
                    result += "(" + this.element;
                    for(var z = 0; z < this.subTrees.length; z++) {
                        result += " " + this.subTrees[z];
                    }
                    result += ")";
                }
                return result;
            }

        }

        return {
            "Tree": Tree
        };

    });

})();


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

(function(){
    /**
   An Environment object holds <variable,value> pairs and
   it has a link to the rest of the objects in the environment
   chain. This link is used to look up "non-local" variable
   references.

   The Environment interface has methods for
   1) Adding new <variable,value> pairs to this environment object.
   2) Looking up a variable to see if it is in the Environment chain.
   2) Looking up a variable to see if it is in this Environment object.
   3) Looking up a variable's value from the variable's <variable,value> pair.
   4) Mutating the value part of a varaible's <variable,value> pair.
*/
    "use strict";
    angular
        .module('astInterpreter')
        .factory('l8.environmentFactory', function () {
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

            this.defined = function (variable, emitEvents) {
                return (null !== this.lookUp(variable, emitEvents));
            };
            
            
            //I need to set a parameter to tell the lookUp function if it should emit events or not
            this.lookUp = function (variable, emitEvents) {
                //when emitting events an id to the current env ( represented as a div) will need to be passed along
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        //if emitEvents is undefined assume the user wants events emitted
                        if (emitEvents) {
                            // set the color to be green i.e found the variable we are looking for
                            //emit an "envSearch" event
                            scope.main.addAnimationData({'name': "envSearch",
                                data: {
                                    'id': self.id,
                                    'label': self.label, 
                                    'childRank': i + 1,
                                    'color': "#5FAD00", //green; color code from color.adobe.com
                                }
                            });
                        }
                        
                        break;
                    }
                    //if emitEvents is undefined assume the user wants events emitted
                    if (emitEvents) {
                       //set the color to be red (i.e the variable currently looked up is not the one we want)
                       //emit an "envSearch" event
                       scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#FF4", //yellow; color code from color.adobe.com
                            }
                        });
                    }
                    
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
                        return this.nonLocalLink.lookUp(variable, emitEvents);
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
                        scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#5FAD00", //green; color code from color.adobe.com
                            }
                        });
                        break;
                    }
                    //set the color to be red (i.e the variable currently looked up is not the one we want)
                    //emit an "envSearch" event
                    scope.main.addAnimationData({'name': "envSearch",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'color': "#FF4", //yellow; color code from color.adobe.com "#FF4"
                        }
                    });
                }

                if (i < this.variables.length) {
                    this.values[i] = value;
                    scope.main.addAnimationData({'name': "envUpdate",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'value': variable + " = " + value,
                            'color': "#FF0302", //red; I want the user to note the change made
                        }
                    });
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

(function () {
    "use strict";

    angular
    .module('astInterpreter')
    .factory('l8.evaluateFactory', 
    [ 'l8.environmentFactory',
         'l8.valueFactory', 'l8.evalErrorFactory', 'l8.IPEPFactory', 
        function(environmentFactory, valueFactory, evalErrorFactory, IPEPFactory) {
            
        
        //Be careful of code breaking due to angular module name!!!
        var EvalError = evalErrorFactory.EvaluationError;
        
        var Environment = environmentFactory.Environment;
        var Value = valueFactory.Value;
        
        var IPEP = IPEPFactory.IPEP;
        //var EvalError = evalErrorFactory.EvaluationError;

    function Evaluate(scope) {
        //don't set this variable to 1 when running large programs
        //can cuase stack overflows due to large environments!!
        this.DEBUG = 0; //always keep this set to zero when running on Angularjs!
        var self = this;
        this.globalEnv = null;
        this.env = null;
        var traverseColor = "#14A84A"; // defualt color to use when highlighting the current node or: "#14A84A" "#3885A8"
        var id = 0; //used for the animation of nodes      //color codes from http://color.adobe.com  //^green   ^light-blue
        this.evaluate = function (tree) {
            //throws EvalError
            
            return this.evaluateProg(tree);
        }//evaluate()

        this.evaluateProg = function (tree) {


            //var result := Value
            var result = null;

            // Instantiate the global environment
            // (it will always be at the end of the
            // environment chain).
            this.globalEnv = new Environment(scope, null, "Global Env");
            this.env = this.globalEnv;
            
            //emit a "envStackPush" event
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.globalEnv.id,
                        'label': self.globalEnv.label,
                    }
            });

            // Check whick kind of Prog we have.
            if (!(tree.element === "prog")) {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate the single expression.
                //console.log("calling evaluateExp");
                result = this.evaluateExp(tree);
            }
            else {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate each Fun or Exp in the Prog.
                // Any Fun will have the side effect of putting
                // a function name in the global environment.
                // Any Var expressions will have the side effect
                // of putting a variable in the environment chain.
                // Any Set expressions will have the side effect
                // of changing a value in the environment chain.
                // Any Print expressions will have the side effect
                // of printing an output.
                // Any other expressions would be pointless!
                for (var i = 0; i < tree.degree() - 1 ; i++) {

                    //if (tree.getSubTree(i).element === "fun") {
                    //      scope.main.addAnimationData({'name': "nodeTraversal",
                    //            data: {
                    //                'id': tree.getSubTree(i).numId,
                    //                'color': traverseColor,
                    //                'node': tree.getSubTree(i).element,
                    //            }
                    //      });                      
                    //    this.handleFun(tree.getSubTree(i));
                    //}
                    //else {
                        this.evaluateExp(tree.getSubTree(i));
                    //}
                }

                // Evaluate the last expression and use its
                // value as the value of the prog expression.

                result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            }

            return result;

        }//evaluateProg()

        /**
         Handle a function definition. Notice that the return type
        is void since Fun isn't an expression.
        
        This method mutates the global environment object.
        The Value object put into the environment by this method
        has the tag "lambda" and its value field is a reference
        to the function's "lambda expression".
        */
        //this.handleFun = function (tree) {
        //    //throws EvalError
        //
        //    //get the function name
        //    var name = tree.getSubTree(0).element;
        //    //emit a "nodeTraversal" event
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': tree.getSubTree(0).numId,
        //                'color': traverseColor,
        //                'node': name,
        //            }
        //    });
        //
        //    // check if this function has already been defined
        //    if (this.env.definedLocal(name)) {
        //        //emit a "envLocalSearch" event
        //        throw new EvalError("function already exists: " + name);
        //    }
        //
        //    // get the "lambda expression" (the function value)
        //
        //    //var lambda := Tree
        //    var lambda = tree.getSubTree(1);
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': lambda.numId,
        //                'color': traverseColor,
        //                'node': lambda.element,
        //            }
        //    });
        //
        //    // check if the definition really is a function
        //    if (!(lambda.element === "lambda")) {
        //        throw new EvalError("bad function definition: " + tree);
        //    }
        //
        //    // create a function Value and
        //    // add a <name, lambda> pair to the environment
        //    this.env.add(name, new Value(lambda));
        //    //emit an "envAdd" event
        //    //note: handled in the environmentFactory.js file
        //
        //    if (this.DEBUG > 0) {
        //        // for debugging purposes
        //        document.body.innerHTML += "<pre>" + this.env + "</pre>";
        //    }
        //}//handleFun()

        //Evaluate an expression
        this.evaluateExp = function (tree) {
            //throws EvalError
            //console.log(tree + "evaluateExp param");


            var result = null;

            var node = tree.element;
            
            if (node === "fun") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateFun(tree);
            }
            else if (node === "apply") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateApply(tree);
            }
            else if (node === "if") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateIf(tree);
            }
            else if (node === "while") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateWhile(tree);
            }
            else if (node === "set") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateSet(tree);
            }
            else if (node === "begin") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBegin(tree);
            }
            else if (node === "var") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateVar(tree);
            }
            else if (node === "print") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluatePrint(tree);
            }
            else if ((node === "&&") || (node === "||") || (node === "!")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBexp(tree) //boolean expression
            }
            else if ((node === "<") || (node === ">")
                    || (node === "<=") || (node === ">=")
                    || (node === "==") || (node === "!=")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateRexp(tree); //relational operator
            }
            else if ((node === "+") || (node === "-")
                || (node === "*") || (node === "/")
                || (node === "%") || (node === "^")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateAexp(tree); //arithmetic expression
            }
            else if (tree.degree() === 0) {

                if ((node === "true") || (node === "false")) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(node === "true");
                }
                else if (node.match(/^[-]*[0-9][0-9]*/)) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(parseInt(node, 10));
                }
                else if (this.env.defined(node, false)) { // a variable
                    //since env.defined is basically a wrapper function
                    //for env.lookUp we will only emit one event
                    //I need to think about how this will work
                    
                    //emit "nodeTraversal" event
                    
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    //emit "envSearch" event
                    result = this.env.lookUp(node, true);
                }
                else {
                    //runtime check
                    throw new EvalError("undefined variable: " + node + "\n");
                }
            }
            else {

                throw new EvalError("invalid expression: " + tree + "\n");
            }

            return result;
        }//EvaluateExp()
        
        /**
            Evalute a function definition expression.
      
            This method mutates the current local environment object.
            The Value object put into the environment by this method
            has the tag "lambda" and its value field is a reference
            to an IPEP object.
      
            An IPEP object is usually called a "closure" and it contains
            two references. The first reference in a closure is an IP
            (an "Instruction Pointer") and the other a reference is an EP
            (an "Environment Pointer"). The IP reference refer's to the
            function's lambda expression (its "instructions"). The EP
            reference refer's to the function's outer scope, the scope
            that is needed for looking up the function's non-local references.
      
            Since functions in this language can be nested, the function's
            outer scope need no longer be the global environment (as it was
            in the previous languages). The function's outer scope is whatever
            local environment is being used at the time this evaluateFun()
            is called.
        */
        this.evaluateFun = function (tree){
            /**** Language_8 change (1) ***/
            //throws EvalError
    
            var result = null; /*** Language_8 change (2) ***/
    
            // get the function name
            var name = tree.getSubTree(0).element;
            
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': name,
                    }
            });
    
            // check if this function has already been defined
            if (this.env.definedLocal(name)) {
                throw new EvalError("function already exists: " + name);
            }
            // get the "lambda expression" (the function's IP)
            var lambda = tree.getSubTree(1);
            // check if the definition really is a function
            if (!(lambda.element === "lambda")) {
                throw new EvalError("bad function definition: " + tree);
            }
            // get a reference to the current local Environment object (the function's EP)
            var ep = this.env; /*** Language_8 change (3) ***/
            // create an IPEP object (a closure)
            var ipep = new IPEP(lambda, ep); /*** Language_8 change (4) ***/
            // create the return value
            result = new Value(ipep);           /*** Language_8 change (5) ***/
            // add the <name, value> pair to the environment
            this.env.add(name, result);              /*** Language_8 change (6) ***/
            
            //if (DEBUG > 0) {
            //    // for debugging purposes
            //    document.body.innerHTML += "<pre>" + env + "</pre>";
            //}
    
            return result;   /*** Language_8 change (7) ***/
        }//evaluateFun()
        

        /**
            This method "applies" a function value to actual parameters.
        This method evaluates the body of the function in an environment
        that binds the actual parameter values (from this function application)
        to the formal parameters (from the function's lambda expression).

            Since this language allows nested functions, the function's outer
        scope (where the function finds its non-local references) may no
        longer be the global Environment object. The function's closure
        (the IPEP object that is the functions "value") points us to the
        Environment object that the function should use for non-local
        references.
        */
        this.evaluateApply = function (tree) {
            //throw EvalError
            // Evaluate the apply's first parameter to a function value,
            /*1*/
            var funValue = this.evaluateExp(tree.getSubTree(0));

            // check that what we are applying really is a function,
            if (!(funValue.tag === funValue.LAMBDA_TAG)) {
                //runtime check
                throw new EvalError("bad function value: " + tree);
            }


            // get a reference to the function's  closure
            var ipep = funValue.valueL; /*** Language_8 change (1) ***/
            // and to the function's "lambda expression" and its "nesting link".
            var lambda = ipep.ip; /*** Language_8 change (2) ***/
            var ep = ipep.ep; /*** Language_8 change (3) ***/

            // Check that the number of actual parameters
            // is equal to the number of formal parameters.
            // (Actually, all we really need to know is that
            // the number of actual parameters is at least
            // the number of formal parameters.)

            if (tree.degree() !== lambda.degree()) {
                //runtime check

                throw new Evalerror("wrong number of parameters: " + tree);
            }

            // Create a new environment object that is "nested"
            // in this function's outer environment (lexical scope).
            // This environment is used to bind actual parameter
            // values to formal paramter names.
            /*2*/
            var localEnv = new Environment(scope, ep, "Function Activation");
            //emit "envStackPush" event
            //I might need to create a new event emitter named envStackPushFun
            //with a reference to the enclosing ep.id
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                        'epId': ep.id, //added a link to the environment pointer's id for drawing Bezier curves.
                    }
            });

            // Bind, in the new environment object, the actual parameter
            // values to the formal parameter names.
            /*3*/
            for (var zz = 1; zz < tree.degree() ; zz++) {
                // iterate through the actual parameters

                // Evaluate, using the current environment chain
                // (NOT the new local environment object)
                // an actual parameter expression's value.
                /*4*/
                var actualParamValue = this.evaluateExp(tree.getSubTree(zz));

                // Retrieve, from within the lambda expression,
                // a formal parameter name.
                /*5*/
                var formalParamName = lambda.getSubTree(zz - 1).element;
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': lambda.getSubTree(zz - 1).numId,
                            'color': traverseColor,
                            'node': formalParamName,
                        },
                });
                //console.log("Formal name : " + formalParamName);

                // Bind, in the new local environment object, the actual
                // paramter value to a formal parameter name.
                /*6*/
                localEnv.add(formalParamName, actualParamValue);
                //emit "envAdd" event; I don't believe we need an event emitter here

            }
            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + localEnv + "</pre>";// for debugging purposes
            }

            // Evaluate the body of the lambda expression using the
            // new environment (which contains the binding of the actual
            // parameter values to the function's formal parameter names).
            /*7*/
            var originalEnv = this.env;
            //ask Professor Kraft to draw a diagram of this code behavior on paper.
            /*8*/
            this.env = localEnv;

            /*9*/
            var result = this.evaluateExp(lambda.getSubTree(tree.degree() - 1));

            // Finally, restore the environment chain.
            /*10*/
            this.env = originalEnv;
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                        'closure': result.tag === 'lambda',
                        'epId': result.tag === 'lambda' ? ep.id : null,
                    }
            });
            // emit "envRemove" event?

            return result;
        



        }//evaluateApply()


        //Evaluate an if-expression
        this.evaluateIf = function (tree) {


            if (3 !== tree.degree()) {
                //runtime check
                throw new EvalError("incorrect conditional expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            if (conditionalExp.valueB) {

                result = this.evaluateExp(tree.getSubTree(1));
            }
            else {

                result = this.evaluateExp(tree.getSubTree(2));
            }

            return result;
        }//evaluateIf()

        //Evalaute a while-loop expression
        this.evaluateWhile = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                throw new EvalError("incorrect while expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //evaluate the boolean condition
            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime type check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            while (conditionalExp.valueB) {
                //evaluate the body of the loop (for its side effects)
                this.evaluateExp(tree.getSubTree(1));
                // re-evaluate the boolean condition
                conditionalExp = this.evaluateExp(tree.getSubTree(0));
                //do a runtime type check
                if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                    throw new EvalError("illegal boolean expression: " + tree);
                }
            }

            // always return false for a while-loop expression
            result = new Value(false);

            return result;
        }//evaluateWhile()

        // Evaluate a set expression
        this.evaluateSet = function (tree) {
            //throws EvalError

            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            //emit an "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.getSubTree(0).numId,
                            'color': traverseColor,
                            'node': variable,
                        },
            });
            // check if this variable has already been declared
            if (!this.env.defined(variable, true)) {
                //runtime check
                throw new EvalError("undefined variable: " + variable);
            }

            // get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);
            // update this variable in the environment
            this.env.update(variable, result);

            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + this.env + "</pre>"; // for debugging purposes
            }

            return result;
        }

        this.evaluateBegin = function (tree) {

            //var result := Value
            var result = null;

            // Create a new Environment object chained to (or "nested in")
            // the previous (:outer") environment object.
            var previousEnv = this.env;
            this.env = new Environment(scope, previousEnv, "Local (begin)");
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                        'epId': previousEnv.id,
                    }
            });

            // Evaluate each sub expression in the begin
            // expression (using the new environment chain).
            // The return value of each expression is
            // discarded, so any expression without a
            // side-effect is worthless.
            for (var i = 0; i < tree.degree() - 1; i++) {
                this.evaluateExp(tree.getSubTree(i));
            }

            // Evaluate the last expression and use its
            // value as the value of the begin expression.
            result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                        'closure': result.tag === 'lambda',
                        'epId': result.tag === 'lambda' ? previousEnv.id : null,
                    }
            });

            this.env = previousEnv;  // Just before this method returns, we remove from the
            // chain of Environment objects the local Environment
            // object we created at the beginning of this method.
            // The local Environment object becomes a garbage object,
            
            return result;

        }//evaluateBegin()

        //Evaluate a var expression
        this.evaluateVar = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                //runtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            // emit "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': variable,
                    },
            });

            //check if this variable has already been declared
            //in the local environment
            if (this.env.definedLocal(variable)) {
                //runtime check
                throw new EvalError("variable already declared: " + variable + "\n");
            }

            //get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);

            // declare the new, local, variable
            this.env.add(variable, result);

            if (this.DEBUG > 0) {
                //for debugging purposes
                document.body.innerHTML += "<pre>" + this.env + "</pre>";
            }

            return result;
        }//evaluateVar()

        //Evaluate a print expression
        this.evaluatePrint = function (tree) {
            //throws EvakError

            if (1 != tree.degree()) {
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = this.evaluateExp(tree.getSubTree(0));

            //print the expression on the console.
            console.log("The printed result is" + result);

            return result;
        }//evalautePrint()

        //Evaluate a boolean expression
        this.evaluateBexp = function (tree) {
            //throws EvalError



            var result = false;
            var node = tree.element;


            var value = this.evaluateExp(tree.getSubTree(0));

            if (!(value.tag === value.BOOL_TAG)) {
                //runtime check
                throw new EvalError("not a boolean expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            result = value.valueB;

            if (node === "&&") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var xyz = 1; xyz < tree.degree() ; xyz++) {
                    if (result) {
                        value = this.evaluateExp(tree.getSubTree(xyz));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                                + tree.getSubTree(xyz) + "\n");
                        }
                        result = result && value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "&&"
                        result = false;
                        break;
                    }
                }
            }
            else if (node === "||") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var x = 1; x < tree.degree() ; x++) {
                    if (!result) {
                        value = this.evaluateExp(tree.getSubTree(x));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                            + tree.getSubTree(i) + "\n");
                        }
                        result = result || value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "||"
                        result = true;
                        break;
                    }
                }
            }
            else if (node === "!") {
                if (1 != tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = !result;
            }

            return new Value(result);
        }//evaluateBexp()

        // Evaluate a relational expression (which is a kind of boolean expression)
        this.evaluateRexp = function (tree) {


            if (2 != tree.degree()) {
                //rumtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = false;

            var opStr = tree.element;
            //emit a "nodeTraversal" event
            //the event code is further down in the function definition

            var valueL = this.evaluateExp(tree.getSubTree(0));

            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }

            var valueR = this.evaluateExp(tree.getSubTree(1));
            if (!(valueR.tag === valueR.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
            }

            var resultL = valueL.valueI;
            var resultR = valueR.valueI;

            if (opStr === "<") {
                result = resultL < resultR;
            }
            else if (opStr === ">") {
                result = resultL > resultR;
            }
            else if (opStr === "<=") {
                result = resultL <= resultR;
            }
            else if (opStr === ">=") {
                result = resultL >= resultR;
            }
            else if (opStr === "==") {
                result = resultL == resultR;
            }
            else if (opStr === "!=") {
                result = resultL != resultR;
            }

            //emit a "nodeTraversal" event: tree.element == relational operator
            var colorCode = "#ff0000"; //red color; code from http://html-color-codes.info/
            if (result) {
                //Color code from http://color.adobe.com
                colorCode = "#87ff1d"; //green
            }
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': colorCode,
                        'node' : opStr,
                    },
            });
            
            //if var result == T => highlight tree.element green, else highlight it red.
            //see the code in Evaluate.js of Language_6 for more info.
            return new Value(result);
        }//evaluateRexp()

        // Evaluate an arithmetic expression
        this.evaluateAexp = function (tree) {
            //throws EvalError


            var result = 0;
            var node = tree.element;
            //do not emit a "nodeTraversal" event since we
            //already did so in the evaluateExp function
            

            var valueL = this.evaluateExp(tree.getSubTree(0));
            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            var resultL = valueL.valueI;
            var resultR = 0;

            var valueR = null;
            if (tree.degree() >= 2) {
                valueR = this.evaluateExp(tree.getSubTree(1));
                if (!(valueR.tag === valueR.INT_TAG)) {
                    //runtime check
                    throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
                }
                resultR = valueR.valueI;
            }

            if (node === "+") {
                if (tree.degree() === 1) {
                    result = resultL;
                }
                else {
                    result = resultL + resultR;

                    for (var z = 2; z < tree.degree() ; z++) {
                        //temp := Value
                        var temp = this.evaluateExp(tree.getSubTree(z));
                        if (!(temp.tag === temp.INT_TAG)) {
                            //runtime check
                            throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(z) + "\n");
                        }
                        result += temp.valueI;
                    }
                }
            }
            else if (node === "-") {
                if (2 < tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                if (tree.degree() === 1) {
                    result = -resultL;
                }
                else {
                    result = resultL - resultR;
                }
            }
            else if (node === "*") {
                if (1 === tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                result = resultL * resultR;

                for (var a = 2; a < tree.degree() ; a++) {
                    var temp = this.evaluateExp(tree.getSubTree(a));
                    if (!(temp.tag === temp.INT_TAG)) {
                        //runtime check
                        throw new EvalError("not a integer expression: "
                                            + tree.getSubTree(a) + "\n");
                    }
                    result *= temp.valueI;
                }
            }
            else if (node === "/") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL / resultR;
            }
            else if (node === "%") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL % resultR;
            }
            else if (node === "^") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = Math.floor(Math.pow(resultL, resultR));
            }

            return new Value(result);
        }//evaluateAexp()
    }

    return {
            "Evaluate": Evaluate
        };

    }]);
    

})();

(function(){
    'use strict';
    
    angular.module('astInterpreter')
        .factory('l8.IPEPFactory', function(){
            
            /*
                Construct a IPEP object
            */
            function IPEP(tree, env) {
                this.ip = tree; // the ip, the "instruction pointer"
                this.ep = env;  // the ep, the "environment pointer"
            }
            
            return{
                'IPEP': IPEP,
            }
            
        });
})();

(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('l8.parseErrorFactory', function () {
            

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

/**
   This program parses a token stream for the following grammar
   and builds an Abstract Syntax Tree (AST).

       Prog ::= Exp
              | '(' 'prog' Exp+ Exp ')'

        Exp ::= Fun
              | Apply
              | If
              | While
              | Set
              | Var
              | Begin
              | Print
              | AExp
              | BExp
              | INTEGER
              | BOOLEAN
              | VARIABLE

        Fun ::= '(' 'fun' VARIABLE Lambda ')'   // a function declaration

     Lambda ::= '(' 'lambda' VARIABLE* Exp ')'  // formal parameters followed by function body

      Apply ::= '(' 'apply' Exp Exp* ')'        // function value followed by actual parameters

         If ::= '(' 'if' Exp Exp Exp ')'

      While ::= '(' 'while' Exp Exp ')'

        Set ::= '(' 'set' VARIABLE Exp ')'

        Var ::= '(' 'var' VARIABLE Exp ')'

      Begin ::= '(' 'begin' Exp+ Exp ')'

      Print ::= '(' 'print' Exp ')'

       BExp ::= '(' '||'  Exp Exp+ ')'
              | '(' '&&'  Exp Exp+ ')'
              | '(' '!'   Exp ')'
              | '(' RelOp Exp Exp ')'
              | '('  EqOp Exp Exp ')'

      RelOp ::= '<' | '>' | '<=' | '>='
       EqOp ::= '==' | '!='

       AExp ::= '(' '+' Exp Exp* ')'
              | '(' '-' Exp Exp? ')'
              | '(' '*' Exp Exp+ ')'
              | '(' '/' Exp Exp  ')'
              | '(' '%' Exp Exp  ')'
              | '(' '^' Exp Exp  ')'

    INTEGER ::= [-][0-9]+
    BOOLEAN ::= 'true' | 'false'
   VARIABLE ::= [a-zA-Z][a-zA-Z0-9]*
*/


(function(){
    'use strict';
    //TODO: turn the parser into an object!!
    angular
        .module('astInterpreter')
        .factory('l8.parserFactory', ['l8.tokenizerFactory', 'l8.treeFactory', 'l8.parseErrorFactory', function(tokenizerFactory, treeFactory, parseFactory){
            console.log('Parser loaded in angular');
            
            var Tokenizer = tokenizerFactory.Tokenizer;
        
            var Tree = treeFactory.Tree;
            
            var ParseError = parseFactory.ParseError;
            
            function Parser() {
                this.counter = 0;
                
                this.parse = function (expStr) {
                    //throws PraseError
                    
                    
                    var tokens = new Tokenizer(expStr); // Tokenizer is defined
                                                        // in Tokenizer.js
                    var result = this.getProg(tokens); // parse the token stream
                    
                    if (tokens.hasToken()) {
                        throw new ParseError("unexpected input: " + tokens.peekToken() + "\n" + tokens + "\n");
                    }
            
                    return result;
        
        
                }//parse()

            //Parse a prog
            this.getProg = function (tokens) {
                
        
                var result = null;
        
                // Check whick kind of Prog we have.
                if (! (tokens.has2Token() && (tokens.peek2Token() === "prog")) ) {
                    // Evaluate the single expression.
                    result = this.getExp(tokens);
                }
                else {
                    tokens.match("(");
        
                    if (!tokens.match("prog")) {
                        throw new ParseError("expected 'prog': " + tokens);
                    }
        
                    result = new Tree("prog");
                    result.numId = this.counter;
                    this.counter++;
        
                    // Parse each Exp in the Prog.
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        
                            result.addSubTree(this.getExp(tokens));
                    }
        
                    if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                        console.log("called from getProg");
                        throw new ParseError("expected ')': " + tokens);
                    }
                }
        
                return result;
            }//getProg()

            // Parse a function definition.
            this.getFun = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("fun")) {
                    throw new ParseError("expected 'fun': " + tokens);
                }
        
                var result = new Tree("fun");
                result.numId = this.counter++;
        
                // parse the function name
                if (tokens.hasToken()) {
                    //this may be a source of bugs 10/22/16
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = this.counter++;
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected function name: " + tokens);
                }
        
                // parse the lambda expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getLambda(tokens));
                }
                else {
                    throw new ParseError("expected lambda expression: " + tokens);
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from this.getFun");
                    throw new ParseError("expected ')': " + tokens);
                }
                return result;
            }//getFun()

            // Parse a lambda expression
            this.getLambda = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("lambda")) {
                    throw new ParseError("expected 'lambda': " + tokens);
                }
        
                var result = new Tree("lambda");
                result.numId = this.counter++;
        
                // this is not really correct since we are not distinguishing
                // between the formal parameters and the function body
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(this.getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from this.getLambda");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getLambda()
        
            // Parse an expression
            this.getExp = function (tokens) {
                //throws ParseError
        
                var result = null;
        
                var tk = tokens.peekToken();
        
                if (tk === "(") {
                    if (tokens.has2Token()) {
                        tk = tokens.peek2Token();
                    }
                    else {
                        throw new ParseError("expected an expression: " + tokens);
                    }
        
                    if (tk === "fun") {
                        result = this.getFun(tokens);
                    }
                    else if (tk === "apply") {
                        result = this.getApply(tokens);
                    }
                    else if (tk === "if") {
                        result = this.getIf(tokens);
                    }
                    else if (tk === "while") {
                        result = this.getWhile(tokens);
                    }
                    else if (tk === "set") {
                        result = this.getSet(tokens);
                    }
                    else if (tk === "var") {
                        result = this.getVar(tokens);
                    }
                    else if (tk === "begin") {
                        result = this.getBegin(tokens);
                    }
                    else if (tk === "print") {
                        result = this.getPrint(tokens);
                    }
                    else if ( (tk === "&&") || (tk === "||")
                           || (tk === "!")) {
                        result = this.getBexp(tokens); //boolean expression
                    }
                    else if ( (tk === "<")  || (tk === ">")
                           || (tk === "<=") || (tk === ">=")
                           || (tk === "==") || (tk == "!=") ) {
                        result = this.getRexp(tokens); //relational expression
                    }
                    else if ((tk === "+") || (tk === "-")
                           || (tk === "*") || (tk === "/")
                           || (tk === "%") || (tk == "^")) {
                        result = this.getAexp(tokens); //arithmetic expression
                    }
                    else {
                        throw new ParseError("unexpected expression: " + tk);
                    }
                }
                else {
                    result = new Tree(tokens.nextToken());
                    result.numId = this.counter++;
                }
        
                return result;
            }//getExp()
        
            // Parse a function application.
            this.getApply = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("apply")) {
                    throw new ParseError("expected 'apply': " + tokens);
                }
        
                var result = new Tree("apply");
                result.numId = this.counter++;
        
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(this.getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from this.getApply");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getApply()
        
            // Parse an if-expression
            this.getIf = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("if")) {
                    throw new ParseError("expected 'if': " + tokens);
                }
        
                var result = new Tree("if");
                result.numId = this.counter++;
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected conditional expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected then expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected else expression: " + tokens);
                }
                console.log("about to call the problem" + tokens.peekToken());
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getIf");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getIf()
        
            // Parse a while-loop expression
            this.getWhile = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("while")) {
                    throw new ParseError("expected 'while': " + tokens);
                }
        
                var result = new Tree("while");
                result.numId = this.counter++;
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected conditional expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected loop body: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getWhile");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getWhile()
        
            // Parse a set expression
            this.getSet = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("set")) {
                    throw new ParseError("expected 'set': " + tokens);
                }
        
                var result = new Tree("set");
                result.numId = this.counter++;
        
                // parse the variable
                if (tokens.hasToken()) {
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = this.counter++;
                    
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected variable name: " + tokens);
                }
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected variable value: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getSet");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getSet()
        
            // Parse a var expression
            this.getVar = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("var")) {
                    throw new ParseError("expected 'var': " + tokens);
                }
        
                var result = new Tree("var");
                result.numId = this.counter++;
        
                // parse the variable
                if (tokens.hasToken()) {
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = this.counter++;
                    
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected variable name: " + tokens);
                }
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected variable value: " + tokens);
                }
                
                if (!(  tokens.hasToken()  &&  tokens.match(")"))) {
                    //console.log("called from this.getVarrr");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getVar()
        
            // Parse a begin expression
            this.getBegin = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("begin")) {
                    throw new ParseError("expected 'begin': " + tokens);
                }
        
                var result = new Tree("begin");
                result.numId = this.counter++;
        
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(this.getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from begin");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//this.getBegin()
        
            // Parse a print expression
            this.getPrint = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("print")) {
                    throw new ParseError("expected 'print': " + tokens);
                }
        
                var result = new Tree("print");
                result.numId = this.counter++;
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected print's expression: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getPrint");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getPrint()
        
            this.getBexp = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = this.counter++;
        
                if ((tk === "&&") || (tk === "||")) {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse the second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(this.getExp(tokens));
                    }
                }
                else if (tk === "!") {
                    //parse the expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected !'s operand: " + tokens);
                    }
                }
                else {
                    // shouldn't get here
                    throw new ParseError("unexpected boolean operator: " + tk);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getBexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getBexp()
        
            // Parse a relational expression (which is a kind of boolean expression)
            this.getRexp = function (tokens) {
                //throws ParseError
        
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = this.counter++;
        
                //parse the first expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                }
        
                //parse the second expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getRexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getRexp()
        
            // Parse an arithmetic expression
            this.getAexp = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = this.counter++;
        
                if (tk === "+") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(this.getExp(tokens));
                    }
                }
                else if (tk === "-") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
                }
                else if (tk === "*") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(this.getExp(tokens));
                    }
                }
                else if ((tk === "/") || (tk === "%") || (tk === "^")) {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
                }
                else {
                    // shouldn't get here
                    throw new ParseError("expected arithmetic operator: " + tk);
                }
        
        
                //Note: some the the logical expressions (like the one below) are different from the
                //way Prof. Kraft wrote them. Proof by truth table 
                //shows them to be logically equivalent
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getAexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getAexp()
        }
            
            
            
            
    
            return {
                'Parser': Parser,
            };
    }]);
})();

(function(){
//this factory needs a strong unit test!!
'use strict';
angular
        .module('astInterpreter')
        .factory('l8.prettyPrinterFactory', function () {
            
            var counter = 0;

            function prettyPrint2(formatting, tree) {
                var result = "";

                if (tree.depth() === 0) {
                    return formatting + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                }
                else if (tree.depth() === 1) {
                    result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                    for (var i = 0; i < tree.degree() - 1; i++) {
                        result += prettyPrint2(" ", tree.getSubTree(i));
                    }
                    result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                    return result;
                }
                else if (tree.depth() > 1) {
                    if(tree.element === "prog" ||
                        tree.element === "begin") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var x = 0; x < tree.degree() ; x++) {
                            result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(x));
                        }
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "print") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var y = 0; y < tree.degree() - 1; y++) {
                            result += prettyPrint2(" ", tree.getSubTree(y));
                        }
                        result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                        return result;
                    }
                    else if (tree.element === "if") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(1));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(2));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "while") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "        ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "fun") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "lambda") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var t = 0; t < tree.degree() - 1; t++) {
                            result += prettyPrint2(" ", tree.getSubTree(t));
                        }
                        result += "\n" + prettyPrint2(formatting + "    ", tree.getSubTree(tree.degree() - 1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element == "apply") {
                        if(tree.depth() <= 2) // changed from == 2 to <= 2 19/22/16
                        {
                            result +=  formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var c = 0; c < tree.degree() ; c++) {
                                result += prettyPrint2(" ", tree.getSubTree(c));
                            }
                            return result + " )";
                        }
                        else //tree.depth > 2
                        {
                            //TODO: Implement this feature
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var app = 0; app < tree.degree() ; app++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(app));
                            }

                            return result + "\n" + formatting + ")";
                        }
                    }
                    else if(tree.element === "var" ||
                            tree.element === "set") {
                        if (tree.depth() === 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += prettyPrint2(" ", tree.getSubTree(1)) + " )";
                            return result;
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                            return result + "\n" + formatting + ")";

                        }
                    }
                    else if(tree.element === "+"  ||
                            tree.element === "-"  ||
                            tree.element === "*"  ||
                            tree.element === "/"  ||
                            tree.element === "^"  ||
                            tree.element === "%"  ||
                            tree.element === "--" ||
                            tree.element === "++" ||
                            tree.element === "||" ||
                            tree.element === "!=" ||
                            tree.element === "&&" ||
                            tree.element === "==" ||
                            tree.element === "<"  ||
                            tree.element === "<=" ||
                            tree.element === ">"  ||
                            tree.element === ">=" ){
                        if (tree.depth() > 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var z = 0; z < tree.degree() ; z++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(z));
                            }
                            return result + "\n" + formatting + ")";
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var q = 0; q < tree.degree() - 1; q++) {
                                result += prettyPrint2(" ", tree.getSubTree(q));
                            }
                            result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                            return result;
                        }
                    }
                }

                // Make sure this is never reached!
                //If this section of code is reached
                //there is a keyword in the program not accounted for
                //in this prettyprinter
                return "Needs to be Implemented 2";

            }

            function prettyPrint(tree) {
                var result = prettyPrint2("", tree);
                //console.log("Printing from prettyPrintFactory");
                //console.log(result);
                counter = 0; //reset the counter for proper highlighting of nodes
                return result;
            }

            return {
                'prettyPrint': prettyPrint
            }
        });
        
})();

(function () {
   "use strict"; 
   angular.module('astInterpreter')
        .factory('l8.tokenizerFactory', function () {
           

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
			
			/*
            * Returns false if all, or all but one, of the tokens have been "consumed".
            */  
            this.has2Token = function () {
               return (this._currentToken < this._tokens.length - 1);
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

(function () {
   "use strict"; 

   angular.module('astInterpreter')
   .factory('l8.treeFactory', function(){
       
       function Tree(element) {
            this.element = element;
            this.subTrees = [];

            for(var x = 1; x < arguments.length; x++) {
                if (arguments[x] !== null) {
                    this.subTrees.push(arguments[x]);
                }

            }
            this.addSubTree = function(tree) {
                this.subTrees.push(tree);
            }
            this.getSubTree = function(index) {
                return this.subTrees[index];
            }

            this.degree = function() {
                return this.subTrees.length;
            }
            this.depth = function() {
                var result = 0;
                if (this.degree() > 0) {
                    var max = 0;
                    for(var y = 0; y < this.degree(); y++) {

                        var temp = this.getSubTree(y).depth();
                        if (temp > max) {
                            max = temp;
                        }
                    }
                    result = 1 + max;
                }
                return result;
            }

            this.toString = function() {
                var result = "";
                if (this.subTrees == []) {
                    result += element;
                }
                else {
                    result += "(" + this.element;
                    for(var z = 0; z < this.subTrees.length; z++) {
                        result += " " + this.subTrees[z];
                    }
                    result += ")";
                }
                return result;
            }

        }

        return {
            "Tree": Tree
        };

    });

})();


(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('l8.valueFactory', function () {
            


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
                        //This means value is an IPEP
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

(function(){
    /**
   An Environment object holds <variable,value> pairs and
   it has a link to the rest of the objects in the environment
   chain. This link is used to look up "non-local" variable
   references.

   The Environment interface has methods for
   1) Adding new <variable,value> pairs to this environment object.
   2) Looking up a variable to see if it is in the Environment chain.
   2) Looking up a variable to see if it is in this Environment object.
   3) Looking up a variable's value from the variable's <variable,value> pair.
   4) Mutating the value part of a varaible's <variable,value> pair.
*/
    "use strict";
    angular
        .module('astInterpreter')
        .factory('l9.environmentFactory', function () {
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

            this.defined = function (variable, emitEvents) {
                return (null !== this.lookUp(variable, emitEvents));
            };
            
            
            //I need to set a parameter to tell the lookUp function if it should emit events or not
            this.lookUp = function (variable, emitEvents) {
                //when emitting events an id to the current env ( represented as a div) will need to be passed along
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        //if emitEvents is undefined assume the user wants events emitted
                        if (emitEvents) {
                            // set the color to be green i.e found the variable we are looking for
                            //emit an "envSearch" event
                            scope.main.addAnimationData({'name': "envSearch",
                                data: {
                                    'id': self.id,
                                    'label': self.label, 
                                    'childRank': i + 1,
                                    'color': "#5FAD00", //green; color code from color.adobe.com
                                }
                            });
                        }
                        
                        break;
                    }
                    //if emitEvents is undefined assume the user wants events emitted
                    if (emitEvents) {
                       //set the color to be red (i.e the variable currently looked up is not the one we want)
                       //emit an "envSearch" event
                       scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#FF4", //yellow; color code from color.adobe.com
                            }
                        });
                    }
                    
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
                        return this.nonLocalLink.lookUp(variable, emitEvents);
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
                        scope.main.addAnimationData({'name': "envSearch",
                            data: {
                                'id': self.id,
                                'label': self.label, 
                                'childRank': i + 1,
                                'color': "#5FAD00", //green; color code from color.adobe.com
                            }
                        });
                        break;
                    }
                    //set the color to be red (i.e the variable currently looked up is not the one we want)
                    //emit an "envSearch" event
                    scope.main.addAnimationData({'name': "envSearch",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'color': "#FF4", //yellow; color code from color.adobe.com "#FF4"
                        }
                    });
                }

                if (i < this.variables.length) {
                    this.values[i] = value;
                    scope.main.addAnimationData({'name': "envUpdate",
                        data: {
                            'id': self.id,
                            'label': self.label, 
                            'childRank': i + 1,
                            'value': variable + " = " + value,
                            'color': "#FF0302", //red; I want the user to note the change made
                        }
                    });
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

(function () {
    "use strict";

    angular
        .module('astInterpreter')
        .factory('l9.evalErrorFactory', function(){
            

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

(function () {
    "use strict";

    angular
    .module('astInterpreter')
    .factory('l9.evaluateFactory', 
    [ 'l8.environmentFactory',
         'l8.valueFactory', 'l8.evalErrorFactory', 'l8.IPEPFactory', 
        function(environmentFactory, valueFactory, evalErrorFactory, IPEPFactory) {
            
        
        //Be careful of code breaking due to angular module name!!!
        var EvalError = evalErrorFactory.EvaluationError;
        
        var Environment = environmentFactory.Environment;
        var Value = valueFactory.Value;
        
        var IPEP = IPEPFactory.IPEP;
        //var EvalError = evalErrorFactory.EvaluationError;

    function Evaluate(scope) {
        //don't set this variable to 1 when running large programs
        //can cuase stack overflows due to large environments!!
        this.DEBUG = 0; //always keep this set to zero when running on Angularjs!
        var self = this;
        this.globalEnv = null;
        this.env = null;
        var traverseColor = "#14A84A"; // defualt color to use when highlighting the current node or: "#14A84A" "#3885A8"
        var id = 0; //used for the animation of nodes      //color codes from http://color.adobe.com  //^green   ^light-blue
        this.evaluate = function (tree) {
            //throws EvalError
            
            return this.evaluateProg(tree);
        }//evaluate()

        this.evaluateProg = function (tree) {


            //var result := Value
            var result = null;

            // Instantiate the global environment
            // (it will always be at the end of the
            // environment chain).
            this.globalEnv = new Environment(scope, null, "Global Env");
            this.env = this.globalEnv;
            
            //emit a "envStackPush" event
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.globalEnv.id,
                        'label': self.globalEnv.label,
                    }
            });

            // Check whick kind of Prog we have.
            if (!(tree.element === "prog")) {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate the single expression.
                //console.log("calling evaluateExp");
                result = this.evaluateExp(tree);
            }
            else {
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': tree.element,
                    }
                });
                // Evaluate each Fun or Exp in the Prog.
                // Any Fun will have the side effect of putting
                // a function name in the global environment.
                // Any Var expressions will have the side effect
                // of putting a variable in the environment chain.
                // Any Set expressions will have the side effect
                // of changing a value in the environment chain.
                // Any Print expressions will have the side effect
                // of printing an output.
                // Any other expressions would be pointless!
                for (var i = 0; i < tree.degree() - 1 ; i++) {

                    //if (tree.getSubTree(i).element === "fun") {
                    //      scope.main.addAnimationData({'name': "nodeTraversal",
                    //            data: {
                    //                'id': tree.getSubTree(i).numId,
                    //                'color': traverseColor,
                    //                'node': tree.getSubTree(i).element,
                    //            }
                    //      });                      
                    //    this.handleFun(tree.getSubTree(i));
                    //}
                    //else {
                        this.evaluateExp(tree.getSubTree(i));
                    //}
                }

                // Evaluate the last expression and use its
                // value as the value of the prog expression.

                result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            }

            return result;

        }//evaluateProg()

        /**
         Handle a function definition. Notice that the return type
        is void since Fun isn't an expression.
        
        This method mutates the global environment object.
        The Value object put into the environment by this method
        has the tag "lambda" and its value field is a reference
        to the function's "lambda expression".
        */
        //this.handleFun = function (tree) {
        //    //throws EvalError
        //
        //    //get the function name
        //    var name = tree.getSubTree(0).element;
        //    //emit a "nodeTraversal" event
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': tree.getSubTree(0).numId,
        //                'color': traverseColor,
        //                'node': name,
        //            }
        //    });
        //
        //    // check if this function has already been defined
        //    if (this.env.definedLocal(name)) {
        //        //emit a "envLocalSearch" event
        //        throw new EvalError("function already exists: " + name);
        //    }
        //
        //    // get the "lambda expression" (the function value)
        //
        //    //var lambda := Tree
        //    var lambda = tree.getSubTree(1);
        //    scope.main.addAnimationData({'name': "nodeTraversal",
        //            data: {
        //                'id': lambda.numId,
        //                'color': traverseColor,
        //                'node': lambda.element,
        //            }
        //    });
        //
        //    // check if the definition really is a function
        //    if (!(lambda.element === "lambda")) {
        //        throw new EvalError("bad function definition: " + tree);
        //    }
        //
        //    // create a function Value and
        //    // add a <name, lambda> pair to the environment
        //    this.env.add(name, new Value(lambda));
        //    //emit an "envAdd" event
        //    //note: handled in the environmentFactory.js file
        //
        //    if (this.DEBUG > 0) {
        //        // for debugging purposes
        //        document.body.innerHTML += "<pre>" + this.env + "</pre>";
        //    }
        //}//handleFun()

        //Evaluate an expression
        this.evaluateExp = function (tree) {
            //throws EvalError
            //console.log(tree + "evaluateExp param");


            var result = null;

            var node = tree.element;
            
            if (node === "fun") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateFun(tree);
            }
            else if (node === "lambda") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateLambda(tree);
            }
            else if (node === "apply") {
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateApply(tree);
            }
            else if (node === "if") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateIf(tree);
            }
            else if (node === "while") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateWhile(tree);
            }
            else if (node === "set") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateSet(tree);
            }
            else if (node === "begin") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBegin(tree);
            }
            else if (node === "var") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateVar(tree);
            }
            else if (node === "print") {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluatePrint(tree);
            }
            else if ((node === "&&") || (node === "||") || (node === "!")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateBexp(tree) //boolean expression
            }
            else if ((node === "<") || (node === ">")
                    || (node === "<=") || (node === ">=")
                    || (node === "==") || (node === "!=")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateRexp(tree); //relational operator
            }
            else if ((node === "+") || (node === "-")
                || (node === "*") || (node === "/")
                || (node === "%") || (node === "^")) {
                //emit "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': traverseColor,
                        'node': node,
                    },
                });
                result = this.evaluateAexp(tree); //arithmetic expression
            }
            else if (tree.degree() === 0) {

                if ((node === "true") || (node === "false")) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(node === "true");
                }
                else if (node.match(/^[-]*[0-9][0-9]*/)) {
                    //emit "nodeTraversal" event
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    result = new Value(parseInt(node, 10));
                }
                else if (this.env.defined(node, false)) { // a variable
                    //since env.defined is basically a wrapper function
                    //for env.lookUp we will only emit one event
                    //I need to think about how this will work
                    
                    //emit "nodeTraversal" event
                    
                    scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.numId,
                            'color': traverseColor,
                            'node': node,
                        },
                    });
                    //emit "envSearch" event
                    result = this.env.lookUp(node, true);
                }
                else {
                    //runtime check
                    throw new EvalError("undefined variable: " + node + "\n");
                }
            }
            else {

                throw new EvalError("invalid expression: " + tree + "\n");
            }

            return result;
        }//EvaluateExp()
        
        /**
            Evalute a function definition expression.
      
            This method mutates the current local environment object.
            The Value object put into the environment by this method
            has the tag "lambda" and its value field is a reference
            to an IPEP object.
      
            An IPEP object is usually called a "closure" and it contains
            two references. The first reference in a closure is an IP
            (an "Instruction Pointer") and the other a reference is an EP
            (an "Environment Pointer"). The IP reference refer's to the
            function's lambda expression (its "instructions"). The EP
            reference refer's to the function's outer scope, the scope
            that is needed for looking up the function's non-local references.
      
            Since functions in this language can be nested, the function's
            outer scope need no longer be the global environment (as it was
            in the previous languages). The function's outer scope is whatever
            local environment is being used at the time this evaluateFun()
            is called.
        */
        this.evaluateFun = function (tree){
            /**** Language_9 change (1) ***/
            //throws EvalError
    
            var result = null; /*** Language_9 change (2) ***/
    
            // get the function name
            var name = tree.getSubTree(0).element;
            
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': name,
                    }
            });
    
            // check if this function has already been defined
            if (this.env.definedLocal(name)) {
                throw new EvalError("function already exists: " + name);
            }
            // get the "lambda expression" (the function's IP)
            var lambda = tree.getSubTree(1);
            // check if the definition really is a function
            if (!(lambda.element === "lambda")) {
                throw new EvalError("bad function definition: " + tree);
            }
            
            result = this.evaluateLambda(lambda);
            // add the <name, value> pair to the environment
            this.env.add(name, result);              /*** Language_9 change (6) ***/
            
            //if (DEBUG > 0) {
            //    // for debugging purposes
            //    document.body.innerHTML += "<pre>" + env + "</pre>";
            //}
    
            return result;   /*** Language_9 change (7) ***/
        }//evaluateFun()

        this.evaluateLambda = function(tree){
            //throws EvalError

            var result = null;
            // get the "lambda expression" (the function's IP)
            var lambda = tree;
            // check if the definition really is a function
            if (!(lambda.element === "lambda")) {
                throw new EvalError("bad function definition: " + tree);
            }
            // get a reference to the current local Environment object (the function's EP)
            var ep = this.env; /*** Language_9 change (3) ***/
            // create an IPEP object (a closure)
            var ipep = new IPEP(lambda, ep); /*** Language_9 change (4) ***/
            // create the return value
            result = new Value(ipep);           /*** Language_9 change (5) ***/

            return result;
        }
        

        /**
            This method "applies" a function value to actual parameters.
        This method evaluates the body of the function in an environment
        that binds the actual parameter values (from this function application)
        to the formal parameters (from the function's lambda expression).

            Since this language allows nested functions, the function's outer
        scope (where the function finds its non-local references) may no
        longer be the global Environment object. The function's closure
        (the IPEP object that is the functions "value") points us to the
        Environment object that the function should use for non-local
        references.
        */
        this.evaluateApply = function (tree) {
            //throw EvalError
            // Evaluate the apply's first parameter to a function value,
            /*1*/
            var funValue = this.evaluateExp(tree.getSubTree(0));

            // check that what we are applying really is a function,
            if (!(funValue.tag === funValue.LAMBDA_TAG)) {
                //runtime check
                throw new EvalError("bad function value: " + tree);
            }


            // get a reference to the function's  closure
            var ipep = funValue.valueL; /*** Language_8 change (1) ***/
            // and to the function's "lambda expression" and its "nesting link".
            var lambda = ipep.ip; /*** Language_8 change (2) ***/
            var ep = ipep.ep; /*** Language_8 change (3) ***/

            // Check that the number of actual parameters
            // is equal to the number of formal parameters.
            // (Actually, all we really need to know is that
            // the number of actual parameters is at least
            // the number of formal parameters.)

            if (tree.degree() !== lambda.degree()) {
                //runtime check

                throw new Evalerror("wrong number of parameters: " + tree);
            }

            // Create a new environment object that is "nested"
            // in this function's outer environment (lexical scope).
            // This environment is used to bind actual parameter
            // values to formal paramter names.
            /*2*/
            var localEnv = new Environment(scope, ep, "Function Activation");
            //emit "envStackPush" event
            //I might need to create a new event emitter named envStackPushFun
            //with a reference to the enclosing ep.id
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                        'epId': ep.id, //added a link to the environment pointer's id for drawing Bezier curves.
                    }
            });

            // Bind, in the new environment object, the actual parameter
            // values to the formal parameter names.
            /*3*/
            for (var zz = 1; zz < tree.degree() ; zz++) {
                // iterate through the actual parameters

                // Evaluate, using the current environment chain
                // (NOT the new local environment object)
                // an actual parameter expression's value.
                /*4*/
                var actualParamValue = this.evaluateExp(tree.getSubTree(zz));

                // Retrieve, from within the lambda expression,
                // a formal parameter name.
                /*5*/
                var formalParamName = lambda.getSubTree(zz - 1).element;
                //emit a "nodeTraversal" event
                scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': lambda.getSubTree(zz - 1).numId,
                            'color': traverseColor,
                            'node': formalParamName,
                        },
                });
                //console.log("Formal name : " + formalParamName);

                // Bind, in the new local environment object, the actual
                // paramter value to a formal parameter name.
                /*6*/
                localEnv.add(formalParamName, actualParamValue);
                //emit "envAdd" event; I don't believe we need an event emitter here

            }
            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + localEnv + "</pre>";// for debugging purposes
            }

            // Evaluate the body of the lambda expression using the
            // new environment (which contains the binding of the actual
            // parameter values to the function's formal parameter names).
            /*7*/
            var originalEnv = this.env;
            //ask Professor Kraft to draw a diagram of this code behavior on paper.
            /*8*/
            this.env = localEnv;

            /*9*/
            var result = this.evaluateExp(lambda.getSubTree(tree.degree() - 1));

            // Finally, restore the environment chain.
            /*10*/
            this.env = originalEnv;
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': localEnv.id,
                        'label': localEnv.label,
                        'closure': result.tag === 'lambda',
                        'epId': result.tag === 'lambda' ? ep.id : null,
                    }
            });
            // emit "envRemove" event?

            return result;
        



        }//evaluateApply()


        //Evaluate an if-expression
        this.evaluateIf = function (tree) {


            if (3 !== tree.degree()) {
                //runtime check
                throw new EvalError("incorrect conditional expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            if (conditionalExp.valueB) {

                result = this.evaluateExp(tree.getSubTree(1));
            }
            else {

                result = this.evaluateExp(tree.getSubTree(2));
            }

            return result;
        }//evaluateIf()

        //Evalaute a while-loop expression
        this.evaluateWhile = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                throw new EvalError("incorrect while expression: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //evaluate the boolean condition
            var conditionalExp = this.evaluateExp(tree.getSubTree(0));

            //do a runtime type check
            if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                throw new EvalError("illegal boolean expression: " + tree);
            }

            while (conditionalExp.valueB) {
                //evaluate the body of the loop (for its side effects)
                this.evaluateExp(tree.getSubTree(1));
                // re-evaluate the boolean condition
                conditionalExp = this.evaluateExp(tree.getSubTree(0));
                //do a runtime type check
                if (!(conditionalExp.tag === conditionalExp.BOOL_TAG)) {
                    throw new EvalError("illegal boolean expression: " + tree);
                }
            }

            // always return false for a while-loop expression
            result = new Value(false);

            return result;
        }//evaluateWhile()

        // Evaluate a set expression
        this.evaluateSet = function (tree) {
            //throws EvalError

            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            //emit an "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                        data: {
                            'id': tree.getSubTree(0).numId,
                            'color': traverseColor,
                            'node': variable,
                        },
            });
            // check if this variable has already been declared
            if (!this.env.defined(variable, true)) {
                //runtime check
                throw new EvalError("undefined variable: " + variable);
            }

            // get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);
            // update this variable in the environment
            this.env.update(variable, result);

            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + this.env + "</pre>"; // for debugging purposes
            }

            return result;
        }

        this.evaluateBegin = function (tree) {

            //var result := Value
            var result = null;

            // Create a new Environment object chained to (or "nested in")
            // the previous (:outer") environment object.
            var previousEnv = this.env;
            this.env = new Environment(scope, previousEnv, "Local (begin)");
            scope.main.addAnimationData({'name': "envStackPush",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                        'epId': previousEnv.id,
                    }
            });

            // Evaluate each sub expression in the begin
            // expression (using the new environment chain).
            // The return value of each expression is
            // discarded, so any expression without a
            // side-effect is worthless.
            for (var i = 0; i < tree.degree() - 1; i++) {
                this.evaluateExp(tree.getSubTree(i));
            }

            // Evaluate the last expression and use its
            // value as the value of the begin expression.
            result = this.evaluateExp(tree.getSubTree(tree.degree() - 1));
            
            scope.main.addAnimationData({'name': "envStackPop",
                    data: {
                        'id': self.env.id,
                        'label': self.env.label,
                        'closure': result.tag === 'lambda',
                        'epId': result.tag === 'lambda' ? previousEnv.id : null,
                    }
            });

            this.env = previousEnv;  // Just before this method returns, we remove from the
            // chain of Environment objects the local Environment
            // object we created at the beginning of this method.
            // The local Environment object becomes a garbage object,
            
            return result;

        }//evaluateBegin()

        //Evaluate a var expression
        this.evaluateVar = function (tree) {
            //throws EvalError

            if (2 !== tree.degree()) {
                //runtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            //var result := Value
            var result = null;

            //get the variable
            var variable = tree.getSubTree(0).element;
            // emit "nodeTraversal" event
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.getSubTree(0).numId,
                        'color': traverseColor,
                        'node': variable,
                    },
            });

            //check if this variable has already been declared
            //in the local environment
            if (this.env.definedLocal(variable)) {
                //runtime check
                throw new EvalError("variable already declared: " + variable + "\n");
            }

            //get, and then evaluate, the expression
            var expr = tree.getSubTree(1);
            result = this.evaluateExp(expr);

            // declare the new, local, variable
            this.env.add(variable, result);

            if (this.DEBUG > 0) {
                //for debugging purposes
                document.body.innerHTML += "<pre>" + this.env + "</pre>";
            }

            return result;
        }//evaluateVar()

        //Evaluate a print expression
        this.evaluatePrint = function (tree) {
            //throws EvakError

            if (1 != tree.degree()) {
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = this.evaluateExp(tree.getSubTree(0));

            //print the expression on the console.
            console.log("The printed result is" + result);

            return result;
        }//evalautePrint()

        //Evaluate a boolean expression
        this.evaluateBexp = function (tree) {
            //throws EvalError



            var result = false;
            var node = tree.element;


            var value = this.evaluateExp(tree.getSubTree(0));

            if (!(value.tag === value.BOOL_TAG)) {
                //runtime check
                throw new EvalError("not a boolean expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            result = value.valueB;

            if (node === "&&") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var xyz = 1; xyz < tree.degree() ; xyz++) {
                    if (result) {
                        value = this.evaluateExp(tree.getSubTree(xyz));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                                + tree.getSubTree(xyz) + "\n");
                        }
                        result = result && value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "&&"
                        result = false;
                        break;
                    }
                }
            }
            else if (node === "||") {
                if (2 > tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                for (var x = 1; x < tree.degree() ; x++) {
                    if (!result) {
                        value = this.evaluateExp(tree.getSubTree(x));
                        if (!(value.tag === value.BOOL_TAG)) {
                            //runtime check
                            throw new EvalError("not a boolean expression: "
                                            + tree.getSubTree(i) + "\n");
                        }
                        result = result || value.valueB;
                    }
                    else {
                        //short circuit the evaluation of "||"
                        result = true;
                        break;
                    }
                }
            }
            else if (node === "!") {
                if (1 != tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = !result;
            }

            return new Value(result);
        }//evaluateBexp()

        // Evaluate a relational expression (which is a kind of boolean expression)
        this.evaluateRexp = function (tree) {


            if (2 != tree.degree()) {
                //rumtime check
                throw new EvalError("wrong number of arguments: " + tree + "\n");
            }

            var result = false;

            var opStr = tree.element;
            //emit a "nodeTraversal" event
            //the event code is further down in the function definition

            var valueL = this.evaluateExp(tree.getSubTree(0));

            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }

            var valueR = this.evaluateExp(tree.getSubTree(1));
            if (!(valueR.tag === valueR.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
            }

            var resultL = valueL.valueI;
            var resultR = valueR.valueI;

            if (opStr === "<") {
                result = resultL < resultR;
            }
            else if (opStr === ">") {
                result = resultL > resultR;
            }
            else if (opStr === "<=") {
                result = resultL <= resultR;
            }
            else if (opStr === ">=") {
                result = resultL >= resultR;
            }
            else if (opStr === "==") {
                result = resultL == resultR;
            }
            else if (opStr === "!=") {
                result = resultL != resultR;
            }

            //emit a "nodeTraversal" event: tree.element == relational operator
            var colorCode = "#ff0000"; //red color; code from http://html-color-codes.info/
            if (result) {
                //Color code from http://color.adobe.com
                colorCode = "#87ff1d"; //green
            }
            scope.main.addAnimationData({'name': "nodeTraversal",
                    data: {
                        'id': tree.numId,
                        'color': colorCode,
                        'node' : opStr,
                    },
            });
            
            //if var result == T => highlight tree.element green, else highlight it red.
            //see the code in Evaluate.js of Language_6 for more info.
            return new Value(result);
        }//evaluateRexp()

        // Evaluate an arithmetic expression
        this.evaluateAexp = function (tree) {
            //throws EvalError


            var result = 0;
            var node = tree.element;
            //do not emit a "nodeTraversal" event since we
            //already did so in the evaluateExp function
            

            var valueL = this.evaluateExp(tree.getSubTree(0));
            if (!(valueL.tag === valueL.INT_TAG)) {
                //runtime check
                throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(0) + "\n");
            }
            var resultL = valueL.valueI;
            var resultR = 0;

            var valueR = null;
            if (tree.degree() >= 2) {
                valueR = this.evaluateExp(tree.getSubTree(1));
                if (!(valueR.tag === valueR.INT_TAG)) {
                    //runtime check
                    throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(1) + "\n");
                }
                resultR = valueR.valueI;
            }

            if (node === "+") {
                if (tree.degree() === 1) {
                    result = resultL;
                }
                else {
                    result = resultL + resultR;

                    for (var z = 2; z < tree.degree() ; z++) {
                        //temp := Value
                        var temp = this.evaluateExp(tree.getSubTree(z));
                        if (!(temp.tag === temp.INT_TAG)) {
                            //runtime check
                            throw new EvalError("not a integer expression: "
                                    + tree.getSubTree(z) + "\n");
                        }
                        result += temp.valueI;
                    }
                }
            }
            else if (node === "-") {
                if (2 < tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                if (tree.degree() === 1) {
                    result = -resultL;
                }
                else {
                    result = resultL - resultR;
                }
            }
            else if (node === "*") {
                if (1 === tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }

                result = resultL * resultR;

                for (var a = 2; a < tree.degree() ; a++) {
                    var temp = this.evaluateExp(tree.getSubTree(a));
                    if (!(temp.tag === temp.INT_TAG)) {
                        //runtime check
                        throw new EvalError("not a integer expression: "
                                            + tree.getSubTree(a) + "\n");
                    }
                    result *= temp.valueI;
                }
            }
            else if (node === "/") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL / resultR;
            }
            else if (node === "%") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = resultL % resultR;
            }
            else if (node === "^") {
                if (2 !== tree.degree()) {
                    //runtime check
                    throw new EvalError("wrong number of arguments: " + tree + "\n");
                }
                result = Math.floor(Math.pow(resultL, resultR));
            }

            return new Value(result);
        }//evaluateAexp()
    }

    return {
            "Evaluate": Evaluate
        };

    }]);
    

})();

(function(){
    'use strict';
    
    angular.module('astInterpreter')
        .factory('l9.IPEPFactory', function(){
            
            /*
                Construct a IPEP object
            */
            function IPEP(tree, env) {
                this.ip = tree; // the ip, the "instruction pointer"
                this.ep = env;  // the ep, the "environment pointer"
            }
            
            return{
                'IPEP': IPEP,
            }
            
        });
})();

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

/**
   This program parses a token stream for the following grammar
   and builds an Abstract Syntax Tree (AST).

       Prog ::= Exp
              | '(' 'prog' Exp+ Exp ')'

        Exp ::= Fun
              | Lambda
              | Apply
              | If
              | While
              | Set
              | Var
              | Begin
              | Print
              | AExp
              | BExp
              | INTEGER
              | BOOLEAN
              | VARIABLE

        Fun ::= '(' 'fun' VARIABLE Lambda ')'   // a function declaration

     Lambda ::= '(' 'lambda' VARIABLE* Exp ')'  // formal parameters followed by function body

      Apply ::= '(' 'apply' Exp Exp* ')'        // function value followed by actual parameters

         If ::= '(' 'if' Exp Exp Exp ')'

      While ::= '(' 'while' Exp Exp ')'

        Set ::= '(' 'set' VARIABLE Exp ')'

        Var ::= '(' 'var' VARIABLE Exp ')'

      Begin ::= '(' 'begin' Exp+ Exp ')'

      Print ::= '(' 'print' Exp ')'

       BExp ::= '(' '||'  Exp Exp+ ')'
              | '(' '&&'  Exp Exp+ ')'
              | '(' '!'   Exp ')'
              | '(' RelOp Exp Exp ')'
              | '('  EqOp Exp Exp ')'

      RelOp ::= '<' | '>' | '<=' | '>='
       EqOp ::= '==' | '!='

       AExp ::= '(' '+' Exp Exp* ')'
              | '(' '-' Exp Exp? ')'
              | '(' '*' Exp Exp+ ')'
              | '(' '/' Exp Exp  ')'
              | '(' '%' Exp Exp  ')'
              | '(' '^' Exp Exp  ')'

    INTEGER ::= [-][0-9]+
    BOOLEAN ::= 'true' | 'false'
   VARIABLE ::= [a-zA-Z][a-zA-Z0-9]*
*/


(function(){
    'use strict';
    //TODO: turn the parser into an object!!
    angular
        .module('astInterpreter')
        .factory('l9.parserFactory', ['l9.tokenizerFactory', 'l9.treeFactory', 'l9.parseErrorFactory', function(tokenizerFactory, treeFactory, parseFactory){
            console.log('Parser loaded in angular');
            
            var Tokenizer = tokenizerFactory.Tokenizer;
        
            var Tree = treeFactory.Tree;
            
            var ParseError = parseFactory.ParseError;
            
            function Parser() {
                this.counter = 0;
                
                this.parse = function (expStr) {
                    //throws PraseError
                    
                    
                    var tokens = new Tokenizer(expStr); // Tokenizer is defined
                                                        // in Tokenizer.js
                    console.log("Lang 9 token stream:");
                    console.log(tokens._tokens);
                    var result = this.getProg(tokens); // parse the token stream
                    
                    if (tokens.hasToken()) {
                        throw new ParseError("unexpected input: " + tokens.peekToken() + "\n" + tokens + "\n");
                    }
            
                    return result;
        
        
                }//parse()

            //Parse a prog
            this.getProg = function (tokens) {
                
        
                var result = null;
        
                // Check whick kind of Prog we have.
                if (! (tokens.has2Token() && (tokens.peek2Token() === "prog")) ) {
                    // Evaluate the single expression.
                    result = this.getExp(tokens);
                }
                else {
                    tokens.match("(");
        
                    if (!tokens.match("prog")) {
                        throw new ParseError("expected 'prog': " + tokens);
                    }
        
                    result = new Tree("prog");
                    result.numId = this.counter;
                    this.counter++;
        
                    // Parse each Exp in the Prog.
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        
                            result.addSubTree(this.getExp(tokens));
                    }
        
                    if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                        console.log("called from getProg");
                        throw new ParseError("expected ')': " + tokens);
                    }
                }
        
                return result;
            }//getProg()

            // Parse a function definition.
            this.getFun = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("fun")) {
                    throw new ParseError("expected 'fun': " + tokens);
                }
        
                var result = new Tree("fun");
                result.numId = this.counter++;
        
                // parse the function name
                if (tokens.hasToken()) {
                    //this may be a source of bugs 10/22/16
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = this.counter++;
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected function name: " + tokens);
                }
        
                // parse the lambda expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getLambda(tokens));
                }
                else {
                    throw new ParseError("expected lambda expression: " + tokens);
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from this.getFun");
                    throw new ParseError("expected ')': " + tokens);
                }
                return result;
            }//getFun()

            // Parse a lambda expression
            this.getLambda = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("lambda")) {
                    throw new ParseError("expected 'lambda': " + tokens);
                }
        
                var result = new Tree("lambda");
                result.numId = this.counter++;
        
                // this is not really correct since we are not distinguishing
                // between the formal parameters and the function body
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(this.getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from this.getLambda");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getLambda()
        
            // Parse an expression
            this.getExp = function (tokens) {
                //throws ParseError
        
                var result = null;
        
                var tk = tokens.peekToken();
        
                if (tk === "(") {
                    if (tokens.has2Token()) {
                        tk = tokens.peek2Token();
                    }
                    else {
                        throw new ParseError("expected an expression: " + tokens);
                    }
        
                    if (tk === "fun") {
                        result = this.getFun(tokens);
                    }
                    else if (tk === "lambda") {
                        result = this.getLambda(tokens);
                    }
                    else if (tk === "apply") {
                        result = this.getApply(tokens);
                    }
                    else if (tk === "if") {
                        result = this.getIf(tokens);
                    }
                    else if (tk === "while") {
                        result = this.getWhile(tokens);
                    }
                    else if (tk === "set") {
                        result = this.getSet(tokens);
                    }
                    else if (tk === "var") {
                        result = this.getVar(tokens);
                    }
                    else if (tk === "begin") {
                        result = this.getBegin(tokens);
                    }
                    else if (tk === "print") {
                        result = this.getPrint(tokens);
                    }
                    else if ( (tk === "&&") || (tk === "||")
                           || (tk === "!")) {
                        result = this.getBexp(tokens); //boolean expression
                    }
                    else if ( (tk === "<")  || (tk === ">")
                           || (tk === "<=") || (tk === ">=")
                           || (tk === "==") || (tk == "!=") ) {
                        result = this.getRexp(tokens); //relational expression
                    }
                    else if ((tk === "+") || (tk === "-")
                           || (tk === "*") || (tk === "/")
                           || (tk === "%") || (tk == "^")) {
                        result = this.getAexp(tokens); //arithmetic expression
                    }
                    else {
                        throw new ParseError("unexpected expression: " + tk);
                    }
                }
                else {
                    result = new Tree(tokens.nextToken());
                    result.numId = this.counter++;
                }
        
                return result;
            }//getExp()
        
            // Parse a function application.
            this.getApply = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("apply")) {
                    throw new ParseError("expected 'apply': " + tokens);
                }
        
                var result = new Tree("apply");
                result.numId = this.counter++;
        
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(this.getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from this.getApply");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getApply()
        
            // Parse an if-expression
            this.getIf = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("if")) {
                    throw new ParseError("expected 'if': " + tokens);
                }
        
                var result = new Tree("if");
                result.numId = this.counter++;
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected conditional expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected then expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected else expression: " + tokens);
                }
                console.log("about to call the problem" + tokens.peekToken());
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getIf");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getIf()
        
            // Parse a while-loop expression
            this.getWhile = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("while")) {
                    throw new ParseError("expected 'while': " + tokens);
                }
        
                var result = new Tree("while");
                result.numId = this.counter++;
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected conditional expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected loop body: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getWhile");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getWhile()
        
            // Parse a set expression
            this.getSet = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("set")) {
                    throw new ParseError("expected 'set': " + tokens);
                }
        
                var result = new Tree("set");
                result.numId = this.counter++;
        
                // parse the variable
                if (tokens.hasToken()) {
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = this.counter++;
                    
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected variable name: " + tokens);
                }
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected variable value: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getSet");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getSet()
        
            // Parse a var expression
            this.getVar = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("var")) {
                    throw new ParseError("expected 'var': " + tokens);
                }
        
                var result = new Tree("var");
                result.numId = this.counter++;
        
                // parse the variable
                if (tokens.hasToken()) {
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = this.counter++;
                    
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected variable name: " + tokens);
                }
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected variable value: " + tokens);
                }
                
                if (!(  tokens.hasToken()  &&  tokens.match(")"))) {
                    //console.log("called from this.getVarrr");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getVar()
        
            // Parse a begin expression
            this.getBegin = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("begin")) {
                    throw new ParseError("expected 'begin': " + tokens);
                }
        
                var result = new Tree("begin");
                result.numId = this.counter++;
        
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(this.getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from begin");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//this.getBegin()
        
            // Parse a print expression
            this.getPrint = function(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("print")) {
                    throw new ParseError("expected 'print': " + tokens);
                }
        
                var result = new Tree("print");
                result.numId = this.counter++;
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected print's expression: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getPrint");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getPrint()
        
            this.getBexp = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = this.counter++;
        
                if ((tk === "&&") || (tk === "||")) {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse the second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(this.getExp(tokens));
                    }
                }
                else if (tk === "!") {
                    //parse the expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected !'s operand: " + tokens);
                    }
                }
                else {
                    // shouldn't get here
                    throw new ParseError("unexpected boolean operator: " + tk);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getBexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getBexp()
        
            // Parse a relational expression (which is a kind of boolean expression)
            this.getRexp = function (tokens) {
                //throws ParseError
        
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = this.counter++;
        
                //parse the first expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                }
        
                //parse the second expression
                if (tokens.hasToken()) {
                    result.addSubTree(this.getExp(tokens));
                }
                else {
                    throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getRexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getRexp()
        
            // Parse an arithmetic expression
            this.getAexp = function (tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = this.counter++;
        
                if (tk === "+") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(this.getExp(tokens));
                    }
                }
                else if (tk === "-") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
                }
                else if (tk === "*") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(this.getExp(tokens));
                    }
                }
                else if ((tk === "/") || (tk === "%") || (tk === "^")) {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(this.getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
                }
                else {
                    // shouldn't get here
                    throw new ParseError("expected arithmetic operator: " + tk);
                }
        
        
                //Note: some the the logical expressions (like the one below) are different from the
                //way Prof. Kraft wrote them. Proof by truth table 
                //shows them to be logically equivalent
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from this.getAexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getAexp()
        }
            
            
            
            
    
            return {
                'Parser': Parser,
            };
    }]);
})();

(function(){
//this factory needs a strong unit test!!
'use strict';
angular
        .module('astInterpreter')
        .factory('l9.prettyPrinterFactory', function () {
            
            var counter = 0;

            function prettyPrint2(formatting, tree) {
                var result = "";

                if (tree.depth() === 0) {
                    return formatting + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                }
                else if (tree.depth() === 1) {
                    result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                    for (var i = 0; i < tree.degree() - 1; i++) {
                        result += prettyPrint2(" ", tree.getSubTree(i));
                    }
                    result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                    return result;
                }
                else if (tree.depth() > 1) {
                    if(tree.element === "prog" ||
                        tree.element === "begin") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var x = 0; x < tree.degree() ; x++) {
                            result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(x));
                        }
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "print") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var y = 0; y < tree.degree() - 1; y++) {
                            result += prettyPrint2(" ", tree.getSubTree(y));
                        }
                        result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                        return result;
                    }
                    else if (tree.element === "if") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(1));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(2));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "while") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "        ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "fun") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "lambda") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var t = 0; t < tree.degree() - 1; t++) {
                            result += prettyPrint2(" ", tree.getSubTree(t));
                        }
                        result += "\n" + prettyPrint2(formatting + "    ", tree.getSubTree(tree.degree() - 1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element == "apply") {
                        if(tree.depth() <= 2) // changed from == 2 to <= 2 19/22/16
                        {
                            result +=  formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var c = 0; c < tree.degree() ; c++) {
                                result += prettyPrint2(" ", tree.getSubTree(c));
                            }
                            return result + " )";
                        }
                        else //tree.depth > 2
                        {
                            //TODO: Implement this feature
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var app = 0; app < tree.degree() ; app++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(app));
                            }

                            return result + "\n" + formatting + ")";
                        }
                    }
                    else if(tree.element === "var" ||
                            tree.element === "set") {
                        if (tree.depth() === 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += prettyPrint2(" ", tree.getSubTree(1)) + " )";
                            return result;
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                            return result + "\n" + formatting + ")";

                        }
                    }
                    else if(tree.element === "+"  ||
                            tree.element === "-"  ||
                            tree.element === "*"  ||
                            tree.element === "/"  ||
                            tree.element === "^"  ||
                            tree.element === "%"  ||
                            tree.element === "--" ||
                            tree.element === "++" ||
                            tree.element === "||" ||
                            tree.element === "!=" ||
                            tree.element === "&&" ||
                            tree.element === "==" ||
                            tree.element === "<"  ||
                            tree.element === "<=" ||
                            tree.element === ">"  ||
                            tree.element === ">=" ){
                        if (tree.depth() > 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var z = 0; z < tree.degree() ; z++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(z));
                            }
                            return result + "\n" + formatting + ")";
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var q = 0; q < tree.degree() - 1; q++) {
                                result += prettyPrint2(" ", tree.getSubTree(q));
                            }
                            result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                            return result;
                        }
                    }
                }

                // Make sure this is never reached!
                //If this section of code is reached
                //there is a keyword in the program not accounted for
                //in this prettyprinter
                return "Needs to be Implemented 2";

            }

            function prettyPrint(tree) {
                var result = prettyPrint2("", tree);
                //console.log("Printing from prettyPrintFactory");
                //console.log(result);
                counter = 0; //reset the counter for proper highlighting of nodes
                return result;
            }

            return {
                'prettyPrint': prettyPrint
            }
        });
        
})();

(function () {
   "use strict"; 
   angular.module('astInterpreter')
        .factory('l9.tokenizerFactory', function () {
           

            function Tokenizer(str) {

            //Code is based off C code snippets from the following book:
            //Sebesta, Robert W. Concepts of programming languages. Boston: Pearson, 2016. Print.
            //See pages 163-171

            this._DIGIT = 1;//make const in ES6
            this._LETTER = 0;
            this._UNKNOWN = 99;
            this._WHITESPACE = 101;
            this._EQOP = 102; //since equality is a double-character operand it needs to be handled seperately
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
                     else if(this._currentChar.match(/=/)){
                        this._charClass = this._EQOP;
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

                        case this._EQOP:
                            this._addChar();
                            this._getChar();
                            while(this._charClass == this._EQOP){
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

                        //Parentheses and single-character operands
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
			
			/*
            * Returns false if all, or all but one, of the tokens have been "consumed".
            */  
            this.has2Token = function () {
               return (this._currentToken < this._tokens.length - 1);
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

(function () {
   "use strict"; 

   angular.module('astInterpreter')
   .factory('l9.treeFactory', function(){
       
       function Tree(element) {
            this.element = element;
            this.subTrees = [];

            for(var x = 1; x < arguments.length; x++) {
                if (arguments[x] !== null) {
                    this.subTrees.push(arguments[x]);
                }

            }
            this.addSubTree = function(tree) {
                this.subTrees.push(tree);
            }
            this.getSubTree = function(index) {
                return this.subTrees[index];
            }

            this.degree = function() {
                return this.subTrees.length;
            }
            this.depth = function() {
                var result = 0;
                if (this.degree() > 0) {
                    var max = 0;
                    for(var y = 0; y < this.degree(); y++) {

                        var temp = this.getSubTree(y).depth();
                        if (temp > max) {
                            max = temp;
                        }
                    }
                    result = 1 + max;
                }
                return result;
            }

            this.toString = function() {
                var result = "";
                if (this.subTrees == []) {
                    result += element;
                }
                else {
                    result += "(" + this.element;
                    for(var z = 0; z < this.subTrees.length; z++) {
                        result += " " + this.subTrees[z];
                    }
                    result += ")";
                }
                return result;
            }

        }

        return {
            "Tree": Tree
        };

    });

})();


(function(){
    "use strict";

    angular.module('astInterpreter')
        .factory('l9.valueFactory', function () {
            


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
                        //This means value is an IPEP
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

(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTree', ['tokenizerFactory', 'buildTreeFactory', function(){
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(tokenizerFactory, buildTreeFactory){
                                    var Tokenizer = tokenizerFactory.Tokenizer;
                                    var BuildTree = buildTreeFactory.BuildTree;
                                    
                                    this.createTree = function(tkStr){
                                        var t = new Tokenizer(tkStr);
                                        var b = new BuildTree(t);
                                        return b.getTree();
                                    }
                                },
                                require: 'buildTree',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        scope.main.setAST(buildTreeController.createTree(newContent));
                                        
                                    });
                                }
                            };
            }]);
            
})();



 (function(){
     'use strict';
    angular
        .module('astInterpreter')
        .directive('animationButton', function(){
            return {
              restrict: 'E',
              replace: true,
              template: '<button id="advance" class="btn btn-primary" ng-click="main.incrementIndex()">Advance</button>',
            };
        });
    
})();   
    

(function(){
    //this code is no longer used in production; remove whenever
    angular
        .module('astInterpreter')
        .directive('envStack', function(){
                return {
                    'restrict': 'E',
                    'replace': true,
                    'template': '<div id="envBase"></div>',
                    'link': function(scope, element, attrs ){
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                d3.select("#envBase").selectAll("div").remove(); //reset the env Stack on click of the Visualize data button
                            }
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            if (currentData.name === "envStackPush") {
                                
                                var envStack = d3.select("#envBase");
                                envStack
                                    .append("div")
                                    .attr("id", "env" + currentData.data.id)
                                    .attr("class", "alert alert-info")
                                    .text(currentData.data.label);
                            }
                            
                            else if (currentData.name === "envAdd") {
                                console.log("#env" + currentData.data.id);
                                var envStack = d3.select("#env" + currentData.data.id);
                                envStack
                                    .append("p")
                                    .attr("class", "envVar")
                                    .text(currentData.data.value);
                            }
                            else if (currentData.name === "envSearch") {
                                d3.selectAll(".envVar").style("color", "#fff"); //color all nodes black to remove previous formatting
                                var envStack = d3.select("#env" + currentData.data.id);
                                console.log(envStack);
                                envStack
                                    .select("p:nth-child(" + currentData.data.childRank + ")")
                                    .style("color", currentData.data.color);
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                d3.selectAll(".envVar").style("color", "#fff"); //color all nodes white to remove previous formatting
                                var envStack = d3.select("#env" + currentData.data.id);
                                console.log(envStack);
                                envStack
                                    .select("p:nth-child(" + currentData.data.childRank + ")")
                                    .style("color", currentData.data.color)
                                    .text(currentData.data.value);
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                var envStack = d3.select("#env" + currentData.data.id);
                                console.log(envStack);
                                envStack.remove();
                            }
                        });
                    }
                }
        });
    
})();


(function(){
    'use strict';
    angular
        .module('astInterpreter')
        .directive('envSvg', function(){
                return {
                    'restrict': 'E',
                    'replace': true,
                    'template': '<div id="envBase" class="envBase-l0-l9"><svg id="sBase" viewBox="0 0 150 300"></svg></div>',
                    'link': function(scope, element, attrs ){
                        
                        var envCount = 0;
                        var totalHeight = 0;
                        var emptyEnv = 30; //height of an empty env
                        var xWidth = 150; //width of a single env
                        var xMargin = 10;
                        var yMargin = 10; //bottom y Margin
                        var varAddedHeight = 25; //extention of the length of an environment when a new variable is pushed to it.
                        
                        function pushTriangles(currentEnv, count) {
                            while (currentEnv < count) {
                                console.log(currentEnv);
                                var oldHeight = Snap('#pointer' + currentEnv).transform();
                                Snap('#pointer' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        function pushEnvs(currentEnv, count) {
                            while (currentEnv <= count) {
                                //console.log(currentEnv);
                                var oldHeight = Snap('#env' + currentEnv).transform();
                                Snap('#env' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                Snap("#sBase").paper.clear(); //reset the env Stack on click of the Visualize data button
                                //console.log(envCount);
                                envCount = 0;
                                totalHeight = 0;
                            }
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            if (currentData.name === "envStackPush") {
                                
                                envCount++;
                                
                                var classNum = envCount % 2; //which color the div is
                                console.log(totalHeight);
                                Snap('#sBase')
                                    .group()
                                    .attr('id', 'env' + currentData.data.id)
                                    .attr('transform', 'translate( 0 ' + totalHeight + ' )')
                                    .rect(0, 0, xWidth, emptyEnv)
                                    .addClass('color' + classNum)
                                    .attr('id', 'rect' + currentData.data.id);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xWidth / 2, 15, currentData.data.label)
                                    .attr({         //^ this is how far down from the top of the environment we want the name to be.
                                        "text-anchor": 'middle',
                                        'dy': '.35em',
                                    });
                                    
                                    
                                Snap('#env' + currentData.data.id)
                                    .line(xMargin, 22, xWidth - xMargin, 22)
                                    .attr({
                                        stroke: '#000',
                                        strokeWidth: 1,
                                    });
                                    
                                    
                                totalHeight += emptyEnv;
                                  console.log(totalHeight);  
                                if (envCount > 1) {
                                    //add the triangular pointer between envs
                                    console.log("Current data id and total height, respectively:")
                                    console.log(currentData.data.id);
                                    console.log(totalHeight);
                                    Snap('#sBase' )
                                        .group()
                                        .polygon(65, 0 , 75, 7.5, 85, 0)
                                        .addClass('color' + ((envCount - 1) % 2))
                                        .attr('id', 'pointer' + (currentData.data.id - 1))
                                        .attr('transform', 'translate( 0 ' + ( totalHeight - Snap('#rect' + (currentData.data.id)).attr('height') - 1 ) + ')')
                                        
                                }
                                       
                                
                            }
                            
                            else if (currentData.name === "envAdd") {
                                
                                
                                var currentHeight = parseInt(Snap('#rect' + currentData.data.id).attr('height'), 10);
                                //console.log('The current height of the previous rect is');                   // ^ base to convert numbers to.  
                                //console.log(currentHeight);
                                var newHeight = currentHeight + varAddedHeight;
                                Snap('#rect' + currentData.data.id)
                                    .attr('height', newHeight);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xMargin, newHeight - yMargin, currentData.data.value)
                                    .addClass('envVar')
                                    .attr({
                                        'dy': '.35em',
                                    });
                                
                                totalHeight += varAddedHeight;
                                pushEnvs(currentData.data.id + 1, envCount);
                                pushTriangles(currentData.data.id, envCount);
                                console.log(totalHeight);
                            }
                            else if (currentData.name === "envSearch") {
                                
                                
                                //thanks to this SO answer for explaining how hth-child works: http://stackoverflow.com/a/29278310
                                //Original Poster (OP): http://stackoverflow.com/questions/29278107/d3js-how-to-select-nth-element-of-a-group
                                Snap('.envVar')
                                    .attr({
                                        'stroke': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').attr({'stroke': currentData.data.color});
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                
                                Snap('.envVar')
                                    .attr({
                                        'stroke': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                
                                //don't know of a way to set the innerSVG of an SVG element using Snap.svg
                                d3.select('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').text(currentData.data.value);
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')')
                                    .attr({
                                        'stroke': currentData.data.color,
                                    });
                                
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                //var envStack = d3.select("#env" + currentData.data.id);
                                //console.log(envStack);
                                //envStack.remove();
                                Snap('#env' + currentData.data.id).remove();
                                Snap('#pointer' + (currentData.data.id - 1)).remove();
                                envCount--;
                            }
                        });
                    }
                }
        });
    
})();

(function(){
    
angular
    .module('astInterpreter')
    .directive('evaluate', ['evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
              console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST();
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast)); // set up a directive for displaying output of the program
                    console.log(scope.main.getAnimationData());
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();


(function(){
    'use strict';

    /*
        4.a 
            This AST directive watches the 'data' attribute for changes
            and then transforms our AST into a format that D3 can understand.
            Once transformed, the AST is nicely displayed via the capabilities of D3. 
            This directive also handles highlighting the various nodes of the AST as they 
            are traversed by the interpreter. This is the final stage of this branch in the 
            data pipeline. Please return to the previous stage (3.a) for details on viewing the 
            other branch in the pipeline.
     */

angular
    .module('astInterpreter')
    .directive('d3AstL0', /*Inject dependencies here*/ ['ast2JsonFactory',
        function( ast2JsonFactory){
        return {
            restrict: 'E',
            replace: true,
            template: '<div id="ast" class="astLanguage-0"></div>',
            
            link: function(scope, element, attrs){

            //code for building the d3 tree comes from here: http://bl.ocks.org/robschmuecker/7880033
               
            /*Copyright (c) 2013-2016, Rob Schmuecker
            All rights reserved.
            
            Redistribution and use in source and binary forms, with or without
            modification, are permitted provided that the following conditions are met:
            
            * Redistributions of source code must retain the above copyright notice, this
              list of conditions and the following disclaimer.
            
            * Redistributions in binary form must reproduce the above copyright notice,
              this list of conditions and the following disclaimer in the documentation
              and/or other materials provided with the distribution.
            
            * The name Rob Schmuecker may not be used to endorse or promote products
              derived from this software without specific prior written permission.
            
            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
            AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
            IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
            DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
            INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
            BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
            DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
            OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
            NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
            EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
            
            //Modified by Daniel Boulos 8/30/16
                
                var ast;
                var root;
                
                attrs.$observe('data', function(newVal){
                    ast = scope.$eval(newVal);
                
                
                    
                    var hier = [];
                    i = 0;
                    hier.push(ast2JsonFactory.traverse(ast));
                    
                    d3.layout.hierarchy(hier[0]);
                    // ************** Generate the tree diagram	 *****************
                    
                    //the idea for clearing the <svg> container after
                    //each render comes from this blog post
                    // www.tivix.com/blog/data-viz-d3-and-angular
                    //baseSvg.selectAll("*").remove();
                    
                    
                    root = hier[0];
                    root.x0 = viewerHeight;
                    root.y0 = 0;
                    update(root); //the functions update and centerNode are declared below and are hoisted 
                    centerNode(root); // as per JS standards and are thus invocable from here.
                    
                    
                    
                });
                
                
                
        
                // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width() / 2;
    var viewerHeight = $(document).height();

    var tree = d3.layout.tree()
        .size([viewerWidth, viewerHeight ]);
        

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.x, d.y]; //swapped y and x
        });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    


    

    // Define the zoom function for the zoomable tree 

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);



    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#ast").append("svg")
        .attr('id', 'astSvg')   
        .attr("width", viewerWidth)
        .attr("height", "100%")// changed from viewerHeight
        .attr("class", "overlay")
        .call(zoomListener);


    

   // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        var scale = zoomListener.scale();
        var x = -source.y0; //swapped these two; should these be swapped?
        var y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 200; // still need to work on the proper spacing b/t nodes D.B 9/2/16
        
        // Call visit function to establish maxLabelLength
        visit(source, function(d) {
            totalNodes++;
            maxLabelLength = Math.max(d.name.length, maxLabelLength);
    
        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : null;
        });
        
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root), //might need to rm the reverse() call
            links = tree.links(nodes);
console.log(source);
        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = d.depth * 100;
            //d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
            //d.x = (d.depth * (maxLabelLength * 10));
        });

        // Update the nodes
        var node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

         //Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.x0 + "," + source.y0 + ")"; //try switching y0 and x0
            })
            /*.on('click', click)*/; //this click handler is disabled since it introduces bugs into my program
        
        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("y", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("y", function(d) { //changed x to y so the labels are above and below nodes
                return d.children || d._children ? -15 : 15;
            })
            //.attr("text-anchor", function(d) {
            //    return d.children || d._children ? "end" : "start";
            //})
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("id", function(d){
                return   "node" + (d.id - 1); 
            })
            .attr("r", 4.5) // add my node class so that the nodeTraversal works
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; //switching x and y allows for a vertical tree
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")"; //switching x and y allows for a vertical tree
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links�
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");
    //end copied code
                            
                
                    
                //handles animation of the generated ast diagram.

                scope.$watch("preOrder", function(){
                    d3.selectAll(".nodeCircle") //removes all previous 
                     .style("fill", "#fff"); //formatting by coloring all nodes white
                });
                
                scope.$watch("index", function(){
                 var currentData = scope.main.getCurrentAnimObject();
                 if(currentData.name === "nodeTraversal"){
                 
                   console.log(currentData); //change the class name Update
                   d3.selectAll(".nodeCircle") //removes all previous 
                     .style("fill", "#fff"); //formatting by coloring all nodes white
                     
                   d3.select("#" + "node" + currentData.data.id)
                     .style("fill", currentData.data.color);
                    
                 }
                }, true);
                
                scope.$watch("editing", function(newValue, oldValue){
                    if (scope.editing) {
                        
                        $(document).ready(function(){
                            d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              document.getElementById('editor').offsetWidth - 5);
                            
                        });
                    }
                    else{
                        $(document).ready(function(){
                            d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth);
                            
                        });
                        
                        
                    }
                });
                
                //cite this event handler code from  here: http://www.tivix.com/blog/data-viz-d3-and-angular/
                angular.element(window).on('resize', function(){
                    if (scope.editing) {
                        
                        d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              document.getElementById('editor').offsetWidth - 5);
                    }
                    else{
                        
                        d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth );
                       
                    }
                    
                });
                    
                },
        };
    }]);

})();




(function(){

    
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL0', [ 'l0.buildTreeFactory','tokenizerFactory', 'traverseFactory', 
                    function(buildTreeFactory, tokenizerFactory, traverseFactory ){
                        
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(){
                                    var Tokenizer = tokenizerFactory.Tokenizer;
                                    var BuildTree = buildTreeFactory.BuildTree;
                                    this.Traverse = traverseFactory.Traverse;
                                    
                                    this.createTree = function(tkStr){
                                        var t = new Tokenizer(tkStr);
                                        var b = new BuildTree(t);
                                        
                                        return b.getTreePreOrder();
                                    }
                                },
                                require: 'buildTreeL0',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        var ast = buildTreeController.createTree(newContent);

                                        var strResult;
                                        var Traverse =  buildTreeController.Traverse;
                                        var traverse = new Traverse(scope);

                                        if(!scope.preOrder){
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.postOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        else{
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.preOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        
                                        console.log(strResult);
                                        scope.main.setAST(ast);
                                        
                                    });

                                    attrs.$observe('ordering', function(){
                                        var ast = scope.main.getAST(); //note: the AST has not changed

                                        var strResult; 
                                        var Traverse =  buildTreeController.Traverse;
                                        var traverse = new Traverse(scope);

                                        if(!scope.preOrder){
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.postOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        else{
                                            scope.main.resetAnimationData();//clear out all previous animations
                                            strResult = traverse.preOrder(ast); //mutate the ast so that they are highlighted in post order
                                            console.log(ast);
                                        }
                                        
                                        console.log(strResult);
                                        
                                        scope.main.setAST(ast);
                                        
                                    });
                                }
                            };
            }]);
            
})();



(function(){

    /*
        3.a
            This directive watches the 'editorcontent' attribute
            for changes and then creates an AST from the code 
            editor's contents. The AST is made available to the 
            other components on the page via the 'data' attribute on the 
            d3-ast tag. The next two brnaching stages can be found here:

                app/ast/astDirective.js
                app/shared/directives/Language_8/evaluateDirective.js
     */
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL10', [ 'l10.buildTreeFactory', 'l10.tokenizerFactory', function(buildTreeFactory, tokenizerFactory){
                        
                        // console.log('Parser required');
                        
                        
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(){
                                    var Tokenizer = tokenizerFactory.Tokenizer;
                                    var BuildTree = buildTreeFactory.BuildTree;
                                    
                                    this.createTree = function(tkStr){
                                        var t = new Tokenizer(tkStr);
                                        var b = new BuildTree(t);
                                        
                                        
                                        return b.getTree();
                                    }
                                },
                                require: 'buildTreeL10',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        scope.main.setAST(buildTreeController.createTree(newContent));
                                        console.log(scope.main.getAST());
                                    });
                                }
                            };
            }]);
            
})();



(function(){
    'use strict';
    angular
        .module('astInterpreter')
        .directive('envSvgL10', function(){
                return {
                    'restrict': 'E',
                    'replace': true, 
                    'template': '<div id="envBase" class="envBase-l8"><svg id="sBase" viewBox="0 0 500 300" ><defs id="definitions"></defs></svg></div>',
                    'link': function(scope, element, attrs ){
                        
                        var envCount = 0;
                        var totalHeight = 0;
                        var emptyEnv = 30; //height of an empty env
                        var xWidth = 150; //width of all envs
                        var xMargin = 10;
                        var yMargin = 10; //bottom y Margin
                        var varAddedHeight = 25; //extention of the length of an environment when a new variable is pushed to it.
                        var closureCount = 0;
                        
                        
                        //Use this API to make moving svg env elements easier
                        
                        function getWidth() {
                            return xWidth;  // this is just a wrapper for xWidth
                        }
                        function getHeight(envId) {
                            return Number(d3.select('#rect' + envId).attr('height')); //note that this returns a String; can be coerced to a Number.
                                                                                 // 12/20/16: this caused errors so it is being cast as a Number explicitly.
                        }
                        
                        function getXLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.e;
                        }
                        
                        function getYLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.f;
                        }
                        
                        function setXLocation(envId, dx) {
                            Snap('#env' + envId).transform('translate(' + (getXLocation(envId) + dx) + ' '
                                                           + getYLocation(envId) + ')');
                        }
                        
                        function setYLocation(envId, dy) {
                            Snap('#env' + envId).transform('translate(' + getXLocation(envId) + ' '
                                                           + (getYLocation(envId) + dy) + ')');
                        }
                        
                        function setXYLocation(envId, dx, dy) {
                            setXLocation(envId, dx);
                            setYLocation(envId, dy);
                        }
                        
                        
                        
                        
                        
                        
                        function pushTriangles(currentEnv, count) {
                            while (currentEnv <= count) {
                                console.log(currentEnv);
                                var oldHeight = Snap('#pointer' + currentEnv).transform();
                                Snap('#pointer' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        function pushEnvs(currentEnv, count) {
                            while (currentEnv <= count) {
                                //console.log(currentEnv);
                                var oldHeight = Snap('#env' + currentEnv).transform();
                                Snap('#env' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                Snap("#sBase").paper.clear(); //reset the env Stack on click of the Visualize data button
                                
                                $(window).ready(function(){
                                    //I have to keep reseting this since the paper.clear() call above deletes this important element.
                                    //this sets up the arrowheads for the links
                                    //template for the arrows in the defs section comes from here: http://bl.ocks.org/mbostoc
                                    var defs = d3.select('#definitions');
                                    defs.append('marker')
                                        .attr('id', 'arrow')
                                        .attr('viewBox', '-10 -5 10 10')
                                        .attr('refX', '-8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L-10,0L0,5');
                                        
                                    defs.append('marker')
                                        .attr('id', 'arrow2')
                                        .attr('viewBox', '0 -5 10 10')
                                        .attr('refX', '8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L10,0L0,5');
                                    //end copied code
                                });
                                envCount = 0;
                                totalHeight = 0;
                            }
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            
                            //this resets all the text fill colors back to their default color--black
                            //every single time a new animation is triggered.
                            d3.selectAll('.envVar').attr('fill', '#000')

                            
                            
                            if (currentData.name === "envStackPush") {
                                
                                envCount++;
                                
                                var classNum = envCount % 2; //which color the div is
                                console.log(totalHeight);
                                Snap('#sBase')
                                    .group()
                                    .attr('id', 'env' + currentData.data.id)
                                    .attr('transform', 'translate( 0 ' + totalHeight + ' )')
                                    .rect(0, 0, xWidth, emptyEnv)
                                    .addClass('color' + classNum)
                                    .attr('id', 'rect' + currentData.data.id);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xWidth / 2, 15, currentData.data.label)
                                    .attr({         //^ this is how far down from the top of the environment we want the name to be.
                                        "text-anchor": 'middle',
                                        'dy': '.35em',
                                    });
                                    
                                    
                                Snap('#env' + currentData.data.id)
                                    .line(xMargin, 22, xWidth - xMargin, 22)
                                    .attr({
                                        stroke: '#000',
                                        strokeWidth: 1,
                                    });
                                    
                                    
                                totalHeight += emptyEnv;
                                  console.log(totalHeight);  
                                if (envCount > 1) {
                                    //add the triangular pointer between envs
                                    console.log("Current data id and total height, respectively:")
                                    console.log(currentData.data.id);
                                    console.log(totalHeight);
                                    Snap('#sBase' )
                                        .group()
                                        .polygon(65, 0 , 75, 7.5, 85, 0)
                                        .addClass('color' + ((envCount - 1) % 2))
                                        .attr('id', 'pointer' + (currentData.data.id - 1))
                                        .attr('transform', 'translate( 0 ' + ( totalHeight - Snap('#rect' + (currentData.data.id)).attr('height') - 1 ) + ')')
                                        
                                }
                                       
                                ///the code below is only executed if a function or begin env is added to the stack
                                //this code draws the ep link on the web page using a Bezier curve.
                                
                                if (currentData.data.epId) {
                                    
                                    //all rects start at (0,0) in their respective coordinate space.
                                    
                                    var ep = currentData.data.epId;
                                    console.log("The ep id is: " + ep);
                                    var startEPHeight = getYLocation(ep); //Snap('#env' + ep).transform().localMatrix.e;
                                    var endEPHeight = getHeight(ep) + getYLocation(ep); //Snap('#rect' + ep).attr('height');
                                    
                                    var startCurrentEnvHeight = totalHeight - getHeight(currentData.data.id); //Snap('#rect' + (currentData.data.id)).attr('height');
                                    
                                    var endCurrentEnvHeight = totalHeight;
                                    
                                    console.log("The value of endEPHeight is: " + endEPHeight);
                                    console.log("The value of startEPHeight is: " + startEPHeight);
                                    
                                    //note: p1 < p2 --- (always) 
                                    var p1 = (startEPHeight + endEPHeight) / 2; //midpoint of the ep env (on the y-axis)
                                    var p2 = Math.floor((startCurrentEnvHeight + endCurrentEnvHeight ) / 2); //mid point of the starting env (on the y-axis)
                                    
                                    var test = (startEPHeight + endEPHeight) / 2;
                                    console.log("The value of test is: " + test);
                                    console.log("The value of p1 is: " + p1);
                                    console.log("The value of p2 is: " + p2);
                                    
                                    var arch = (p2 - p1) / 2;
                                    //note: I am subtracting 1 off the xWidth to
                                    //keep us just inside the right edge of the rect
                                    console.log("Setting up the env line link");
                                    
                                    if (getXLocation(ep) === 0) {
                                        //env on the stack
                                        
                                        var currentGroup = d3.select('#sBase').append('svg:g').attr('id', 'g' + currentData.data.id);
                                            currentGroup
                                                .append('svg:path')
                                                .attr('d', 'M' + (xWidth - 1) + ','
                                                  + p1 + 'Q' + (xWidth - 1 + arch) + ','
                                                  + ((p1 + p2) / 2) + ',' + (xWidth - 1)
                                                  + ',' + p2)
                                                .attr('class', 'epLine')
                                                .attr('id', 'link' + currentData.data.id)
                                                .attr('marker-start', 'url(#arrow)');
                                            
                                            currentGroup
                                                .append('svg:text')
                                                .attr('text-anchor', 'middle')
                                                .attr('dy', '-.15em')
                                                .append('svg:textPath')
                                                .attr('startOffset', '50%')
                                                .attr('xlink:href', '#link' + currentData.data.id)
                                                .text('EP');
                                                
                                        
                                         
                                        //code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    else{
                                        
                                        
                                        var group = d3.select('#sBase').append('svg:g');
                                        
                                        group.append('svg:path')
                                            .attr('d', 'M' + (xWidth - 1) + ',' + p2 + 'Q'
                                                             + ((getXLocation(ep) + xWidth ) / 2 )
                                                             + ',' + ((p1 + p2) / 2) + ','
                                                             + (getXLocation(ep) + 1) + ','
                                                             + (getYLocation(ep) + ( getHeight(ep) * 0.25)) )
                                            .attr('class', 'epLine')
                                            .attr('id', 'link' + currentData.data.id)
                                            .attr('marker-end', 'url(#arrow2)');
                                        
                                        group.append('svg:text')
                                             .attr('id', 'text' + currentData.data.id)
                                             .attr('text-anchor', 'middle')
                                             .attr('dy', '-.15em')
                                             .append('svg:textPath')
                                             .attr('startOffset', '50%')
                                             .attr('xlink:href', '#link' + currentData.data.id)
                                             .text('EP');
                                             
                                        ////code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    
                                        
                                    
                                }
                            }
                            
                            else if (currentData.name === "envAdd") {
                                
                                
                                var currentHeight = parseInt(Snap('#rect' + currentData.data.id).attr('height'), 10);
                                //console.log('The current height of the previous rect is');                   // ^ base to convert numbers to.  
                                //console.log(currentHeight);
                                var newHeight = currentHeight + varAddedHeight;
                                Snap('#rect' + currentData.data.id)
                                    .attr('height', newHeight);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xMargin, newHeight - yMargin, currentData.data.value)
                                    .addClass('envVar')
                                    .attr({
                                        'dy': '.35em',
                                    });
                                
                                totalHeight += varAddedHeight;
                                pushEnvs(currentData.data.id + 1, envCount);
                                pushTriangles(currentData.data.id, envCount);
                                console.log(totalHeight);
                            }
                            else if (currentData.name === "envSearch") {
                                //Note on using SVG text elements:
                                //use the 'fill' attribute to color text rather than the 'stroke' attribute
                                // see this tutorial as an example: https://www.dashingd3js.com/svg-text-element
                                
                                //thanks to this SO answer for explaining how hth-child works: http://stackoverflow.com/a/29278310
                                //Original Poster (OP): http://stackoverflow.com/questions/29278107/d3js-how-to-select-nth-element-of-a-group
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').attr({'fill': currentData.data.color});
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                
                                //don't know of a way to set the innerSVG of an SVG element using Snap.svg
                                d3.select('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').text(currentData.data.value);
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')')
                                    .attr({
                                        'fill': currentData.data.color,
                                    });
                                
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                
                                var closure = currentData.data.closure;
                                // console.log('Closure?:' + closure);

                                var startHEnv = getYLocation(currentData.data.id);
                                var endHEnv = getYLocation(currentData.data.id) + getHeight(currentData.data.id);

                                if (!closure) {
                                    Snap('#link' + currentData.data.id).remove(); //delete the EP link from the viz
                                    //Snap('#text' + currentData.data.id).remove(); //delete the text associated with the EP link from the viz
                                    Snap('#env' + currentData.data.id).remove(); //delete the unneeded environment
                                    
                                    totalHeight -= (endHEnv - startHEnv); //reclaim the space on the stack where the current env sat.
                                }
                                else {
                                    //TODO: implement the closure visualization.
                                    closureCount++;
                                    
                                    //var EP = Snap('#env' + epId);
                                    var epId = currentData.data.epId;
                                    //var startHep = EP.transform().localMatrix.e;
                                    var startHep = getYLocation(epId); 
                                    var endHep = startHep + getHeight(epId); 
                                    
                                    var yEPQuarter = startHep + Math.floor((endHep - startHep) / 4);
                                    var xlocEP = getXLocation(epId) + getWidth() - 1;
                                    
                                    var childEP = currentData.data.id;
                                    //childEP.transform('translate(' + childEP.transform.localMatrix.e + ' ' + 300); //push the env out 300 units in the +x direction.
                                    setXLocation(childEP, closureCount % 2 === 0 ? -300: 300); // this determines which side of the stack the closure sits.

                                    
                                    
                                    totalHeight -= (endHEnv - startHEnv); //reclaim the space on the stack where the current env--now a closure--sat.
                                    
                                    var xEndChildEP = getXLocation(childEP) + getWidth(childEP);
                                    
                                    //Snap('#link' + currentData.data.id).attr('d', 'M' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1)  + ' Q'
                                    //                                         + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                    //                                         + ', ' + xlocEP + ',' + yEPQuarter);
                                    
                                    d3.select('#link' + currentData.data.id)
                                        .attr('d', 'M' + xlocEP + ',' + yEPQuarter
                                                       + ' Q' + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                                       + ' ' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1) );
                                        
                                    d3.select('#g' + currentData.data.id)
                                        .append('svg:text')
                                        .attr('text-anchor', 'middle')
                                        .attr('dy', '-.15em')
                                        .append('svg:textPath')
                                        .attr('startOffset', '50%')
                                        .attr('xlink:href', '#link' + currentData.data.id)
                                        .text('EP');
                                        
                                    
                                }
                                
                                
                                Snap('#pointer' + (currentData.data.id - 1)).remove();
                                envCount--;
                            }
                        });
                    }
                }
        });
    
})();

(function(){
    /*
        4.b
            This part of the data pipeline calls the actual interpreter
            (the Evaluate.evaluate function) every time the 'data' attribute
            on the d3-ast tag changes. This concludes this branch of the data pipeline.
            Please return to the previous stage (3.a) for info on viewing the other branch in the 
            pipeline.
     */
angular
    .module('astInterpreter')
    .directive('evaluateL10', ['l10.evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
            //   console.log('Language 8');
            //   console.log(scope);
            //   console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST(); //we grab the AST from the main controller
                                             //directly since the AST attached to the data
                                             //attribute is in JSON form and hence unsuited for
                                             //the Evaluate.evaluate function.
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    // console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast));
                    // console.log(ast);
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();


(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('prettyCodeL10', ['l10.prettyPrinterFactory' , '$compile', function(prettyPrinterFactory, /** unused */ $compile ){
                        return {
                            restrict: 'E',
                            replace: true,
                            require: 'prettyCodeL10',
                            template: '<div id="prettyCode" ng-show="!editing"><pre class="pre-scrollable-l8"></pre></div>',
                            controller: function($scope){
                                //this.prettyCode = prettyPrinterFactory.prettyPrint($scope.main.getContent());
                            },
                            
                            link: function(scope, element, attrs, pController){
                                scope.prettyCode = "";
                               if(scope.editing){
                                    attrs.$observe('editorcontent', function(newContent){
                                        console.log(scope.main.getAST());
                                        angular.element('.pre-scrollable-l8')[0].innerHTML = prettyPrinterFactory.prettyPrint(scope.main.getAST());
                                        // The $compile service in angular can also be used to build the HTML string...
                                        
                                    });
                                
                                    //console.log(scope);
                               }
                                
                                scope.$watch('index', function(newValue){
                                        if (!scope.editing) {
                                            var currentData = scope.main.getCurrentAnimObject();
                                            if(currentData.name === "nodeTraversal"){
                                        
                                             
                                             d3.selectAll(".pNode") //removes all previous 
                                               .style("color", "#000"); //formatting by coloring all nodes black
                                            
                                             d3.select("#" + "spn" + currentData.data.id)
                                               .style("color", currentData.data.color);
                                               //change nodeTraversal color from yellow to a higher contrast color in evaluateFactory.js
                                            }
                                        }
                                }, true);
                                        
                                
                                
                            },
                        }
                }]);
                
})();

(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL6', ['tokenizerFactory', 'buildTreeFactory', function(){
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(tokenizerFactory, buildTreeFactory){
                                    var Tokenizer = tokenizerFactory.Tokenizer;
                                    var BuildTree = buildTreeFactory.BuildTree;
                                    
                                    this.createTree = function(tkStr){
                                        var t = new Tokenizer(tkStr);
                                        var b = new BuildTree(t);
                                        return b.getTree();
                                    }
                                },
                                require: 'buildTreeL6',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        scope.main.setAST(buildTreeController.createTree(newContent));
                                        
                                    });
                                }
                            };
            }]);
            
})();



(function(){
    'use strict';
    angular
        .module('astInterpreter')
        .directive('envSvgL6', function(){
                return {
                    'restrict': 'E',
                    'replace': true,
                    'template': '<div id="envBase" class="envBase-l0-l9"><svg id="sBase" viewBox="0 0 150 300"></svg></div>',
                    'link': function(scope, element, attrs ){
                        
                        var envCount = 0;
                        var totalHeight = 0;
                        var emptyEnv = 30; //height of an empty env
                        var xWidth = 150; //width of all envs
                        var xMargin = 10;
                        var yMargin = 10; //bottom y Margin
                        var varAddedHeight = 25; //extention of the length of an environment when a new variable is pushed to it.
                        
                        function pushTriangles(currentEnv, count) {
                            while (currentEnv < count) {
                                console.log(currentEnv);
                                var oldHeight = Snap('#pointer' + currentEnv).transform();
                                Snap('#pointer' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        function pushEnvs(currentEnv, count) {
                            while (currentEnv <= count) {
                                //console.log(currentEnv);
                                var oldHeight = Snap('#env' + currentEnv).transform();
                                Snap('#env' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                Snap("#sBase").paper.clear(); //reset the env Stack on click of the Visualize data button
                                //console.log(envCount);
                                envCount = 0;
                                totalHeight = 0;
                            }
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            if (currentData.name === "envStackPush") {
                                
                                envCount++;
                                
                                var classNum = envCount % 2; //which color the div is
                                console.log(totalHeight);
                                Snap('#sBase')
                                    .group()
                                    .attr('id', 'env' + currentData.data.id)
                                    .attr('transform', 'translate( 0 ' + totalHeight + ' )')
                                    .rect(0, 0, xWidth, emptyEnv)
                                    .addClass('color' + classNum)
                                    .attr('id', 'rect' + currentData.data.id);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xWidth / 2, 15, currentData.data.label)
                                    .attr({         //^ this is how far down from the top of the environment we want the name to be.
                                        "text-anchor": 'middle',
                                        'dy': '.35em',
                                    });
                                    
                                    
                                Snap('#env' + currentData.data.id)
                                    .line(xMargin, 22, xWidth - xMargin, 22)
                                    .attr({
                                        stroke: '#000',
                                        strokeWidth: 1,
                                    });
                                    
                                    
                                totalHeight += emptyEnv;
                                  console.log(totalHeight);  
                                if (envCount > 1) {
                                    //add the triangular pointer between envs
                                    console.log("Current data id and total height, respectively:")
                                    console.log(currentData.data.id);
                                    console.log(totalHeight);
                                    Snap('#sBase' )
                                        .group()
                                        .polygon(65, 0 , 75, 7.5, 85, 0)
                                        .addClass('color' + ((envCount - 1) % 2))
                                        .attr('id', 'pointer' + (currentData.data.id - 1))
                                        .attr('transform', 'translate( 0 ' + ( totalHeight - Snap('#rect' + (currentData.data.id)).attr('height') - 1 ) + ')')
                                        
                                }
                                       
                                //var envStack = d3.select("#envBase");
                                //envStack
                                //    .append("div")
                                //    .attr("id", "env" + currentData.data.id)
                                //    .attr("class", "alert alert-info")
                                //    .text(currentData.data.label);
                            }
                            
                            else if (currentData.name === "envAdd") {
                                //console.log("#env" + currentData.data.id);
                                //var envStack = d3.select("#env" + currentData.data.id);
                                //envStack
                                //    .append("p")
                                //    .attr("class", "envVar")
                                //    .text(currentData.data.value);
                                
                                var currentHeight = parseInt(Snap('#rect' + currentData.data.id).attr('height'), 10);
                                //console.log('The current height of the previous rect is');                   // ^ base to convert numbers to.  
                                //console.log(currentHeight);
                                var newHeight = currentHeight + varAddedHeight;
                                Snap('#rect' + currentData.data.id)
                                    .attr('height', newHeight);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xMargin, newHeight - yMargin, currentData.data.value)
                                    .addClass('envVar')
                                    .attr({
                                        'dy': '.35em',
                                    });
                                
                                totalHeight += varAddedHeight;
                                pushEnvs(currentData.data.id + 1, envCount);
                                pushTriangles(currentData.data.id, envCount);
                                console.log(totalHeight);
                            }
                            else if (currentData.name === "envSearch") {
                                //d3.selectAll(".envVar").style("color", "#fff"); //color all nodes black to remove previous formatting
                                //var envStack = d3.select("#env" + currentData.data.id);
                                //console.log(envStack);
                                //envStack
                                //    .select("p:nth-child(" + currentData.data.childRank + ")")
                                //    .style("color", currentData.data.color);
                                
                                //thanks to this SO answer for explaining how hth-child works: http://stackoverflow.com/a/29278310
                                //Original Poster (OP): http://stackoverflow.com/questions/29278107/d3js-how-to-select-nth-element-of-a-group
                                Snap('.envVar')
                                    .attr({
                                        'stroke': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').attr({'stroke': currentData.data.color});
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                //d3.selectAll(".envVar").style("color", "#fff"); //color all nodes white to remove previous formatting
                                //var envStack = d3.select("#env" + currentData.data.id);
                                //console.log(envStack);
                                //envStack
                                //    .select("p:nth-child(" + currentData.data.childRank + ")")
                                //    .style("color", currentData.data.color)
                                //    .text(currentData.data.value);
                                Snap('.envVar')
                                    .attr({
                                        'stroke': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                
                                //don't know of a way to set the innerSVG of an SVG element using Snap.svg
                                d3.select('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').text(currentData.data.value);
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')')
                                    .attr({
                                        'stroke': currentData.data.color,
                                    });
                                
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                //var envStack = d3.select("#env" + currentData.data.id);
                                //console.log(envStack);
                                //envStack.remove();
                                Snap('#env' + currentData.data.id).remove();
                                Snap('#pointer' + (currentData.data.id - 1)).remove();
                                envCount--;
                            }
                        });
                    }
                }
        });
    
})();

(function(){
    
angular
    .module('astInterpreter')
    .directive('evaluateL6', ['l6.evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
              console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST();
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast));
                    console.log(scope.main.getAnimationData());
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();


(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('prettyCodeL6', ['prettyPrinterFactory' , '$compile', function(prettyPrinterFactory, $compile){
                        return {
                            restrict: 'E',
                            replace: true,
                            require: 'prettyCodeL6',
                            template: '<div id="prettyCode" ng-show="!editing"><pre id="pCode"></pre></div>',
                            controller: function($scope){
                                //this.prettyCode = prettyPrinterFactory.prettyPrint($scope.main.getContent());
                            },
                            
                            link: function(scope, element, attrs, pController){
                                scope.prettyCode = "";
                                if(scope.editing){
                                    attrs.$observe('editorcontent', function(newContent){
                                        console.log(scope.main.getAST());
                                        angular.element('#pCode')[0].innerHTML = prettyPrinterFactory.prettyPrint(scope.main.getAST());
                                        // I could use the $compile service in angular to build the HTML string...
                                        
                                    });
                                
                                    //console.log(scope);
                                }
                                
                                scope.$watch('index', function(newValue){
                                        if (!scope.editing) {
                                            var currentData = scope.main.getCurrentAnimObject();
                                            if(currentData.name === "nodeTraversal"){
                                        
                                             
                                             d3.selectAll(".pNode") //removes all previous 
                                               .style("color", "#000"); //formatting by coloring all nodes white
                                            
                                             d3.select("#" + "spn" + currentData.data.id)
                                               .style("color", currentData.data.color);
                                               //change nodeTraversal color from yellow to a higher contrast color in evaluateFactory.js
                                            }
                                        }
                                }, true);
                                        
                                
                                
                            },
                        }
                }]);
                
})();

(function(){
    'use strict';

    /*
        4.a 
            This AST directive watches the 'data' attribute for changes
            and then transforms our AST into a format that D3 can understand.
            Once transformed, the AST is nicely displayed via the capabilities of D3. 
            This directive also handles highlighting the various nodes of the AST as they 
            are traversed by the interpreter. This is the final stage of this branch in the 
            data pipeline. Please return to the previous stage (3.a) for details on viewing the 
            other branch in the pipeline.
     */

angular
    .module('astInterpreter')
    .directive('d3AstL8', /*Inject dependencies here*/ ['ast2JsonFactory',
        function( ast2JsonFactory){
        return {
            restrict: 'E',
            replace: true,
            template: '<div id="ast" ng-show="astVisible" class="astLanguage-6_8"></div>',
            
            link: function(scope, element, attrs){

            //code for building the d3 tree comes from here: http://bl.ocks.org/robschmuecker/7880033
               
            /*Copyright (c) 2013-2016, Rob Schmuecker
            All rights reserved.
            
            Redistribution and use in source and binary forms, with or without
            modification, are permitted provided that the following conditions are met:
            
            * Redistributions of source code must retain the above copyright notice, this
              list of conditions and the following disclaimer.
            
            * Redistributions in binary form must reproduce the above copyright notice,
              this list of conditions and the following disclaimer in the documentation
              and/or other materials provided with the distribution.
            
            * The name Rob Schmuecker may not be used to endorse or promote products
              derived from this software without specific prior written permission.
            
            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
            AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
            IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
            DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
            INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
            BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
            DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
            OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
            NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
            EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
            
            //Modified by Daniel Boulos 8/30/16
                
                var ast;
                var root;
                
                attrs.$observe('data', function(newVal){
                    ast = scope.$eval(newVal);
                
                
                    
                    var hier = [];
                    i = 0;
                    hier.push(ast2JsonFactory.traverse(ast));
                    
                    d3.layout.hierarchy(hier[0]);
                    // ************** Generate the tree diagram	 *****************
                    
                    //the idea for clearing the <svg> container after
                    //each render comes from this blog post
                    // www.tivix.com/blog/data-viz-d3-and-angular
                    //baseSvg.selectAll("*").remove();
                    
                    
                    root = hier[0];
                    root.x0 = viewerHeight;
                    root.y0 = 0;
                    update(root); //the functions update and centerNode are declared below and are hoisted 
                    centerNode(root); // as per JS standards and are thus invocable from here.
                    
                    
                    
                });
                
                
                
        
                // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width() / 2;
    var viewerHeight = $(document).height();

    var tree = d3.layout.tree()
        .size([viewerWidth, viewerHeight ]);
        

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.x, d.y]; //swapped y and x
        });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    


    

    // Define the zoom function for the zoomable tree 

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);



    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#ast").append("svg")
        .attr('id', 'astSvg')   
        .attr("width", viewerWidth)
        .attr("height", "100%")// changed from viewerHeight
        .attr("class", "overlay")
        .call(zoomListener);


    

   // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        var scale = zoomListener.scale();
        var x = -source.y0; //swapped these two; should these be swapped?
        var y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 200; // still need to work on the proper spacing b/t nodes D.B 9/2/16
        
        // Call visit function to establish maxLabelLength
        visit(source, function(d) {
            totalNodes++;
            maxLabelLength = Math.max(d.name.length, maxLabelLength);
    
        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : null;
        });
        
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root), //might need to rm the reverse() call
            links = tree.links(nodes);
console.log(source);
        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = d.depth * 100;
            //d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
            //d.x = (d.depth * (maxLabelLength * 10));
        });

        // Update the nodes
        var node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

         //Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.x0 + "," + source.y0 + ")"; //try switching y0 and x0
            })
            /*.on('click', click)*/; //this click handler is disabled since it introduces bugs into my program
        
        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("y", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("y", function(d) { //changed x to y so the labels are above and below nodes
                return d.children || d._children ? -15 : 15;
            })
            //.attr("text-anchor", function(d) {
            //    return d.children || d._children ? "end" : "start";
            //})
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("id", function(d){
                return   "node" + (d.id - 1); 
            })
            .attr("r", 4.5) // add my node class so that the nodeTraversal works
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; //switching x and y allows for a vertical tree
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")"; //switching x and y allows for a vertical tree
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links�
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");
    //end copied code
                            
                
                    
                //handles animation of the generated ast diagram.
                
                scope.$watch("index", function(){
                 var currentData = scope.main.getCurrentAnimObject();
                 if(currentData.name === "nodeTraversal"){
                 
                   console.log(currentData); //change the class name Update
                   d3.selectAll(".nodeCircle") //removes all previous 
                     .style("fill", "#fff"); //formatting by coloring all nodes white
                     
                   d3.select("#" + "node" + currentData.data.id)
                     .style("fill", currentData.data.color);
                    
                 }
                }, true);
                
                scope.$watch("editing", function(newValue, oldValue){
                    if (!scope.editing) {
                        $(document).ready(function(){
                            d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth );
                            
                        });
                        
                    }
                    else{
                        $(document).ready(function(){
                            d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              document.getElementById('editor').offsetWidth - 5);
                            
                        });
                        
                        
                    }
                });
                
                //cite this event handler code from  here: http://www.tivix.com/blog/data-viz-d3-and-angular/
                angular.element(window).on('resize', function(){
                    if (scope.editing) {
                        
                        d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              document.getElementById('editor').offsetWidth -
                                              document.getElementById('envBase').offsetWidth -
                                              (angular.element(window)[0].innerWidth * 0.05) - 5);
                    }
                    else{
                        
                        d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              
                                              document.getElementById('envBase').offsetWidth -
                                              (angular.element(window)[0].innerWidth * 0.05) - 5);
                       
                    }
                    
                });
                    
                },
        };
    }]);

})();




(function(){

    /*
        3.a
            This directive watches the 'editorcontent' attribute
            for changes and then creates an AST from the code 
            editor's contents. The AST is made available to the 
            other components on the page via the 'data' attribute on the 
            d3-ast tag. The next two brnaching stages can be found here:

                app/ast/astDirective.js
                app/shared/directives/Language_8/evaluateDirective.js
     */
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL8', [ 'l8.parserFactory', function(parserFactory){
                        
                        // console.log('Parser required');
                        
                        
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(){
                                    //var Tokenizer = tokenizerFactory.Tokenizer;
                                    //var BuildTree = buildTreeFactory.BuildTree;
                                    
                                    this.createTree = function(tkStr){
                                        var Parser = parserFactory.Parser;
                                        var p = new Parser();
                                        
                                        return p.parse(tkStr);
                                    }
                                },
                                require: 'buildTreeL8',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        scope.main.setAST(buildTreeController.createTree(newContent));
                                        console.log(scope.main.getAST());
                                    });
                                }
                            };
            }]);
            
})();



(function(){
    'use strict';
    angular
        .module('astInterpreter')
        .directive('envSvgL8', function(){
                return {
                    'restrict': 'E',
                    'replace': true, 
                    'template': '<div id="envBase" class="envBase-l8"><svg id="sBase" viewBox="0 0 500 300" ><defs id="definitions"></defs></svg></div>',
                    'link': function(scope, element, attrs ){
                        
                        var envCount = 0;
                        var totalHeight = 0;
                        var emptyEnv = 30; //height of an empty env
                        var xWidth = 150; //width of all envs
                        var xMargin = 10;
                        var yMargin = 10; //bottom y Margin
                        var varAddedHeight = 25; //extention of the length of an environment when a new variable is pushed to it.
                        var closureCount = 0;
                        
                        
                        //Use this API to make moving svg env elements easier
                        
                        function getWidth() {
                            return xWidth;  // this is just a wrapper for xWidth
                        }
                        function getHeight(envId) {
                            return Number(d3.select('#rect' + envId).attr('height')); //note that this returns a String; can be coerced to a Number.
                                                                                 // 12/20/16: this caused errors so it is being cast as a Number explicitly.
                        }
                        
                        function getXLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.e;
                        }
                        
                        function getYLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.f;
                        }
                        
                        function setXLocation(envId, dx) {
                            Snap('#env' + envId).transform('translate(' + (getXLocation(envId) + dx) + ' '
                                                           + getYLocation(envId) + ')');
                        }
                        
                        function setYLocation(envId, dy) {
                            Snap('#env' + envId).transform('translate(' + getXLocation(envId) + ' '
                                                           + (getYLocation(envId) + dy) + ')');
                        }
                        
                        function setXYLocation(envId, dx, dy) {
                            setXLocation(envId, dx);
                            setYLocation(envId, dy);
                        }
                        
                        
                        
                        
                        
                        
                        function pushTriangles(currentEnv, count) {
                            while (currentEnv < count) {
                                console.log(currentEnv);
                                var oldHeight = Snap('#pointer' + currentEnv).transform();
                                Snap('#pointer' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        function pushEnvs(currentEnv, count) {
                            while (currentEnv <= count) {
                                //console.log(currentEnv);
                                var oldHeight = Snap('#env' + currentEnv).transform();
                                Snap('#env' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                Snap("#sBase").paper.clear(); //reset the env Stack on click of the Visualize data button
                                
                                $(window).ready(function(){
                                    //I have to keep reseting this since the paper.clear() call above deletes this important element.
                                    //this sets up the arrowheads for the links
                                    //template for the arrows in the defs section comes from here: http://bl.ocks.org/mbostoc
                                    var defs = d3.select('#definitions');
                                    defs.append('marker')
                                        .attr('id', 'arrow')
                                        .attr('viewBox', '-10 -5 10 10')
                                        .attr('refX', '-8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L-10,0L0,5');
                                        
                                    defs.append('marker')
                                        .attr('id', 'arrow2')
                                        .attr('viewBox', '0 -5 10 10')
                                        .attr('refX', '8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L10,0L0,5');
                                    //end copied code
                                });
                                envCount = 0;
                                totalHeight = 0;
                            }
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            
                            //this resets all the text fill colors back to their default color--black
                            //every single time a new animation is triggered.
                            d3.selectAll('.envVar').attr('fill', '#000')

                            
                            
                            if (currentData.name === "envStackPush") {
                                
                                envCount++;
                                
                                var classNum = envCount % 2; //which color the div is
                                console.log(totalHeight);
                                Snap('#sBase')
                                    .group()
                                    .attr('id', 'env' + currentData.data.id)
                                    .attr('transform', 'translate( 0 ' + totalHeight + ' )')
                                    .rect(0, 0, xWidth, emptyEnv)
                                    .addClass('color' + classNum)
                                    .attr('id', 'rect' + currentData.data.id);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xWidth / 2, 15, currentData.data.label)
                                    .attr({         //^ this is how far down from the top of the environment we want the name to be.
                                        "text-anchor": 'middle',
                                        'dy': '.35em',
                                    });
                                    
                                    
                                Snap('#env' + currentData.data.id)
                                    .line(xMargin, 22, xWidth - xMargin, 22)
                                    .attr({
                                        stroke: '#000',
                                        strokeWidth: 1,
                                    });
                                    
                                    
                                totalHeight += emptyEnv;
                                  console.log(totalHeight);  
                                if (envCount > 1) {
                                    //add the triangular pointer between envs
                                    console.log("Current data id and total height, respectively:")
                                    console.log(currentData.data.id);
                                    console.log(totalHeight);
                                    Snap('#sBase' )
                                        .group()
                                        .polygon(65, 0 , 75, 7.5, 85, 0)
                                        .addClass('color' + ((envCount - 1) % 2))
                                        .attr('id', 'pointer' + (currentData.data.id - 1))
                                        .attr('transform', 'translate( 0 ' + ( totalHeight - Snap('#rect' + (currentData.data.id)).attr('height') - 1 ) + ')')
                                        
                                }
                                       
                                ///the code below is only executed if a function or begin env is added to the stack
                                //this code draws the ep link on the web page using a Bezier curve.
                                
                                if (currentData.data.epId) {
                                    
                                    //all rects start at (0,0) in their respective coordinate space.
                                    
                                    var ep = currentData.data.epId;
                                    console.log("The ep id is: " + ep);
                                    var startEPHeight = getYLocation(ep); //Snap('#env' + ep).transform().localMatrix.e;
                                    var endEPHeight = getHeight(ep) + getYLocation(ep); //Snap('#rect' + ep).attr('height');
                                    
                                    var startCurrentEnvHeight = totalHeight - getHeight(currentData.data.id); //Snap('#rect' + (currentData.data.id)).attr('height');
                                    
                                    var endCurrentEnvHeight = totalHeight;
                                    
                                    console.log("The value of endEPHeight is: " + endEPHeight);
                                    console.log("The value of startEPHeight is: " + startEPHeight);
                                    
                                    //note: p1 < p2 --- (always) 
                                    var p1 = (startEPHeight + endEPHeight) / 2; //midpoint of the ep env (on the y-axis)
                                    var p2 = Math.floor((startCurrentEnvHeight + endCurrentEnvHeight ) / 2); //mid point of the starting env (on the y-axis)
                                    
                                    var test = (startEPHeight + endEPHeight) / 2;
                                    console.log("The value of test is: " + test);
                                    console.log("The value of p1 is: " + p1);
                                    console.log("The value of p2 is: " + p2);
                                    
                                    var arch = (p2 - p1) / 2;
                                    //note: I am subtracting 1 off the xWidth to
                                    //keep us just inside the right edge of the rect
                                    console.log("Setting up the env line link");
                                    
                                    if (getXLocation(ep) === 0) {
                                        //env on the stack
                                        
                                        var currentGroup = d3.select('#sBase').append('svg:g').attr('id', 'g' + currentData.data.id);
                                            currentGroup
                                                .append('svg:path')
                                                .attr('d', 'M' + (xWidth - 1) + ','
                                                  + p1 + 'Q' + (xWidth - 1 + arch) + ','
                                                  + ((p1 + p2) / 2) + ',' + (xWidth - 1)
                                                  + ',' + p2)
                                                .attr('class', 'epLine')
                                                .attr('id', 'link' + currentData.data.id)
                                                .attr('marker-start', 'url(#arrow)');
                                            
                                            currentGroup
                                                .append('svg:text')
                                                .attr('text-anchor', 'middle')
                                                .attr('dy', '-.15em')
                                                .append('svg:textPath')
                                                .attr('startOffset', '50%')
                                                .attr('xlink:href', '#link' + currentData.data.id)
                                                .text('EP');
                                                
                                        
                                         
                                        //code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    else{
                                        
                                        
                                        var group = d3.select('#sBase').append('svg:g');
                                        
                                        group.append('svg:path')
                                            .attr('d', 'M' + (xWidth - 1) + ',' + p2 + 'Q'
                                                             + ((getXLocation(ep) + xWidth ) / 2 )
                                                             + ',' + ((p1 + p2) / 2) + ','
                                                             + (getXLocation(ep) + 1) + ','
                                                             + (getYLocation(ep) + ( getHeight(ep) * 0.25)) )
                                            .attr('class', 'epLine')
                                            .attr('id', 'link' + currentData.data.id)
                                            .attr('marker-end', 'url(#arrow2)');
                                        
                                        group.append('svg:text')
                                             .attr('id', 'text' + currentData.data.id)
                                             .attr('text-anchor', 'middle')
                                             .attr('dy', '-.15em')
                                             .append('svg:textPath')
                                             .attr('startOffset', '50%')
                                             .attr('xlink:href', '#link' + currentData.data.id)
                                             .text('EP');
                                             
                                        ////code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    
                                        
                                    
                                }
                            }
                            
                            else if (currentData.name === "envAdd") {
                                
                                
                                var currentHeight = parseInt(Snap('#rect' + currentData.data.id).attr('height'), 10);
                                //console.log('The current height of the previous rect is');                   // ^ base to convert numbers to.  
                                //console.log(currentHeight);
                                var newHeight = currentHeight + varAddedHeight;
                                Snap('#rect' + currentData.data.id)
                                    .attr('height', newHeight);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xMargin, newHeight - yMargin, currentData.data.value)
                                    .addClass('envVar')
                                    .attr({
                                        'dy': '.35em',
                                    });
                                
                                totalHeight += varAddedHeight;
                                pushEnvs(currentData.data.id + 1, envCount);
                                pushTriangles(currentData.data.id, envCount);
                                console.log(totalHeight);
                            }
                            else if (currentData.name === "envSearch") {
                                //Note on using SVG text elements:
                                //use the 'fill' attribute to color text rather than the 'stroke' attribute
                                // see this tutorial as an example: https://www.dashingd3js.com/svg-text-element
                                
                                //thanks to this SO answer for explaining how hth-child works: http://stackoverflow.com/a/29278310
                                //Original Poster (OP): http://stackoverflow.com/questions/29278107/d3js-how-to-select-nth-element-of-a-group
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').attr({'fill': currentData.data.color});
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                
                                //don't know of a way to set the innerSVG of an SVG element using Snap.svg
                                d3.select('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').text(currentData.data.value);
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')')
                                    .attr({
                                        'fill': currentData.data.color,
                                    });
                                
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                
                                var closure = currentData.data.closure;
                                // console.log('Closure?:' + closure);

                                var startHEnv = getYLocation(currentData.data.id);
                                var endHEnv = getYLocation(currentData.data.id) + getHeight(currentData.data.id);

                                if (!closure) {
                                    Snap('#link' + currentData.data.id).remove(); //delete the EP link from the viz
                                    //Snap('#text' + currentData.data.id).remove(); //delete the text associated with the EP link from the viz
                                    Snap('#env' + currentData.data.id).remove(); //delete the unneeded environment
                                    
                                    totalHeight -= (endHEnv - startHEnv); //reclaim the space on the stack where the current env sat.
                                }
                                else {
                                    //TODO: implement the closure visualization.
                                    closureCount++;
                                    
                                    //var EP = Snap('#env' + epId);
                                    var epId = currentData.data.epId;
                                    //var startHep = EP.transform().localMatrix.e;
                                    var startHep = getYLocation(epId); 
                                    var endHep = startHep + getHeight(epId); 
                                    
                                    var yEPQuarter = startHep + Math.floor((endHep - startHep) / 4);
                                    var xlocEP = getXLocation(epId) + getWidth() - 1;
                                    
                                    var childEP = currentData.data.id;
                                    //childEP.transform('translate(' + childEP.transform.localMatrix.e + ' ' + 300); //push the env out 300 units in the +x direction.
                                    setXLocation(childEP, closureCount % 2 === 0 ? -300: 300); // this determines which side of the stack the closure sits.

                                    
                                    
                                    totalHeight -= (endHEnv - startHEnv); //reclaim the space on the stack where the current env--now a closure--sat.
                                    
                                    var xEndChildEP = getXLocation(childEP) + getWidth(childEP);
                                    
                                    //Snap('#link' + currentData.data.id).attr('d', 'M' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1)  + ' Q'
                                    //                                         + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                    //                                         + ', ' + xlocEP + ',' + yEPQuarter);
                                    
                                    d3.select('#link' + currentData.data.id)
                                        .attr('d', 'M' + xlocEP + ',' + yEPQuarter
                                                       + ' Q' + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                                       + ' ' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1) );
                                        
                                    d3.select('#g' + currentData.data.id)
                                        .append('svg:text')
                                        .attr('text-anchor', 'middle')
                                        .attr('dy', '-.15em')
                                        .append('svg:textPath')
                                        .attr('startOffset', '50%')
                                        .attr('xlink:href', '#link' + currentData.data.id)
                                        .text('EP');
                                        
                                    
                                }
                                
                                
                                Snap('#pointer' + (currentData.data.id - 1)).remove();
                                envCount--;
                            }
                        });
                    }
                }
        });
    
})();

(function(){
    /*
        4.b
            This part of the data pipeline calls the actual interpreter
            (the Evaluate.evaluate function) every time the 'data' attribute
            on the d3-ast tag changes. This concludes this branch of the data pipeline.
            Please return to the previous stage (3.a) for info on viewing the other branch in the 
            pipeline.
     */
angular
    .module('astInterpreter')
    .directive('evaluateL8', ['l8.evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
            //   console.log('Language 8');
            //   console.log(scope);
            //   console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST(); //we grab the AST from the main controller
                                             //directly since the AST attached to the data
                                             //attribute is in JSON form and hence unsuited for
                                             //the Evaluate.evaluate function.
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    // console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast));
                    // console.log(ast);
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();


(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('prettyCodeL8', ['l8.prettyPrinterFactory' , '$compile', function(prettyPrinterFactory, $compile){
                        return {
                            restrict: 'E',
                            replace: true,
                            require: 'prettyCodeL8',
                            template: '<div id="prettyCode" ng-show="!editing"><pre class="pre-scrollable-l8"></pre></div>',
                            controller: function($scope){
                                //this.prettyCode = prettyPrinterFactory.prettyPrint($scope.main.getContent());
                            },
                            
                            link: function(scope, element, attrs, pController){
                                scope.prettyCode = "";
                               if(scope.editing){
                                    attrs.$observe('editorcontent', function(newContent){
                                        console.log(scope.main.getAST());
                                        angular.element('.pre-scrollable-l8')[0].innerHTML = prettyPrinterFactory.prettyPrint(scope.main.getAST());
                                        // I could use the $compile service in angular to build the HTML string...
                                        
                                    });
                                
                                    //console.log(scope);
                               }
                                
                                scope.$watch('index', function(newValue){
                                        if (!scope.editing) {
                                            var currentData = scope.main.getCurrentAnimObject();
                                            if(currentData.name === "nodeTraversal"){
                                        
                                             
                                             d3.selectAll(".pNode") //removes all previous 
                                               .style("color", "#000"); //formatting by coloring all nodes black
                                            
                                             d3.select("#" + "spn" + currentData.data.id)
                                               .style("color", currentData.data.color);
                                               //change nodeTraversal color from yellow to a higher contrast color in evaluateFactory.js
                                            }
                                        }
                                }, true);
                                        
                                
                                
                            },
                        }
                }]);
                
})();

(function(){

    /*
        3.a
            This directive watches the 'editorcontent' attribute
            for changes and then creates an AST from the code 
            editor's contents. The AST is made available to the 
            other components on the page via the 'data' attribute on the 
            d3-ast tag. The next two brnaching stages can be found here:

                app/ast/astDirective.js
                app/shared/directives/Language_8/evaluateDirective.js
     */
"use strict";
            angular
                .module('astInterpreter')
                .directive('buildTreeL9', [ 'l9.parserFactory', function(parserFactory){
                        
                        // console.log('Parser required');
                        
                        
                            return {
                                restrict: 'A',
                                replace: true,
                                controller: function(){
                                    //var Tokenizer = tokenizerFactory.Tokenizer;
                                    //var BuildTree = buildTreeFactory.BuildTree;
                                    
                                    this.createTree = function(tkStr){
                                        var Parser = parserFactory.Parser;
                                        
                                        var p = new Parser();
                                        
                                        return p.parse(tkStr);
                                    }
                                },
                                require: 'buildTreeL9',
                                link: function(scope, element, attrs, buildTreeController ){
                                    
                                    attrs.$observe('editorcontent', function(newContent){
                                        scope.main.setAST(buildTreeController.createTree(newContent));
                                        console.log(scope.main.getAST());
                                    });
                                }
                            };
            }]);
            
})();



(function(){
    'use strict';
    angular
        .module('astInterpreter')
        .directive('envSvgL9', function(){
                return {
                    'restrict': 'E',
                    'replace': true, 
                    'template': '<div id="envBase" class="envBase-l8"><svg id="sBase" viewBox="0 0 500 300" ><defs id="definitions"></defs></svg></div>',
                    'link': function(scope, element, attrs ){
                        
                        var envCount = 0;
                        var totalHeight = 0;
                        var emptyEnv = 30; //height of an empty env
                        var xWidth = 150; //width of all envs
                        var xMargin = 10;
                        var yMargin = 10; //bottom y Margin
                        var varAddedHeight = 25; //extention of the length of an environment when a new variable is pushed to it.
                        var closureCount = 0;
                        
                        
                        //Use this API to make moving svg env elements easier
                        
                        function getWidth() {
                            return xWidth;  // this is just a wrapper for xWidth
                        }
                        function getHeight(envId) {
                            return Number(d3.select('#rect' + envId).attr('height')); //note that this returns a String; can be coerced to a Number.
                                                                                 // 12/20/16: this caused errors so it is being cast as a Number explicitly.
                        }
                        
                        function getXLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.e;
                        }
                        
                        function getYLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.f;
                        }
                        
                        function setXLocation(envId, dx) {
                            Snap('#env' + envId).transform('translate(' + (getXLocation(envId) + dx) + ' '
                                                           + getYLocation(envId) + ')');
                        }
                        
                        function setYLocation(envId, dy) {
                            Snap('#env' + envId).transform('translate(' + getXLocation(envId) + ' '
                                                           + (getYLocation(envId) + dy) + ')');
                        }
                        
                        function setXYLocation(envId, dx, dy) {
                            setXLocation(envId, dx);
                            setYLocation(envId, dy);
                        }
                        
                        
                        
                        
                        
                        
                        function pushTriangles(currentEnv, count) {
                            while (currentEnv < count) {
                                console.log(currentEnv);
                                var oldHeight = Snap('#pointer' + currentEnv).transform();
                                Snap('#pointer' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        function pushEnvs(currentEnv, count) {
                            while (currentEnv <= count) {
                                //console.log(currentEnv);
                                var oldHeight = Snap('#env' + currentEnv).transform();
                                Snap('#env' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                Snap("#sBase").paper.clear(); //reset the env Stack on click of the Visualize data button
                                
                                $(window).ready(function(){
                                    //I have to keep reseting this since the paper.clear() call above deletes this important element.
                                    //this sets up the arrowheads for the links
                                    //template for the arrows in the defs section comes from here: http://bl.ocks.org/mbostoc
                                    var defs = d3.select('#definitions');
                                    defs.append('marker')
                                        .attr('id', 'arrow')
                                        .attr('viewBox', '-10 -5 10 10')
                                        .attr('refX', '-8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L-10,0L0,5');
                                        
                                    defs.append('marker')
                                        .attr('id', 'arrow2')
                                        .attr('viewBox', '0 -5 10 10')
                                        .attr('refX', '8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L10,0L0,5');
                                    //end copied code
                                });
                                envCount = 0;
                                totalHeight = 0;
                            }
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            
                            //this resets all the text fill colors back to their default color--black
                            //every single time a new animation is triggered.
                            d3.selectAll('.envVar').attr('fill', '#000')

                            
                            
                            if (currentData.name === "envStackPush") {
                                
                                envCount++;
                                
                                var classNum = envCount % 2; //which color the div is
                                console.log(totalHeight);
                                Snap('#sBase')
                                    .group()
                                    .attr('id', 'env' + currentData.data.id)
                                    .attr('transform', 'translate( 0 ' + totalHeight + ' )')
                                    .rect(0, 0, xWidth, emptyEnv)
                                    .addClass('color' + classNum)
                                    .attr('id', 'rect' + currentData.data.id);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xWidth / 2, 15, currentData.data.label)
                                    .attr({         //^ this is how far down from the top of the environment we want the name to be.
                                        "text-anchor": 'middle',
                                        'dy': '.35em',
                                    });
                                    
                                    
                                Snap('#env' + currentData.data.id)
                                    .line(xMargin, 22, xWidth - xMargin, 22)
                                    .attr({
                                        stroke: '#000',
                                        strokeWidth: 1,
                                    });
                                    
                                    
                                totalHeight += emptyEnv;
                                  console.log(totalHeight);  
                                if (envCount > 1) {
                                    //add the triangular pointer between envs
                                    console.log("Current data id and total height, respectively:")
                                    console.log(currentData.data.id);
                                    console.log(totalHeight);
                                    Snap('#sBase' )
                                        .group()
                                        .polygon(65, 0 , 75, 7.5, 85, 0)
                                        .addClass('color' + ((envCount - 1) % 2))
                                        .attr('id', 'pointer' + (currentData.data.id - 1))
                                        .attr('transform', 'translate( 0 ' + ( totalHeight - Snap('#rect' + (currentData.data.id)).attr('height') - 1 ) + ')')
                                        
                                }
                                       
                                ///the code below is only executed if a function or begin env is added to the stack
                                //this code draws the ep link on the web page using a Bezier curve.
                                
                                if (currentData.data.epId) {
                                    
                                    //all rects start at (0,0) in their respective coordinate space.
                                    
                                    var ep = currentData.data.epId;
                                    console.log("The ep id is: " + ep);
                                    var startEPHeight = getYLocation(ep); //Snap('#env' + ep).transform().localMatrix.e;
                                    var endEPHeight = getHeight(ep) + getYLocation(ep); //Snap('#rect' + ep).attr('height');
                                    
                                    var startCurrentEnvHeight = totalHeight - getHeight(currentData.data.id); //Snap('#rect' + (currentData.data.id)).attr('height');
                                    
                                    var endCurrentEnvHeight = totalHeight;
                                    
                                    console.log("The value of endEPHeight is: " + endEPHeight);
                                    console.log("The value of startEPHeight is: " + startEPHeight);
                                    
                                    //note: p1 < p2 --- (always) 
                                    var p1 = (startEPHeight + endEPHeight) / 2; //midpoint of the ep env (on the y-axis)
                                    var p2 = Math.floor((startCurrentEnvHeight + endCurrentEnvHeight ) / 2); //mid point of the starting env (on the y-axis)
                                    
                                    var test = (startEPHeight + endEPHeight) / 2;
                                    console.log("The value of test is: " + test);
                                    console.log("The value of p1 is: " + p1);
                                    console.log("The value of p2 is: " + p2);
                                    
                                    var arch = (p2 - p1) / 2;
                                    //note: I am subtracting 1 off the xWidth to
                                    //keep us just inside the right edge of the rect
                                    console.log("Setting up the env line link");
                                    
                                    if (getXLocation(ep) === 0) {
                                        //env on the stack
                                        
                                        var currentGroup = d3.select('#sBase').append('svg:g').attr('id', 'g' + currentData.data.id);
                                            currentGroup
                                                .append('svg:path')
                                                .attr('d', 'M' + (xWidth - 1) + ','
                                                  + p1 + 'Q' + (xWidth - 1 + arch) + ','
                                                  + ((p1 + p2) / 2) + ',' + (xWidth - 1)
                                                  + ',' + p2)
                                                .attr('class', 'epLine')
                                                .attr('id', 'link' + currentData.data.id)
                                                .attr('marker-start', 'url(#arrow)');
                                            
                                            currentGroup
                                                .append('svg:text')
                                                .attr('text-anchor', 'middle')
                                                .attr('dy', '-.15em')
                                                .append('svg:textPath')
                                                .attr('startOffset', '50%')
                                                .attr('xlink:href', '#link' + currentData.data.id)
                                                .text('EP');
                                                
                                        
                                         
                                        //code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    else{
                                        
                                        
                                        var group = d3.select('#sBase').append('svg:g');
                                        
                                        group.append('svg:path')
                                            .attr('d', 'M' + (xWidth - 1) + ',' + p2 + 'Q'
                                                             + ((getXLocation(ep) + xWidth ) / 2 )
                                                             + ',' + ((p1 + p2) / 2) + ','
                                                             + (getXLocation(ep) + 1) + ','
                                                             + (getYLocation(ep) + ( getHeight(ep) * 0.25)) )
                                            .attr('class', 'epLine')
                                            .attr('id', 'link' + currentData.data.id)
                                            .attr('marker-end', 'url(#arrow2)');
                                        
                                        group.append('svg:text')
                                             .attr('id', 'text' + currentData.data.id)
                                             .attr('text-anchor', 'middle')
                                             .attr('dy', '-.15em')
                                             .append('svg:textPath')
                                             .attr('startOffset', '50%')
                                             .attr('xlink:href', '#link' + currentData.data.id)
                                             .text('EP');
                                             
                                        ////code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    
                                        
                                    
                                }
                            }
                            
                            else if (currentData.name === "envAdd") {
                                
                                
                                var currentHeight = parseInt(Snap('#rect' + currentData.data.id).attr('height'), 10);
                                //console.log('The current height of the previous rect is');                   // ^ base to convert numbers to.  
                                //console.log(currentHeight);
                                var newHeight = currentHeight + varAddedHeight;
                                Snap('#rect' + currentData.data.id)
                                    .attr('height', newHeight);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xMargin, newHeight - yMargin, currentData.data.value)
                                    .addClass('envVar')
                                    .attr({
                                        'dy': '.35em',
                                    });
                                
                                totalHeight += varAddedHeight;
                                pushEnvs(currentData.data.id + 1, envCount);
                                pushTriangles(currentData.data.id, envCount);
                                console.log(totalHeight);
                            }
                            else if (currentData.name === "envSearch") {
                                //Note on using SVG text elements:
                                //use the 'fill' attribute to color text rather than the 'stroke' attribute
                                // see this tutorial as an example: https://www.dashingd3js.com/svg-text-element
                                
                                //thanks to this SO answer for explaining how hth-child works: http://stackoverflow.com/a/29278310
                                //Original Poster (OP): http://stackoverflow.com/questions/29278107/d3js-how-to-select-nth-element-of-a-group
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').attr({'fill': currentData.data.color});
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                
                                //don't know of a way to set the innerSVG of an SVG element using Snap.svg
                                d3.select('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').text(currentData.data.value);
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')')
                                    .attr({
                                        'fill': currentData.data.color,
                                    });
                                
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                
                                var closure = currentData.data.closure;
                                // console.log('Closure?:' + closure);

                                var startHEnv = getYLocation(currentData.data.id);
                                var endHEnv = getYLocation(currentData.data.id) + getHeight(currentData.data.id);

                                if (!closure) {
                                    Snap('#link' + currentData.data.id).remove(); //delete the EP link from the viz
                                    //Snap('#text' + currentData.data.id).remove(); //delete the text associated with the EP link from the viz
                                    Snap('#env' + currentData.data.id).remove(); //delete the unneeded environment
                                    
                                    totalHeight -= (endHEnv - startHEnv); //reclaim the space on the stack where the current env sat.
                                }
                                else {
                                    //TODO: implement the closure visualization.
                                    closureCount++;
                                    
                                    //var EP = Snap('#env' + epId);
                                    var epId = currentData.data.epId;
                                    //var startHep = EP.transform().localMatrix.e;
                                    var startHep = getYLocation(epId); 
                                    var endHep = startHep + getHeight(epId); 
                                    
                                    var yEPQuarter = startHep + Math.floor((endHep - startHep) / 4);
                                    var xlocEP = getXLocation(epId) + getWidth() - 1;
                                    
                                    var childEP = currentData.data.id;
                                    //childEP.transform('translate(' + childEP.transform.localMatrix.e + ' ' + 300); //push the env out 300 units in the +x direction.
                                    setXLocation(childEP, closureCount % 2 === 0 ? -300: 300); // this determines which side of the stack the closure sits.

                                    
                                    
                                    totalHeight -= (endHEnv - startHEnv); //reclaim the space on the stack where the current env--now a closure--sat.
                                    
                                    var xEndChildEP = getXLocation(childEP) + getWidth(childEP);
                                    
                                    //Snap('#link' + currentData.data.id).attr('d', 'M' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1)  + ' Q'
                                    //                                         + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                    //                                         + ', ' + xlocEP + ',' + yEPQuarter);
                                    
                                    d3.select('#link' + currentData.data.id)
                                        .attr('d', 'M' + xlocEP + ',' + yEPQuarter
                                                       + ' Q' + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                                       + ' ' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1) );
                                        
                                    d3.select('#g' + currentData.data.id)
                                        .append('svg:text')
                                        .attr('text-anchor', 'middle')
                                        .attr('dy', '-.15em')
                                        .append('svg:textPath')
                                        .attr('startOffset', '50%')
                                        .attr('xlink:href', '#link' + currentData.data.id)
                                        .text('EP');
                                        
                                    
                                }
                                
                                
                                Snap('#pointer' + (currentData.data.id - 1)).remove();
                                envCount--;
                            }
                        });
                    }
                }
        });
    
})();

(function(){
    /*
        4.b
            This part of the data pipeline calls the actual interpreter
            (the Evaluate.evaluate function) every time the 'data' attribute
            on the d3-ast tag changes. This concludes this branch of the data pipeline.
            Please return to the previous stage (3.a) for info on viewing the other branch in the 
            pipeline.
     */
angular
    .module('astInterpreter')
    .directive('evaluateL9', ['l9.evaluateFactory', function(evalFactory){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              var Evaluate = evalFactory.Evaluate;
              var ast = null;
            //   console.log('Language 8');
            //   console.log(scope);
            //   console.log(attrs);
              attrs.$observe('data', function(){
                  ast = scope.main.getAST(); //we grab the AST from the main controller
                                             //directly since the AST attached to the data
                                             //attribute is in JSON form and hence unsuited for
                                             //the Evaluate.evaluate function.
                  if(ast !== undefined) {
                    scope.main.resetAnimationData();//clear out all previous animations
                    // console.log(ast);
                    var e = new Evaluate(scope);
                    scope.main.setResult(e.evaluate(ast));
                    // console.log(ast);
                  }
              });
              
              //console.log(mainController);
            },
        }
    }]);
})();


(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('prettyCodeL9', ['l8.prettyPrinterFactory' , '$compile', function(prettyPrinterFactory, $compile){
                        return {
                            restrict: 'E',
                            replace: true,
                            require: 'prettyCodeL9',
                            template: '<div id="prettyCode" ng-show="!editing"><pre class="pre-scrollable-l8"></pre></div>',
                            controller: function($scope){
                                //this.prettyCode = prettyPrinterFactory.prettyPrint($scope.main.getContent());
                            },
                            
                            link: function(scope, element, attrs, pController){
                                scope.prettyCode = "";
                               if(scope.editing){
                                    attrs.$observe('editorcontent', function(newContent){
                                        console.log(scope.main.getAST());
                                        angular.element('.pre-scrollable-l8')[0].innerHTML = prettyPrinterFactory.prettyPrint(scope.main.getAST());
                                        // I could use the $compile service in angular to build the HTML string...
                                        
                                    });
                                
                                    //console.log(scope);
                               }
                                
                                scope.$watch('index', function(newValue){
                                        if (!scope.editing) {
                                            var currentData = scope.main.getCurrentAnimObject();
                                            if(currentData.name === "nodeTraversal"){
                                        
                                             
                                             d3.selectAll(".pNode") //removes all previous 
                                               .style("color", "#000"); //formatting by coloring all nodes black
                                            
                                             d3.select("#" + "spn" + currentData.data.id)
                                               .style("color", currentData.data.color);
                                               //change nodeTraversal color from yellow to a higher contrast color in evaluateFactory.js
                                            }
                                        }
                                }, true);
                                        
                                
                                
                            },
                        }
                }]);
                
})();

(function(){

    /*
        3.b 
            This stage of the data pipeline watches the 'editorcontent'
            attribute for any changes. When changes are made, this 
            directive checks if the app is in a 'not-editing' state.
            If so, the code editor is suppressed from view and in its place 
            a pretty-printed version of the editor's contents are rendered in
            the view. This is the last stage of this branch in the data pipeline.
            Please return to stage 2 for details on how to view the other branch 
            of the data pipeline.
     */
"use strict";
            angular
                .module('astInterpreter')
                .directive('prettyCode', ['prettyPrinterFactory' , '$compile', function(prettyPrinterFactory, $compile){
                        return {
                            restrict: 'E',
                            replace: true,
                            require: 'prettyCode',
                            template: '<div id="prettyCode" ng-show="!editing"><pre id="pCode"></pre></div>',
                            controller: function($scope){
                                //this.prettyCode = prettyPrinterFactory.prettyPrint($scope.main.getContent());
                            },
                            
                            link: function(scope, element, attrs, pController){
                                scope.prettyCode = "";
                                if(scope.editing){
                                    attrs.$observe('editorcontent', function(newContent){
                                        console.log(scope.main.getAST());
                                        angular.element('#pCode')[0].innerHTML = prettyPrinterFactory.prettyPrint(scope.main.getAST());
                                        // I could use the $compile service in angular to build the HTML string...
                                        
                                    });
                                
                                    //console.log(scope);
                                }
                                
                                scope.$watch('index', function(newValue){
                                        if (!scope.editing) {
                                            var currentData = scope.main.getCurrentAnimObject();
                                            if(currentData.name === "nodeTraversal"){
                                        
                                             
                                             d3.selectAll(".pNode") //removes all previous 
                                               .style("color", "#000"); //formatting by coloring all nodes white
                                            
                                             d3.select("#" + "spn" + currentData.data.id)
                                               .style("color", currentData.data.color);
                                               //change nodeTraversal color from yellow to a higher contrast color in evaluateFactory.js
                                            }
                                        }
                                }, true);
                                        
                                
                                
                            },
                        }
                }]);
                
})();

(function(){
    'use strict';
    // 1. This button is the first stage in the flow of 
    // data between the different components in the app.
    // Three actions happen when a user clicks this button:
    //      I. The editor contents are saved to a variable. 
    //     II. The animation sequence is reset to the beginning
    //    III. The app toggles between an editing state and a not-editing state.  
    //         This determines whether the view renders a code editor (editing) or a 
    //         pretty-printed version of the code inputted into the editor (not-editing).
    //
    // The second stage of the data pipeline can be found here:  app/editor/editorDirective.js
    angular
        .module('astInterpreter')
        .directive('visButton', function(){
            return {
                restrict: 'E',
                replace: true,
                controller: function($scope){
                     $scope.text = 'Visualize Program';

                     $scope.$watch('editing', function(newVal, oldVal){
                        
                        if(newVal){
                            //currently in edit mode
                            $scope.text = 'Visualize Program';
                        }
                        else{
                            //we are not editing
                            $scope.text = 'Edit Code';
                        }
                        
                    });
                },
                template: '<button class="btn btn-default" ng-click="mco.save();main.resetIndex();editing = !editing">{{text}}</button>',
                
                
            }
        });


})();