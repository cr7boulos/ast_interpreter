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