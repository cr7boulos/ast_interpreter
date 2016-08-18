'use strict';

angular
    .module('astInterpreter')
    .directive('d3Ast', /*Inject dependencies here*/ ['ast2JsonFactory',
        function( ast2JsonFactory){
        return {
            restrict: 'E',
            replace: true,
            template: '<div id="ast"></div>',
            
            link: function(scope, element, attrs){
                //copied the d3 code from here https://gist.github.com/d3noob/8326869 for testing
                
                var ast;
                var margin = {top: 40, right: 120, bottom: 20, left: 120},
                            width = 1000 - margin.right - margin.left,
                            height = 960 - margin.top - margin.bottom;
                var svg = d3.select("#ast")
                            .append("svg")
                            .attr("width", width + margin.right + margin.left)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                 var i = 0;
                 var tree = d3.layout.tree()
                    .size([height, width]);
                 var diagonal = d3.svg.diagonal()
                    .projection(function(d) { return [d.x, d.y]; });
                    console.log(scope);
                    
                function update(source) {
                          // Compute the new tree layout.
                          var nodes = tree.nodes(source);
                          var links = tree.links(nodes);
                          
                          // Normalize for fixed-depth.
                          nodes.forEach(function(d) { d.y = d.depth * 100; });
                          // Declare the nodes
                          var node = svg.selectAll("g.node")
                              .data(nodes, function(d) { return d.id || (d.id = ++i); });
                          // Enter the nodes.
                          var nodeEnter = node.enter().append("g")
                              .attr("class", "node")
                              
                              .attr("transform", function(d) { 
                                  return "translate(" + d.x + "," + d.y + ")"; });
                          nodeEnter.append("circle")
                              .attr("r", 10)
                              .attr("class", "nodeShapes")
                              .attr("id", function (d) {
                                  return "node" + d.id;
                              })
                              .style("fill", "#fff");
                          nodeEnter.append("text")
                              //.attr("y", function(d) { 
                              //    return d.children || d._children ? -25 : 25; })
                              .attr("y", -25)
                              .attr("dy", ".35em")
                              .attr("text-anchor", "middle")
                              .text(function(d) { return d.name; })
                              .style("fill-opacity", 1);
                          // Declare the links
                          
                          var link = svg.selectAll("path.link")
                              .data(links, function(d) { return d.target.id; });
                          
                          // Enter the links.
                          link.enter().insert("path", "g")
                              .attr("class", "link")
                              .attr("d", diagonal);
                              //console.log(scope);
                }
                            
                attrs.$observe('data', function(newVal){
                    ast = scope.$eval(newVal);
                
                
                    
                    var hier = [];
                    i = 0;
                    hier.push(ast2JsonFactory.traverse(ast));
                    
                    d3.layout.hierarchy(hier[0]);
                    // ************** Generate the tree diagram	 *****************
                    
                    //the idea for clearing the <svg> container after
                    //each render comes from this blog post
                    // www.tivix.com/blog/data-viz-d3-and-angular
                    svg.selectAll("*").remove();
                    
                    
                    var root = hier[0];
                    update(root);
                    
                    
                    
                });
                    
                //handles animation of the generated ast diagram.
                
                scope.$watch("index", function(){
                 var currentData = scope.main.getCurrentAnimObject();
                 //if(currentData.name === "nodeTraversal"){
                 
                   console.log(scope.index);
                   d3.selectAll(".nodeShapes")
                     .style("fill", "#fff"); //remove any previous highlighting
                     d3.select("#" + "node" + scope.index)
                        .style("fill", "#ff0" );//by setting the nodes to white
                    //d3.select(currentData.objData.number)
                    //  .style("fill", "#ff0"); //color red
                 //}
                }, true);
               
                
                    
                },
        };
    }]);