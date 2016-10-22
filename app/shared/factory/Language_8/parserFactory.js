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
        .factory('l8.parserFactory', ['l8.tokenizerFactory', 'l8.treeFactory', function(tokenizerFactory, treeFactory){
            console.log('Parser loaded in angular');
            
            var Tokenizer = tokenizerFactory.Tokenizer;
        
            var Tree = treeFactory.Tree;
            
            var counter = -1; //used for node animations
                             //numId should be zero-indexed not one-indexed. 8/21/16
            
            function parse(expStr) {
                //throws PraseError
                
                
                var tokens = new Tokenizer(expStr); // Tokenizer is defined
                                                    // in Tokenizer.js
                var result = getProg(tokens); // parse the token stream
                
                if (tokens.hasToken()) {
                    throw new ParseError("unexpected input: " + tokens.peekToken() + "\n" + tokens + "\n");
                }
        
                return result;
        
        
            }//parse()

            //Parse a prog
            function getProg(tokens) {
                
        
                var result = null;
        
                // Check whick kind of Prog we have.
                if (! (tokens.has2Token() && (tokens.peek2Token() === "prog")) ) {
                    // Evaluate the single expression.
                    result = getExp(tokens);
                }
                else {
                    tokens.match("(");
        
                    if (!tokens.match("prog")) {
                        throw new ParseError("expected 'prog': " + tokens);
                    }
        
                    result = new Tree("prog");
                    result.numId = counter;
                    counter++;
        
                    // Parse each Exp in the Prog.
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        
                            result.addSubTree(getExp(tokens));
                    }
        
                    if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                        console.log("called from getProg");
                        throw new ParseError("expected ')': " + tokens);
                    }
                }
        
                return result;
            }//getProg()

            // Parse a function definition.
            function getFun(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("fun")) {
                    throw new ParseError("expected 'fun': " + tokens);
                }
        
                var result = new Tree("fun");
                result.numId = counter++;
        
                // parse the function name
                if (tokens.hasToken()) {
                    //this may be a source of bugs 10/22/16
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = counter++;
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected function name: " + tokens);
                }
        
                // parse the lambda expression
                if (tokens.hasToken()) {
                    result.addSubTree(getLambda(tokens));
                }
                else {
                    throw new ParseError("expected lambda expression: " + tokens);
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from getFun");
                    throw new ParseError("expected ')': " + tokens);
                }
                return result;
            }//getFun()

            // Parse a lambda expression
            function getLambda(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("lambda")) {
                    throw new ParseError("expected 'lambda': " + tokens);
                }
        
                var result = new Tree("lambda");
                result.numId = counter++;
        
                // this is not really correct since we are not distinguishing
                // between the formal parameters and the function body
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from getlambda");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getLambda()
        
            // Parse an expression
            function getExp(tokens) {
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
                        result = getFun(tokens);
                    }
                    else if (tk === "apply") {
                        result = getApply(tokens);
                    }
                    else if (tk === "if") {
                        result = getIf(tokens);
                    }
                    else if (tk === "while") {
                        result = getWhile(tokens);
                    }
                    else if (tk === "set") {
                        result = getSet(tokens);
                    }
                    else if (tk === "var") {
                        result = getVar(tokens);
                    }
                    else if (tk === "begin") {
                        result = getBegin(tokens);
                    }
                    else if (tk === "print") {
                        result = getPrint(tokens);
                    }
                    else if ( (tk === "&&") || (tk === "||")
                           || (tk === "!")) {
                        result = getBexp(tokens); //boolean expression
                    }
                    else if ( (tk === "<")  || (tk === ">")
                           || (tk === "<=") || (tk === ">=")
                           || (tk === "==") || (tk == "!=") ) {
                        result = getRexp(tokens); //relational expression
                    }
                    else if ((tk === "+") || (tk === "-")
                           || (tk === "*") || (tk === "/")
                           || (tk === "%") || (tk == "^")) {
                        result = getAexp(tokens); //arithmetic expression
                    }
                    else {
                        throw new ParseError("unexpected expression: " + tk);
                    }
                }
                else {
                    result = new Tree(tokens.nextToken());
                    result.numId = counter++;
                }
        
                return result;
            }//getExp()
        
            // Parse a function application.
            function getApply(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("apply")) {
                    throw new ParseError("expected 'apply': " + tokens);
                }
        
                var result = new Tree("apply");
                result.numId = counter++;
        
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from getApply");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getApply()
        
            // Parse an if-expression
            function getIf(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("if")) {
                    throw new ParseError("expected 'if': " + tokens);
                }
        
                var result = new Tree("if");
                result.numId = counter++;
        
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected conditional expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected then expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected else expression: " + tokens);
                }
                console.log("about to call the problem" + tokens.peekToken());
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from getIf");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getIf()
        
            // Parse a while-loop expression
            function getWhile(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("while")) {
                    throw new ParseError("expected 'while': " + tokens);
                }
        
                var result = new Tree("while");
                result.numId = counter++;
        
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected conditional expression: " + tokens);
                }
        
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected loop body: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from getWhile");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getWhile()
        
            // Parse a set expression
            function getSet(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("set")) {
                    throw new ParseError("expected 'set': " + tokens);
                }
        
                var result = new Tree("set");
                result.numId = counter++;
        
                // parse the variable
                if (tokens.hasToken()) {
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = counter++;
                    
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected variable name: " + tokens);
                }
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected variable value: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from getSet");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getSet()
        
            // Parse a var expression
            function getVar(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("var")) {
                    throw new ParseError("expected 'var': " + tokens);
                }
        
                var result = new Tree("var");
                result.numId = counter++;
        
                // parse the variable
                if (tokens.hasToken()) {
                    var temp = new Tree(tokens.nextToken());
                    temp.numId = counter++;
                    
                    result.addSubTree(temp);
                }
                else {
                    throw new ParseError("expected variable name: " + tokens);
                }
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected variable value: " + tokens);
                }
                
                if (!(  tokens.hasToken()  &&  tokens.match(")"))) {
                    console.log("called from getVarrr");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getVar()
        
            // Parse a begin expression
            function getBegin(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("begin")) {
                    throw new ParseError("expected 'begin': " + tokens);
                }
        
                var result = new Tree("begin");
                result.numId = counter++;
        
                while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                    result.addSubTree(getExp(tokens));
                }
        
                if ((!tokens.hasToken()) || (!tokens.match(")"))) {
                    console.log("called from begin");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getBegin()
        
            // Parse a print expression
            function getPrint(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                if (!tokens.match("print")) {
                    throw new ParseError("expected 'print': " + tokens);
                }
        
                var result = new Tree("print");
                result.numId = counter++;
        
                // parse the expression
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected print's expression: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from getPrint");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getPrint()
        
            function getBexp(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = counter++;
        
                if ((tk === "&&") || (tk === "||")) {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse the second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(getExp(tokens));
                    }
                }
                else if (tk === "!") {
                    //parse the expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
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
                    console.log("called from getBexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getBexp()
        
            // Parse a relational expression (which is a kind of boolean expression)
            function getRexp(tokens) {
                //throws ParseError
        
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = counter++;
        
                //parse the first expression
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                }
        
                //parse the second expression
                if (tokens.hasToken()) {
                    result.addSubTree(getExp(tokens));
                }
                else {
                    throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                }
        
                if (!(tokens.hasToken() && tokens.match(")"))) {
                    console.log("called from getRexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getRexp()
        
            // Parse an arithmetic expression
            function getAexp(tokens) {
                //throws ParseError
        
                
        
                if (!tokens.match("(")) {
                    throw new ParseError("expected '(': " + tokens);
                }
        
                var tk = tokens.nextToken();
        
                var result = new Tree(tk);
                result.numId = counter++;
        
                if (tk === "+") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(getExp(tokens));
                    }
                }
                else if (tk === "-") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
                }
                else if (tk === "*") {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s second operand: " + tokens);
                    }
        
                    //parse any other expressions
                    while (tokens.hasToken() && (!(tokens.peekToken() === ")"))) {
                        result.addSubTree(getExp(tokens));
                    }
                }
                else if ((tk === "/") || (tk === "%") || (tk === "^")) {
                    //parse the first expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
                    }
                    else {
                        throw new ParseError("expected " + tk + "'s first operand: " + tokens);
                    }
        
                    //parse a second expression
                    if (tokens.hasToken()) {
                        result.addSubTree(getExp(tokens));
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
                    console.log("called from getAexp");
                    throw new ParseError("expected ')': " + tokens);
                }
        
                return result;
            }//getAexp()
    
            return {
                'parse': parse,
            };
    }]);
})();