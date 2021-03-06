
(function(){
    'use strict';

    /*
        2. This is the second stage of the data pipeline. All the 
            contents in the editor are saved via the save function (see below) 
            to a variable and made accessible to the HTML page 
            via the 'editorcontent' attribute on the d3-ast tag.
            Components that make use of this information have watchers set to the 
            'editorcontent' attribute so that when the contents of the
            editor are updated, the aforementioned components are
            notified. At the time being, two components watch the 
            'editorcontent' attribute: the 'pretty-code' tag
            ( an Angular tag directive) and the 'build-tree' attribute
            ( an Angular attribute directive). Note: the build-tree directive is
            sometimes suffixed by -l* with the * denoting the current language selected.
            e.g. : build-tree-l8. Thus, this is would be the directive that builds trees for language 8 

            To view the next stage in the data pipeline,
            open one of these two files: 
                 app/shared/directives/prettyCodeDirective.js
                 app/shared/directives/Language_8/buildTreeDirective.js
     */

angular
    .module('astInterpreter')
    .directive('monacoEditor', function () {
        return {
                restrict: 'E',
                replace: true,
                //reset scope.index to zero so that the animation starts from the root of every AST
                template: '<div id="editor" ng-show="editing" ></div>',
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
                        var langExample = "";
                        switch (scope.language){
                            case 6:
                                langExample = "( prog \n\t" +
                                "( var i 5 ) \n\t" +
                                "( while ( > i 0 ) \n\t\t" +
                                "( set i ( - i 1 ) ) ) \n)";
                                break;
                            case 7:
                                langExample = "( prog \n\t" +
                                "( var w 10 ) \n\t" +
                                "( fun f ( lambda x ( * x x ) ) ) \n\t" +
                                "( var z ( begin \n\t\t\t\t" +
                                            "( var x 0 ) \n\t\t\t\t" +
                                            "( begin ( var y 2 ) \n\t\t\t\t" +
                                                    "( begin \n\t\t\t\t\t" +
                                                    "( set x w ) \n\t\t\t\t\t" +
                                                    "( apply f ( + x y ) ) ) ) ) ) " + "z \n)";
                                break;
                            case 8:
                                langExample = "( prog\n\t" +
                                "( var x 100 ) \n\t" +
                                "( fun f ( lambda x ( begin \n\t\t\t" +
                                                        "( fun g ( lambda y ( + y x ) ) ) \n\t\t\t" +
                                                        "g ) ) ) \n\t" +  // return g
                                "(var t ( apply ( apply f 5 ) 100 ))\n)";
                                break;
                            case 9:
                                langExample = "( prog \n\t" +
                                "( fun g ( lambda h ( apply h 5 ) ) ) \n\t" +
                                "(var y ( apply g ( lambda x ( * x x ) ) ) ) \n)";
                                break;
                            case 10:
                                langExample = "( prog\n\t" +
                                "( fun reduce \n\t\t" +
                                    "( lambda  op lst \n\t\t" +  // op is a function, lst is a non-empty list
                                        "( if ( empty? ( cdr lst ) ) \n\t\t\t" +
                                            "( car lst ) \n\t\t\t" +
                                            "( apply op ( car lst ) ( apply reduce op ( cdr lst ) ) ) ) ) ) \n\t" +
                                "( var x ( apply reduce ( lambda x y ( + x y ) ) ( list 1 2 3 4 5 6 7 ) ) ) \n\t" +
                                "( var y ( apply reduce ( lambda x y ( * x y ) ) ( list 1 2 3 4 5 6 7 ) ) ) \n)";
                                break;
                        }
                        mController.editor = monaco.editor.create(element[0] /*the editor is the second element of the  nested <div>*/, {
                            value: langExample,
                            language: 'myCustomLanguage'
                        });

                        // TODO: the default program should be loaded into the editor depending on which language is user
                        // currently working with. 

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
                        
                        //this function is called by the first stage of 
                        // the data pipeline and makes the contents of the 
                        // editor available for all components to see.
                        mController.save = function(){
                            
                            
                            var prettifyContent = function(str){
                                //this function allows users to format the code in the editor
                                //to make it ledgible yet still remain parsable by the interpreter.
                                
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
                        scope.$watch("editing", function(){
                            if (scope.editing) {
                                var v = scope.mco.editor.getValue();
                                //Note: since jQuery is loaded, angular.element is an simply an
                                //alias for jQuery
                                console.log(v);
                                angular.element('#editor').children().remove(); //get rid of the current editor
                                    $(document).ready(function(){
                                        scope.mco.editor = monaco.editor.create(element[0] /*the editor is the second element of the  nested <div>*/, {
                                        value: v, //rebuild the editor so that it spans
                                                    //its holding div when said div resizes
                                        language: 'myCustomLanguage'
                                    });
                                });
                                
                            }
                        });
                        
                        angular.element(window).on('resize', function(){
                            if (scope.editing) {
                                
                                var val = scope.mco.editor.getValue();
                                //Note: since jQuery is loaded, angular.element is an simply an
                                //alias for jQuery
                                
                                angular.element('#editor').children().remove(); //get rid of the current editor
                                scope.mco.editor = monaco.editor.create(element[0] /*the editor is the second element of the  nested <div>*/, {
                                    value: val, //rebuild the editor so that it spans
                                                //its holding div when said div resizes
                                    language: 'myCustomLanguage'
                                });
                            }
                            
                        });
                    
                       
                        
                    });
                },
                controllerAs: "mco",
               
            };

    });

})();

    