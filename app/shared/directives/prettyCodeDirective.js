(function(){
"use strict";
            angular
                .module('astInterpreter')
                .directive('prettyCode', ['prettyPrinterFactory', function(prettyPrinterFactory){
                        return {
                            restrict: 'E',
                            replace: true,
                            require: 'prettyCode',
                            template: '<div id="prettyCode" ng-show="!editing"><pre>{{prettyCode}}</pre></div>',
                            controller: function($scope){
                                //this.prettyCode = prettyPrinterFactory.prettyPrint($scope.main.getContent());
                            },
                            
                            link: function(scope, element, attrs, pController){
                                scope.prettyCode = "";
                                attrs.$observe('editorcontent', function(newContent){
                                        scope.prettyCode = prettyPrinterFactory.prettyPrint(scope.main.getAST());
                                        
                                    });
                                
                                console.log(scope);
                            },
                        }
                }]);
                
})();