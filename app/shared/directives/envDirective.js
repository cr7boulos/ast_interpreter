(function(){
    angular
        .module('astInterpreter')
        .directive('envStack', function(){
                return {
                    'restrict': 'E',
                    'replace': true,
                    'template': '<div id="envBase"></div>',
                    'link': function(scope, element, attrs ){
                        scope.$watch('index', function(){
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            if (currentData.name === "envStackPush") {
                                
                                var envStack = d3.select("#envBase");
                                envStack
                                    .append("div")
                                    .attr("id", "env" + currentData.data.id)
                                    .attr("class", "alert alert-info")
                                    .text(currentData.data.label);
                            }
                            
                            else if (currentData.name === "envAdd") {
                                console.log("#env" + currentData.data.id);
                                var envStack = d3.select("#env" + currentData.data.id);
                                envStack
                                    .append("p")
                                    .text(currentData.data.value);
                            }
                            else if (currentData.name === "envSearch") {
                                var envStack = d3.select("#env" + currentData.data.id);
                                console.log(envStack);
                                envStack
                                    .select("p:nth-child(" + currentData.data.childRank + ")")
                                    .style("color", currentData.data.color);
                            }
                        });
                    }
                }
        });
    
})();
