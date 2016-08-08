"use strict";

angular
    .module('astInterpreter')
    .controller('mainController', function(){
            var animationCallbacks = [];
            this.editorContent = 'hello';
            var index = 0;
            
            this.setContent = function(content){
              this.editorContent = content;
            }
            
            this.getContent = function(){
              return this.editorContent;
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
            
    });