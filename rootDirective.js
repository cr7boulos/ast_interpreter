//angular   
//    .module('astInterpreter')
//    .directive('root', function(){
//            return {
//                restrict: 'E',
//                replace: true,
//                scope: true,
//                transclude: true,
//                template: '<div></div>',
//                
//                controller: function(){
//                  var animationCallbacks = [];
//                  var editorContent = '';
//                  var index = 0;
//                  
//                  this.setContent = function(content){
//                    editorContent = content;
//                  }
//                  
//                  this.getContent = function(){
//                    return editorContent;
//                  }
//                  
//                  this.nextAnimation = function(){
//                    
//                    if (index < animationCallbacks.length) {
//                        index++;
//                    }
//                  }
//                  this.previousAnimation = function(){
//                    if (index > 0 ) {
//                        index--;
//                    }
//                  }
//                  
//                  this.executeAnimation = function(){
//                    animationCallbacks[index]();
//                  }
//                  console.log(index);
//                },
//                link: function(scope, element, attrs){
//                    ;
//                },
//            };
//    });