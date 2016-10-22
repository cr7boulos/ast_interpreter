# ast_interpreter
AngularJS app for visualizing an AST-walking interpreter

Before clicking the link below, it is strongly recommended that you read the sections "Demo website" and "Language Definition" of this README in their entirety below visiting the accompanying demo site. This is project is very much in development and some features are not yet properly documented :)

The pre-built demo website can be viewed [here](https://cr7boulos.github.io/ast_interpreter/) 

## Requirements
* NodeJS 
* npm

## Installation
1. Clone this repo via `git clone https://github.com/cr7boulos/ast_interpreter.git` or download the zip file. 
2. From the root folder run `npm install` then `bower install`. 
3. Next run `cd bower_components/monaco-editor-samples` and execute `npm install` to grab the
dependencies for the text editor.
4. Lastly, open the `index.html` page in the root folder to view the app.

## Demo Website
The interactive website is designed to visualize the data structures used by the interpreter, namely, the Abstract Syntax Tree (AST) and the environments holding all variables. The leftmost pane is a text editor; enter a *__syntactically correct__* program (see the "Language Definition" section below for more details) into it and then click the "Visualize Program" button above the editor--A demo program is preloaded into the editor by default and is all set for visualization. After clicking "Visualize Program", the center pane houses the resulting tree graph displaying all the nodes of the AST, and supports panning and zooming. The right-most pane is populated with a link of nested environments ( I am still working on properly styling this part of the visualization) as the program steps through the visualization sequence. The "Advance" button on the right is used to step through the event sequence of the visualization (keep clicking until you are sure there are no more events). Various things light up throughout the event sequence. See the table below for more details.

| Event | Details |
| --- | --- |
| Node color: green | token was evaluated by interpreter |
| Node color: green | boolean expression evaluated to TRUE |
| Node color: red | boolean expression evaluated to FALSE |
| Environment variable color: green | interpreter performed a successful lookup of a variable i.e the variable is defined |
| Environment variable color: red | variable contents were updated |
| Environment variable color: yellow | interpreter traversed this variable, but it is not the one sought after |

If you encounter a feature that renders the visualization inoperable, the only option is to refresh the page.


## Language Definition
This interpreter evaluates a custom language similar in syntax to [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language))

To make tokenizing the language simple, all tokens must have at least one white space character between them (returns and tabs are also allowed; thus enabling the user to nicely format their code). For example, this is how the language syntactically defines a variable declaration `( var x 10 )`. And a more complicated example that demostrates custom formatting: 
```
  ( while ( > x 10 ) 
    ( set x ( - x 1 ) )
  )
```
Also note that all arithmetic and boolean expressions are in prefix notation. With that by way of examples here is the formal grammar of the language:
                  
Language Grammar Credit: [Roger Kraft](http://math.purduecal.edu/~rlkraft/roger.html)
```
              
        A Language of Expressions with Global Functions
    
An expression in this language is defined by the following grammar.

       Prog ::= Exp
              | '(' 'prog' (Fun | Exp)+ Exp ')'

        Fun ::= '(' 'fun' VARIABLE Lambda ')'   // a function declaration

     Lambda ::= '(' 'lambda' VARIABLE* Exp ')'  // formal parameters followed by function body

        Exp ::= Apply
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

      Apply ::= '(' 'apply' Exp Exp* ')'    // function value followed by actual parameters

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

    INTEGER ::= [0-9]+
    BOOLEAN ::= 'true' | 'false'
    VARIABLE ::= [a-zA-Z][a-zA-Z0-9]*
```    


