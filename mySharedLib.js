(function () {
    'use strict';
    angular
        .module('astInterpreter')
        .factory('buildTreeFactory', [ 'treeFactory',
          function ( treeFactory) {
            
            var Tree = treeFactory.Tree;
            //var ParseError = parseErrorFactory.ParseError;

            function BuildTree(tokenizer) { 
                this.counter = 1;
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
           

           function Environment(env, label) {
            this.variables = [];
            this.values = [];
            this.label = null; //label is used for debugging purposes
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
            };

            this.defined = function (variable) {
                return (null !== this.lookUp(variable));
            };

            this.lookUp = function (variable) {
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        break;
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
                var i = 0;
                for (; i < this.variables.length; i++) {
                    if (variable.trim() === this.variables[i].trim()) {
                        break;
                    }
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

    function Evaluate() {
        //don't set this variable to 1 when running large programs
        //can cuase stack overflows due to large environments!!
        this.DEBUG = 0;
        this.globalEnv = null;
        this.env = null;

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
            this.globalEnv = new Environment();
            this.env = this.globalEnv;

            // Check whick kind of Prog we have.
            if (!(tree.element === "prog")) {

                // Evaluate the single expression.
                //console.log("calling evaluateExp");
                result = this.evaluateExp(tree);
            }
            else {
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

            // check if this function has already been defined
            if (this.env.definedLocal(name)) {
                throw new EvalError("function already exists: " + name);
            }

            // get the "lambda expression" (the function value)

            //var lambda := Tree
            var lambda = tree.getSubTree(1);

            // check if the definition really is a function
            if (!(lambda.element === "lambda")) {
                throw new EvalError("bad function definition: " + tree);
            }

            // create a function Value and
            // add a <name, lambda> pair to the environment
            this.env.add(name, new Value(lambda));

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

                result = this.evaluateApply(tree);
            }
            else if (node === "if") {

                result = this.evaluateIf(tree);
            }
            else if (node === "while") {
                result = this.evaluateWhile(tree);
            }
            else if (node === "set") {
                result = this.evaluateSet(tree);
            }
            else if (node === "begin") {
                result = this.evaluateBegin(tree);
            }
            else if (node === "var") {
                result = this.evaluateVar(tree);
            }
            else if (node === "print") {
                result = this.evaluatePrint(tree);
            }
            else if ((node === "&&") || (node === "||") || (node === "!")) {
                result = this.evaluateBexp(tree) //boolean expression
            }
            else if ((node === "<") || (node === ">")
                    || (node === "<=") || (node === ">=")
                    || (node === "==") || (node === "!=")) {
                result = this.evaluateRexp(tree); //relational operator
            }
            else if ((node === "+") || (node === "-")
                || (node === "*") || (node === "/")
                || (node === "%") || (node === "^")) {
                result = this.evaluateAexp(tree); //arithmetic expression
            }
            else if (tree.degree() === 0) {

                if ((node === "true") || (node === "false")) {

                    result = new Value(node === "true");
                }
                else if (node.match(/^[-]*[0-9][0-9]*/)) {

                    result = new Value(parseInt(node, 10));
                }
                else if (this.env.defined(node)) { // a variable

                    result = this.env.lookUp(node);
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
            var localEnv = new Environment(this.globalEnv, "Function Activation");

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
                //console.log("Formal name : " + formalParamName);

                // Bind, in the new local environment object, the actual
                // paramter value to a formal parameter name.
                /*6*/
                localEnv.add(formalParamName, actualParamValue);

            }
            if (this.DEBUG > 0) {
                document.body.innerHTML += "<pre>" + localEnv + "</pre>";// for debugging purposes
            }

            // Evaluate the body of the lambda expression using the
            // new environment (which contains the binding of the actual
            // parameter values to the function's formal parameter names).
            /*7*/
            var originalEnv = this.env;

            /*8*/
            this.env = localEnv;

            /*9*/
            var result = this.evaluateExp(lambda.getSubTree(tree.degree() - 1));

            // Finally, restore the environment chain.
            /*10*/
            this.env = originalEnv;

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
            // check if this variable has already been declared
            if (!this.env.defined(variable)) {
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
            this.env = new Environment(previousEnv, "Local (begin)");

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

            //get the varriable
            var variable = tree.getSubTree(0).element;


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

            //print the expression on the associated web page
            document.body.innerHTML += "<pre>" + result + "</pre>";

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

            return new Value(result);
        }//evaluateRexp()

        // Evaluate an arithmetic expression
        this.evaluateAexp = function (tree) {
            //throws EvalError


            var result = 0;
            var node = tree.element;

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
                }
                else if(typeof value === "boolean") {
                        this.tag = "bool";
                        this.valueI = 0;//default value
                        this.valueB = value;
                        this.INT_TAG = "int";
                        this.BOOL_TAG = "bool";
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
                        result += this.valueL;
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