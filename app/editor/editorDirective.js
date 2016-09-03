angular
    .module('astInterpreter')
    .directive('monacoEditor', function () {
        return {
                restrict: 'E',
                replace: true,
                //reset scope.index to zero so that the animation starts from the root of every AST
                template: '<div id="code"><button ng-click="mco.save();main.resetIndex()">Visualize program</button><div id="editor" ></div></div>',
                require: 'monacoEditor',
                controller: function(){
                    this.editor = null;        
                }
                ,
                link: function (scope, element, attrs, mController) {
                    //copied this code from the ms-editor monarch samples file
                    
                    console.log("Editor scope\n");
                    console.log(scope);
                    require.config({ paths: { 'vs': './bower_components/monaco-editor-samples/node_modules/monaco-editor/min/vs' }});
                 
                    require(['vs/editor/editor.main'], function() {
                    
                        monaco.languages.register({
                            id: 'myCustomLanguage'
                        });
                        monaco.languages.setMonarchTokensProvider('myCustomLanguage', {
                        // Set defaultToken to invalid to see what you do not tokenize yet
                        // defaultToken: 'invalid',
                    
                            keywords: [
                                'true', 'false', 'while', 'apply', 'set', 
                                'fun', 'prog', 'if', 'var', 'lambda', 'begin', 
                            ],
                        
                            typeKeywords: [
                                'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'
                            ],
                        
                            operators: [
                                '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
                                '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
                                '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
                                '%=', '<<=', '>>=', '>>>='
                            ],
                        
                            // we include these common regular expressions
                            symbols:  /[=><!~?:&|+\-*\/\^%]+/,
                        
                            // C# style strings
                            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
                        
                            // The main tokenizer for our languages
                            tokenizer: {
                                root: [
                                // identifiers and keywords
                                [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword',
                                                            '@keywords': 'keyword',
                                                            '@default': 'identifier' } }],
                                [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
                        
                                // whitespace
                                { include: '@whitespace' },
                        
                                // delimiters and operators
                                [/[{}()\[\]]/, '@brackets'],
                                [/[<>](?!@symbols)/, '@brackets'],
                                [/@symbols/, { cases: { '@operators': 'operator',
                                                        '@default'  : '' } } ],
                        
                                // @ annotations.
                                // As an example, we emit a debugging log message on these tokens.
                                // Note: message are supressed during the first load -- change some lines to see them.
                                [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
                        
                                // numbers
                                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                                [/\d+/, 'number'],
                        
                                // delimiter: after number because of .\d floats
                                [/[;,.]/, 'delimiter'],
                        
                                // strings
                                [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
                                [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
                        
                                // characters
                                [/'[^\\']'/, 'string'],
                                [/(')(@escapes)(')/, ['string','string.escape','string']],
                                [/'/, 'string.invalid']
                                ],
                        
                                comment: [
                                [/[^\/*]+/, 'comment' ],
                                [/\/\*/,    'comment', '@push' ],    // nested comment
                                ["\\*/",    'comment', '@pop'  ],
                                [/[\/*]/,   'comment' ]
                                ],
                        
                                string: [
                                [/[^\\"]+/,  'string'],
                                [/@escapes/, 'string.escape'],
                                [/\\./,      'string.escape.invalid'],
                                [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
                                ],
                        
                                whitespace: [
                                [/[ \t\r\n]+/, 'white'],
                                [/\/\*/,       'comment', '@comment' ],
                                [/\/\/.*$/,    'comment'],
                                ],
                            },
                        });
                        //end copied code
                        console.log(element);
                        mController.editor = monaco.editor.create(element[0].children[1] /*the editor is the second element of the  nested <div>*/, {
                            value: "( prog \n\t" +
           "( var w 10 ) \n\t" +
           "( fun f ( lambda x ( * x x ) ) ) \n\t" +
           "( var z ( begin \n\t\t\t\t" +
                     "( var x 0 ) \n\t\t\t\t" +
                     "( begin ( var y 2 ) \n\t\t\t\t" +
                            "( begin \n\t\t\t\t\t" +
                               "( set x w ) \n\t\t\t\t\t" +
                               "( apply f ( + x y ) ) ) ) ) ) " + "z \n)",
                            language: 'myCustomLanguage'
                        });
                        var ttt = "( prog " + /*default content*/
                                    "\n\t( fun f ( lambda x ( * x x ) ) ) " +
                                    "\n\t( fun g ( lambda x ( + x ( apply f x ) ) ) ) " +
                                    "( apply g 5 ) \n)";
                        var rrr = "( prog " +
           "( var w 10 ) " +
           "( fun f ( lambda x ( * x x ) ) ) " +
           "( var z ( begin " +
                     "( var x 0 ) " +
                     "( begin ( var y 2 ) " +
                            "( begin " +
                               "( set x w ) " +
                               "( apply f ( + x y ) ) ) ) ) ) " +"z )";
                               
                               var altTest = "( prog \n\t" +
           "( var w 10 ) \n\t" +
           "( fun f ( lambda x ( * x x ) ) ) \n\t" +
           "( var z ( begin \n\t\t\t\t" +
                     "( var x 0 ) \n\t\t\t\t" +
                     "( begin ( var y 2 ) \n\t\t\t\t" +
                            "( begin \n\t\t\t\t\t" +
                               "( set x w ) \n\t\t\t\t\t" +
                               "( apply f ( + x y ) ) ) ) ) ) " + "z \n)";
                               
                               var forLoop = "( prog\n\t" +
                            "( var w 10 )\n\t" +
                            "( while ( > w 5 ) ( set w ( - w 1 ) ) )\n)";
                        
                        mController.save = function(){
                            
                            
                            var prettifyContent = function(str){
                                //this function allows users to adjust the code in the editor
                                //to make it ledgible but remain parsable by the interpreter.
                                
                                var string = str.replace(/\s/g, " "); //turn all tabs, newlines, etc into blank spaces.
                                
                                // Following .replace() snippet comes from StackOverflow
                                //link to original question: http://stackoverflow.com/q/1981349/3286126
                                //Asker: AnApprentice; profile: http://stackoverflow.com/users/149080/anapprentice
                                
                                //link to answer: http://stackoverflow.com/a/1981366/3286126
                                //user who answered the question: BalusC ; profile: http://stackoverflow.com/users/157882/balusc
                                //link to code license: https://creativecommons.org/licenses/by-sa/3.0/legalcode
                                
                                return string.replace(/\s\s+/g, ' '); //merge two+ blank spaces into one blank space.
                            }
                            
                                scope.main.setContent(prettifyContent(mController.editor.getValue()));
                                
                            
                            //console.log(scope.main.getContent()); //for debugging; rm later
                        }
                    
                       
                        
                    });
                },
                controllerAs: "mco",
               
            };

    });
    