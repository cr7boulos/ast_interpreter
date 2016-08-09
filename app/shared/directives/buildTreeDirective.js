angular
    .module('astInterpreter')
    .directive('buildTree',  function(){
                return {
                    restrict: 'A',
                    replace: true,
                    
                    
                    
                    
                    link: function(scope, element, attrs, buildTreeController){
                        
                        //scope.main.setAST(buildTreeController.createAST(attrs.buildTree));
                        attrs.$observe('editorcontent', function(newContent){
                            console.log(newContent);
                        });
                    }
                };
    });