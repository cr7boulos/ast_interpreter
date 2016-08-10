"use strict";

angular
    .module('astInterpreter')
    .controller('mainController', function($scope){
            var animationCallbacks = [];
            
            var self = this;
            self.editorContent = "hello world";
            var tree;
            self.tree = tree;
            
            var index = 0;
            
            self.setContent = function(content){
             self.editorContent = content;
            }
            
            self.getContent = function(){
              return self.editorContent;
            }
            
            this.nextAnimation = function(){
              
              if (index < animationCallbacks.length) {
                  index++;
              }
            }
            this.previousAnimation = function(){
              if (index > 0 ) {
                  index--;
              }
            }
            
            this.executeAnimation = function(){
              animationCallbacks[index]();
            }
            
            this.setAST = function(ast){
                tree = ast;
            }
            
            this.getAST = function(){
                return tree;
            }
            
            
            
    });