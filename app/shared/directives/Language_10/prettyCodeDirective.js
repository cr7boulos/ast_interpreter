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