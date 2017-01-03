(function(){
    'use strict';

    /*
        4.a 
            This AST directive watches the 'data' attribute for changes
            and then transforms our AST into a format that D3 can understand.
            Once transformed, the AST is nicely displayed via the capabilities of D3. 
            This directive also handles highlighting the various nodes of the AST as they 
            are traversed by the interpreter. This is the final stage of this branch in the 
            data pipeline. Please return to the previous stage (3.a) for details on viewing the 
            other branch in the pipeline.
     */

angular
    .module('astInterpreter')
    .directive('d3AstL8', /*Inject dependencies here*/ ['ast2JsonFactory',
        function( ast2JsonFactory){
        return {
            restrict: 'E',
            replace: true,
            template: '<div id="ast" ng-show="astVisible" class="astLanguage-6_8"></div>',
            
            link: function(scope, element, attrs){

            //code for building the d3 tree comes from here: http://bl.ocks.org/robschmuecker/7880033
               
            /*Copyright (c) 2013-2016, Rob Schmuecker
            All rights reserved.
            
            Redistribution and use in source and binary forms, with or without
            modification, are permitted provided that the following conditions are met:
            
            * Redistributions of source code must retain the above copyright notice, this
              list of conditions and the following disclaimer.
            
            * Redistributions in binary form must reproduce the above copyright notice,
              this list of conditions and the following disclaimer in the documentation
              and/or other materials provided with the distribution.
            
            * The name Rob Schmuecker may not be used to endorse or promote products
              derived from this software without specific prior written permission.
            
            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
            AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
            IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
            DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
            INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
            BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
            DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
            OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
            NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
            EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
            
            //Modified by Daniel Boulos 8/30/16
                
                var ast;
                var root;
                
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
                    //baseSvg.selectAll("*").remove();
                    
                    
                    root = hier[0];
                    root.x0 = viewerHeight;
                    root.y0 = 0;
                    update(root); //the functions update and centerNode are declared below and are hoisted 
                    centerNode(root); // as per JS standards and are thus invocable from here.
                    
                    
                    
                });
                
                
                
        
                // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width() / 2;
    var viewerHeight = $(document).height();

    var tree = d3.layout.tree()
        .size([viewerWidth, viewerHeight ]);
        

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.x, d.y]; //swapped y and x
        });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    


    

    // Define the zoom function for the zoomable tree 

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);



    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#ast").append("svg")
        .attr('id', 'astSvg')   
        .attr("width", viewerWidth)
        .attr("height", "100%")// changed from viewerHeight
        .attr("class", "overlay")
        .call(zoomListener);


    

   // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        var scale = zoomListener.scale();
        var x = -source.y0; //swapped these two; should these be swapped?
        var y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 200; // still need to work on the proper spacing b/t nodes D.B 9/2/16
        
        // Call visit function to establish maxLabelLength
        visit(source, function(d) {
            totalNodes++;
            maxLabelLength = Math.max(d.name.length, maxLabelLength);
    
        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : null;
        });
        
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root), //might need to rm the reverse() call
            links = tree.links(nodes);
console.log(source);
        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = d.depth * 100;
            //d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
            //d.x = (d.depth * (maxLabelLength * 10));
        });

        // Update the nodes
        var node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

         //Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.x0 + "," + source.y0 + ")"; //try switching y0 and x0
            })
            /*.on('click', click)*/; //this click handler is disabled since it introduces bugs into my program
        
        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("y", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("y", function(d) { //changed x to y so the labels are above and below nodes
                return d.children || d._children ? -15 : 15;
            })
            //.attr("text-anchor", function(d) {
            //    return d.children || d._children ? "end" : "start";
            //})
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("id", function(d){
                return   "node" + (d.id - 1); 
            })
            .attr("r", 4.5) // add my node class so that the nodeTraversal works
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; //switching x and y allows for a vertical tree
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")"; //switching x and y allows for a vertical tree
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links�
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");
    //end copied code
                            
                
                    
                //handles animation of the generated ast diagram.
                
                scope.$watch("index", function(){
                 var currentData = scope.main.getCurrentAnimObject();
                 if(currentData.name === "nodeTraversal"){
                 
                   console.log(currentData); //change the class name Update
                   d3.selectAll(".nodeCircle") //removes all previous 
                     .style("fill", "#fff"); //formatting by coloring all nodes white
                     
                   d3.select("#" + "node" + currentData.data.id)
                     .style("fill", currentData.data.color);
                    
                 }
                }, true);
                
                scope.$watch("editing", function(newValue, oldValue){
                    if (!scope.editing) {
                        $(document).ready(function(){
                            d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth );
                            
                        });
                        
                    }
                    else{
                        $(document).ready(function(){
                            d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              document.getElementById('editor').offsetWidth - 5);
                            
                        });
                        
                        
                    }
                });
                
                //cite this event handler code from  here: http://www.tivix.com/blog/data-viz-d3-and-angular/
                angular.element(window).on('resize', function(){
                    if (scope.editing) {
                        
                        d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              document.getElementById('editor').offsetWidth -
                                              document.getElementById('envBase').offsetWidth -
                                              (angular.element(window)[0].innerWidth * 0.05) - 5);
                    }
                    else{
                        
                        d3.select('#astSvg').attr('width', angular.element(window)[0].innerWidth -
                                              
                                              document.getElementById('envBase').offsetWidth -
                                              (angular.element(window)[0].innerWidth * 0.05) - 5);
                       
                    }
                    
                });
                    
                },
        };
    }]);

})();


