(function(){
    
    'use strict';
    
    angular
        .module('astInterpreter')
        .factory('ast2JsonFactory', function(){
            function traverse(tree) {
                var obj = {};
                if (tree.degree !== undefined) {
                    
                    if (tree.degree() == 0) {
                    obj.name = tree.element;
                    }
                    else {
                        obj.name = tree.element;
                        obj.children = [];
                        for (var i = 0; i < tree.degree() ; i++) {
                            obj.children.push(traverse(tree.getSubTree(i)));
                        }
                        
                    }
                    return obj;
                }
                else{
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
            
                
            }
            
            return {
                'traverse': traverse
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
            //this.defined = function (variable) {
            //    
            //    var i = 0;
            //    for (; i < this.variables.length; i++) {
            //        if (variable.trim() === this.variables[i].trim()) {
            //            break;
            //        }
            //    }
            //
            //    if (i < this.variables.length) {
            //        return true;// variable is found
            //    }
            //    else {
            //        if (null === this.nonLocalLink) {
            //            return false; //variable cannot be found
            //        }
            //        else {
            //            // recursively search the rest of the environment chain
            //            return this.nonLocalLink.defined(variable);
            //        }
            //    }
            //};
            
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
        var id = 0; //used for the animation of nodes 
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                                    'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                        'color': "#ff4",
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
                            'color': "#ff4",
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
                            'color': "#ff4",
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
                            'color': "#ff4",
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
                            'color': "#ff4",
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
                            'color': "#ff4",
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
                        'color': "#ff4",
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
                        if(tree.depth() == 2)
                        {
                            result +=  formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var c = 0; c < tree.degree() ; c++) {
                                result += prettyPrint2(" ", tree.getSubTree(c));
                            }
                            return result + " )";
                        }
                        else
                        {
                            //TODO: Implement this feature
                            return "Needs to be Implemented 1";
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
                    else if(tree.element === "+" ||
                            tree.element === "-"  ||
                            tree.element === "*"  ||
                            tree.element === "/"  ||
                            tree.element === "^"  ||
                            tree.element === "%"  ||
                            tree.element === "--"  ||
                            tree.element === "++"  ||
                            tree.element === "||"  ||
                            tree.element === "!="  ||
                            tree.element === "&&"  ||
                            tree.element === "=="  ||
                            tree.element === "<"  ||
                            tree.element === "<="  ||
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

                //TODO: Make sure this is never reached!
                return "Needs to be Implemented 2";

            }

            function prettyPrint(tree) {
                var result = prettyPrint2("", tree);
                console.log("Printing from prettyPrintFactory");
                console.log(result);
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
    angular
        .module('astInterpreter')
        .directive('animationButton', function(){
            return {
              restrict: 'E',
              replace: true,
              template: '<div><button id="advance" ng-click="main.incrementIndex()">Advance<div>',
            };
        });
    
})();   
    

(function(){
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
                                               //change nodeTraversal color from to a higher contrast color in evaluateFactory.js
                                            }
                                        }
                                }, true);
                                        
                                
                                
                            },
                        }
                }]);
                
})();