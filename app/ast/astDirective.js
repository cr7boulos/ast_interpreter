'use strict';

angular
    .module('astInterpreter')
    .directive('d3Ast', /*Inject dependencies here*/ ['tokenizerFactory', 'buildTreeFactory',
            'ast2JsonFactory', function(tokenizerFactory, buildTreeFactory, ast2JsonFactory){
        return {
            scope: {
                data: '='
            },
            restrict: 'E',
            replace: true,
            template: '<div id="ast"></div>',
            link: function(scope, element, attrs){
                //copied the d3 code from here https://gist.github.com/d3noob/8326869 for testing
                
                    var Tokenizer = tokenizerFactory.Tokenizer;
                    var BuildTree = buildTreeFactory.BuildTree;
                    console.log(attrs);
                    var hier = [];
                    var t = new Tokenizer(attrs.data);
                    var b = new BuildTree(t);
                    var ast = b.getTree();
                    hier.push(ast2JsonFactory.traverse(ast));
                    console.log(d3);
                    d3.layout.hierarchy(hier[0]);
                    // ************** Generate the tree diagram	 *****************
                    var margin = {top: 40, right: 120, bottom: 20, left: 120},
                        width = 1000 - margin.right - margin.left,
                        height = 960 - margin.top - margin.bottom;
                        
                    var i = 0;
                    var tree = d3.layout.tree()
                        .size([height, width]);
                    var diagonal = d3.svg.diagonal()
                        .projection(function(d) { return [d.x, d.y]; });
                    var svg = d3.select("ast").append("svg")
                        .attr("width", width + margin.right + margin.left)
                        .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    //root = treeData[0];
                      var root = hier[0];
                    update(root);
                    function update(source) {
                      // Compute the new tree layout.
                      var nodes = tree.nodes(root),
                          links = tree.links(nodes);
                        console.log(nodes);
                      // Normalize for fixed-depth.
                      nodes.forEach(function(d) { d.y = d.depth * 100; });
                      // Declare the nodes
                      var node = svg.selectAll("g.node")
                          .data(nodes, function(d) { return d.id || (d.id = ++i); });
                      // Enter the nodes.
                      var nodeEnter = node.enter().append("g")
                          .attr("class", "node")
                          .attr("id", function (d) {
                              return d.id;
                          })
                          .attr("transform", function(d) { 
                              return "translate(" + d.x + "," + d.y + ")"; });
                      nodeEnter.append("circle")
                          .attr("r", 10)
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
                    }
                },
        };
    }]);