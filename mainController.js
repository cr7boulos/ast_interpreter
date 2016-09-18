"use strict";

angular
    .module('astInterpreter')
    .controller('mainController',['$scope', function($scope){
            var animationFunctionData = []; //stores objects relating
                                            //relating to animation
            
            $scope.editing = true;// this determines if the editor is revealed or the pretty-printed code.
            
            this.editing = function(){
                $scope.editing = !$scope.editing;
                console.log($scope);
            }
            
            this.resetAnimationData = function(){
                animationFunctionData = [];
            }
            
            this.getAnimationData = function(){
                return animationFunctionData;
            }
            
            var self = this;
            //self.editorContent = "hello world";
            this.editorContent = null;
            var tree;
            self.tree = tree;
            
            var result;
            
            this.getAnim = function(){
                return animationFunctionData;
            }
            
            this.getResult = function(){
                return result;
            }
            
            this.setResult = function(value){
                result = value;
            }
            
            this.getCurrentAnimObject = function(){
                return animationFunctionData[$scope.index];
            }
            this.addAnimationData = function(obj){
                animationFunctionData.push(obj);
            }
            
            this.getIndex = function(){
                return $scope.index;
            }
            
            this.animationReady = false;
            
            $scope.index = -1; //this allows the animations to begin when the variable is incremented to 0
            
            this.resetIndex = function(){
                $scope.index = -1;
            }
            
            this.incrementIndex = function(){
                if ($scope.index < animationFunctionData.length) {
                        $scope.index++;
                }
            }
            
            this.decrementIndex = function(){
                if ($scope.index > 0) {
                        $scope.index--;
                }
            }
            
            this.animate = function(){
                if (animationFunctionData[$scope.index].name === "nodeTraversal") {
                        animateNode(animationFunctionData[$scope.index].data);
                }
            }
            
            self.setContent = function(content){
             self.editorContent = content;
            }
            
            self.getContent = function(){
              return self.editorContent;
            }
            
            this.nextAnimation = function(){
              
              if ($scope.index < animationFunctionData.length) {
                  $scope.index++;
              }
            }
            this.previousAnimation = function(){
              if ($scope.index > 0 ) {
                  $scope.index--;
              }
            }
            
            this.executeAnimation = function(){
              animationFunctionData[$scope.index]();
            }
            
            this.resetAnimations = function(){
                animationFunctionData = [];
            }
            
            this.setAST = function(ast){
                tree = ast;
            }
            
            this.getAST = function(){
                return tree;
            }
            
            
            
    }]);