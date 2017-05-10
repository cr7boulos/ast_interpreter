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