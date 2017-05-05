(function(){
    'use strict';
    // 1. This button is the first stage in the flow of 
    // data between the different components in the app.
    // Three actions happen when a user clicks this button:
    //      I. The editor contents are saved to a variable. 
    //     II. The animation sequence is reset to the beginning
    //    III. The app toggles between an editing state and a not-editing state.  
    //         This determines whether the view renders a code editor (editing) or a 
    //         pretty-printed version of the code inputted into the editor (not-editing).
    //
    // The second stage of the data pipeline can be found here:  app/editor/editorDirective.js
    angular
        .module('astInterpreter')
        .directive('visButton', function(){
            return {
                restrict: 'E',
                replace: true,
                controller: function($scope){
                     $scope.text = 'Visualize Program';

                     $scope.$watch('editing', function(newVal, oldVal){
                        
                        if(newVal){
                            //currently in edit mode
                            $scope.text = 'Visualize Program';
                        }
                        else{
                            //we are not editing
                            $scope.text = 'Edit Code';
                        }
                        
                    });
                },
                template: '<button class="btn btn-default" ng-click="mco.save();main.resetIndex();editing = !editing">{{text}}</button>',
                
                
            }
        });


})();