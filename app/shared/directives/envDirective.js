(function(){
    //this code is no longer used in production; remove whenever
    angular
        .module('astInterpreter')
        .directive('envStack', function(){
                return {
                    'restrict': 'E',
                    'replace': true,
                    'template': '<div id="envBase"></div>',
                    'link': function(scope, element, attrs ){
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                d3.select("#envBase").selectAll("div").remove(); //reset the env Stack on click of the Visualize data button
                            }
                            
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
                                    .attr("class", "envVar")
                                    .text(currentData.data.value);
                            }
                            else if (currentData.name === "envSearch") {
                                d3.selectAll(".envVar").style("color", "#fff"); //color all nodes black to remove previous formatting
                                var envStack = d3.select("#env" + currentData.data.id);
                                console.log(envStack);
                                envStack
                                    .select("p:nth-child(" + currentData.data.childRank + ")")
                                    .style("color", currentData.data.color);
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                d3.selectAll(".envVar").style("color", "#fff"); //color all nodes white to remove previous formatting
                                var envStack = d3.select("#env" + currentData.data.id);
                                console.log(envStack);
                                envStack
                                    .select("p:nth-child(" + currentData.data.childRank + ")")
                                    .style("color", currentData.data.color)
                                    .text(currentData.data.value);
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                var envStack = d3.select("#env" + currentData.data.id);
                                console.log(envStack);
                                envStack.remove();
                            }
                        });
                    }
                }
        });
    
})();
