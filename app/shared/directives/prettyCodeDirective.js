(function(){

    /*
        3.b 
            This stage of the data pipeline watches the 'editorcontent'
            attribute for any changes. When changes are made, this 
            directive checks if the app is in a 'not-editing' state.
            If so, the code editor is suppressed from view and in its place 
            a pretty-printed version of the editor's contents are rendered in
            the view. This is the last stage of this branch in the data pipeline.
            Please return to stage 2 for details on how to view the other branch 
            of the data pipeline.
     */
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
                                        // I could use the $compile service in angular to build the HTML string...
                                        
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
                                               //change nodeTraversal color from yellow to a higher contrast color in evaluateFactory.js
                                            }
                                        }
                                }, true);
                                        
                                
                                
                            },
                        }
                }]);
                
})();