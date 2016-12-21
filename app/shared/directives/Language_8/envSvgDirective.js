(function(){
    'use strict';
    angular
        .module('astInterpreter')
        .directive('envSvgL8', function(){
                return {
                    'restrict': 'E',
                    'replace': true, 
                    'template': '<div id="envBase"><svg id="sBase" viewBox="0 0 250 300"><defs id="definitions"></defs></svg></div>',
                    'link': function(scope, element, attrs ){
                        
                        var envCount = 0;
                        var totalHeight = 0;
                        var emptyEnv = 30; //height of an empty env
                        var xWidth = 150; //width of all envs
                        var xMargin = 10;
                        var yMargin = 10; //bottom y Margin
                        var varAddedHeight = 25; //extention of the length of an environment when a new variable is pushed to it.
                        var closureCount = 0;
                        
                        
                        //Use this API to make moving svg env elements easier
                        
                        function getWidth() {
                            return xWidth;  // this is just a wrapper for xWidth
                        }
                        function getHeight(envId) {
                            return Number(d3.select('#rect' + envId).attr('height')); //note that this returns a String; can be coerced to a Number.
                                                                                 // 12/20/16: this caused errors so it is being cast as a Number explicitly.
                        }
                        
                        function getXLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.e;
                        }
                        
                        function getYLocation(envId) {
                            return Snap('#env' + envId).transform().localMatrix.f;
                        }
                        
                        function setXLocation(envId, dx) {
                            Snap('#env' + envId).transform('translate(' + (getXLocation(envId) + dx) + ' '
                                                           + getYLocation(envId) + ')');
                        }
                        
                        function setYLocation(envId, dy) {
                            Snap('#env' + envId).transform('translate(' + getXLocation(envId) + ' '
                                                           + (getYLocation(envId) + dy) + ')');
                        }
                        
                        function setXYLocation(envId, dx, dy) {
                            setXLocation(envId, dx);
                            setYLocation(envId, dy);
                        }
                        
                        
                        
                        
                        
                        
                        function pushTriangles(currentEnv, count) {
                            while (currentEnv < count) {
                                console.log(currentEnv);
                                var oldHeight = Snap('#pointer' + currentEnv).transform();
                                Snap('#pointer' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        function pushEnvs(currentEnv, count) {
                            while (currentEnv <= count) {
                                //console.log(currentEnv);
                                var oldHeight = Snap('#env' + currentEnv).transform();
                                Snap('#env' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                Snap("#sBase").paper.clear(); //reset the env Stack on click of the Visualize data button
                                
                                $(window).ready(function(){
                                    //I have to keep reseting this since the paper.clear() call above deletes this important element.
                                    //this sets up the arrowheads for the links
                                    //template for the arrows in the defs section comes from here: http://bl.ocks.org/mbostoc
                                    var defs = d3.select('#definitions');
                                    defs.append('marker')
                                        .attr('id', 'arrow')
                                        .attr('viewBox', '-10 -5 10 10')
                                        .attr('refX', '-8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L-10,0L0,5');
                                        
                                    defs.append('marker')
                                        .attr('id', 'arrow2')
                                        .attr('viewBox', '0 -5 10 10')
                                        .attr('refX', '8')
                                        .attr('refY', '0')
                                        .attr('markerWidth', '6')
                                        .attr('markerHeight', '6')
                                        .attr('orient', 'auto')
                                        .append('path')
                                        .attr('d', 'M0,-5L10,0L0,5');
                                    //end copied code
                                });
                                envCount = 0;
                                totalHeight = 0;
                            }
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
                            
                            //this resets all the text fill colors back to their default color--black
                            //every single time a new animation is triggered.
                            d3.selectAll('.envVar').attr('fill', '#000')

                            
                            
                            if (currentData.name === "envStackPush") {
                                
                                envCount++;
                                
                                var classNum = envCount % 2; //which color the div is
                                console.log(totalHeight);
                                Snap('#sBase')
                                    .group()
                                    .attr('id', 'env' + currentData.data.id)
                                    .attr('transform', 'translate( 0 ' + totalHeight + ' )')
                                    .rect(0, 0, xWidth, emptyEnv)
                                    .addClass('color' + classNum)
                                    .attr('id', 'rect' + currentData.data.id);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xWidth / 2, 15, currentData.data.label)
                                    .attr({         //^ this is how far down from the top of the environment we want the name to be.
                                        "text-anchor": 'middle',
                                        'dy': '.35em',
                                    });
                                    
                                    
                                Snap('#env' + currentData.data.id)
                                    .line(xMargin, 22, xWidth - xMargin, 22)
                                    .attr({
                                        stroke: '#000',
                                        strokeWidth: 1,
                                    });
                                    
                                    
                                totalHeight += emptyEnv;
                                  console.log(totalHeight);  
                                if (envCount > 1) {
                                    //add the triangular pointer between envs
                                    console.log("Current data id and total height, respectively:")
                                    console.log(currentData.data.id);
                                    console.log(totalHeight);
                                    Snap('#sBase' )
                                        .group()
                                        .polygon(65, 0 , 75, 7.5, 85, 0)
                                        .addClass('color' + ((envCount - 1) % 2))
                                        .attr('id', 'pointer' + (currentData.data.id - 1))
                                        .attr('transform', 'translate( 0 ' + ( totalHeight - Snap('#rect' + (currentData.data.id)).attr('height') - 1 ) + ')')
                                        
                                }
                                       
                                ///the code below is only executed if a function env is added to the stack
                                //this code draws the ep link on the web page using a Bezier curve.
                                
                                if (currentData.data.epId) {
                                    
                                    //all rects start at (0,0) in their respective coordinate space.
                                    
                                    var ep = currentData.data.epId;
                                    console.log("The ep id is: " + ep);
                                    var startEPHeight = getYLocation(ep); //Snap('#env' + ep).transform().localMatrix.e;
                                    var endEPHeight = getHeight(ep); //Snap('#rect' + ep).attr('height');
                                    
                                    var startCurrentEnvHeight = totalHeight - getHeight(currentData.data.id); //Snap('#rect' + (currentData.data.id)).attr('height');
                                    
                                    var endCurrentEnvHeight = totalHeight;
                                    
                                    console.log("The value of endEPHeight is: " + endEPHeight);
                                    console.log("The value of startEPHeight is: " + startEPHeight);
                                    
                                    //note: p1 < p2 --- (always) 
                                    var p1 = (startEPHeight + endEPHeight) / 2; //midpoint of the ep env (on the y-axis)
                                    var p2 = Math.floor((startCurrentEnvHeight + endCurrentEnvHeight ) / 2); //mid point of the starting env (on the y-axis)
                                    
                                    var test = (startEPHeight + endEPHeight) / 2;
                                    console.log("The value of test is: " + test);
                                    console.log("The value of p1 is: " + p1);
                                    console.log("The value of p2 is: " + p2);
                                    
                                    var arch = (p2 - p1) / 2;
                                    //note: I am subtracting 1 off the xWidth to
                                    //keep us just inside the right edge of the rect
                                    console.log("Setting up the env line link");
                                    
                                    if (getXLocation(ep) === 0) {
                                        //env on the stack
                                        
                                        var currentGroup = d3.select('#sBase').append('svg:g').attr('id', 'g' + currentData.data.id);
                                            currentGroup
                                                .append('svg:path')
                                                .attr('d', 'M' + (xWidth - 1) + ','
                                                  + p1 + 'Q' + (xWidth - 1 + arch) + ','
                                                  + ((p1 + p2) / 2) + ',' + (xWidth - 1)
                                                  + ',' + p2)
                                                .attr('class', 'epLine')
                                                .attr('id', 'link' + currentData.data.id)
                                                .attr('marker-start', 'url(#arrow)');
                                            
                                            currentGroup
                                                .append('svg:text')
                                                .attr('text-anchor', 'middle')
                                                .attr('dy', '-.15em')
                                                .append('svg:textPath')
                                                .attr('startOffset', '50%')
                                                .attr('xlink:href', '#link' + currentData.data.id)
                                                .text('EP');
                                                
                                        
                                         
                                        //code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    else{
                                        
                                        
                                        var group = d3.select('#sBase').append('svg:g');
                                        
                                        group.append('svg:path')
                                            .attr('d', 'M' + (xWidth - 1) + ',' + p2 + 'Q'
                                                             + ((getXLocation(ep) + xWidth ) / 2 )
                                                             + ',' + ((p1 + p2) / 2) + ','
                                                             + (getXLocation(ep) + 1) + ','
                                                             + (getYLocation(ep) + ( getHeight(ep) * 0.25)) )
                                            .attr('class', 'epLine')
                                            .attr('id', 'link' + currentData.data.id)
                                            .attr('marker-end', 'url(#arrow2)');
                                        
                                        group.append('svg:text')
                                             .attr('id', 'text' + currentData.data.id)
                                             .attr('text-anchor', 'middle')
                                             .attr('dy', '-.15em')
                                             .append('svg:textPath')
                                             .attr('startOffset', '50%')
                                             .attr('xlink:href', '#link' + currentData.data.id)
                                             .text('EP');
                                             
                                        ////code template comes from here: http://bl.ocks.org/mzur/b30b932d1b9544644abd
                                        //d3.select('#link' + currentData.data.id)
                                        //    .append('svg:text')
                                        //    .attr('text-anchor', 'middle')
                                        //    .append('svg:textPath')
                                        //    .attr('startOffset', '50%')
                                        //    .attr('xlink:href', '#link' + currentData.data.id)
                                        //    .text('EP');
                                    }
                                    
                                        
                                    
                                }
                            }
                            
                            else if (currentData.name === "envAdd") {
                                
                                
                                var currentHeight = parseInt(Snap('#rect' + currentData.data.id).attr('height'), 10);
                                //console.log('The current height of the previous rect is');                   // ^ base to convert numbers to.  
                                //console.log(currentHeight);
                                var newHeight = currentHeight + varAddedHeight;
                                Snap('#rect' + currentData.data.id)
                                    .attr('height', newHeight);
                                    
                                Snap('#env' + currentData.data.id)
                                    .text(xMargin, newHeight - yMargin, currentData.data.value)
                                    .addClass('envVar')
                                    .attr({
                                        'dy': '.35em',
                                    });
                                
                                totalHeight += varAddedHeight;
                                pushEnvs(currentData.data.id + 1, envCount);
                                pushTriangles(currentData.data.id, envCount);
                                console.log(totalHeight);
                            }
                            else if (currentData.name === "envSearch") {
                                //Note on using SVG text elements:
                                //use the 'fill' attribute to color text rather than the 'stroke' attribute
                                // see this tutorial as an example: https://www.dashingd3js.com/svg-text-element
                                
                                //thanks to this SO answer for explaining how hth-child works: http://stackoverflow.com/a/29278310
                                //Original Poster (OP): http://stackoverflow.com/questions/29278107/d3js-how-to-select-nth-element-of-a-group
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').attr({'fill': currentData.data.color});
                            }
                            
                            else if (currentData.name === "envUpdate") {
                                
                                Snap('.envVar')
                                    .attr({
                                        'fill': '#000'
                                    });
                                    //need to offset by 3 due to the way svg is displayed on the page.
                                
                                //don't know of a way to set the innerSVG of an SVG element using Snap.svg
                                d3.select('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')').text(currentData.data.value);
                                Snap('#env' + currentData.data.id + '>text:nth-child(' + (currentData.data.childRank + 3) + ')')
                                    .attr({
                                        'fill': currentData.data.color,
                                    });
                                
                            }
                            
                            else if (currentData.name === "envStackPop") {
                                
                                var closure = currentData.data.closure;
                                
                                if (!closure) {
                                    Snap('#link' + currentData.data.id).remove(); //delete the EP link from the viz
                                    Snap('#text' + currentData.data.id).remove(); //delete the text associated with the EP link from the viz
                                    Snap('#env' + currentData.data.id).remove(); //delete the unneeded environment
                                    
                                }
                                else {
                                    //TODO: implement the closure visualization.
                                    closureCount++;
                                    
                                    var EP = Snap('#env' + epId);
                                    var epId = currentData.data.epId;
                                    //var startHep = EP.transform().localMatrix.e;
                                    var startHep = getYLocation(epId); 
                                    var endHep = startHep + getHeight(epId); 
                                    
                                    var yEPQuarter = startHep + Math.floor((endHep - startHep) / 4);
                                    var xlocEP = getXLocation(epId) + getWidth() - 1;
                                    
                                    var childEP = currentData.data.id;
                                    //childEP.transform('translate(' + childEP.transform.localMatrix.e + ' ' + 300); //push the env out 300 units in the +x direction.
                                    setXLocation(childEP, closureCount % 2 === 0 ? -300: 300); // this determines which side of the stack the closure sits.
                                    
                                    totalHeight -= (endHep - startHep); //reclaim the space on the stack where the current env--now a closure--sat.
                                    
                                    var xEndChildEP = getXLocation(childEP) + getWidth(childEP);
                                    
                                    //Snap('#link' + currentData.data.id).attr('d', 'M' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1)  + ' Q'
                                    //                                         + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                    //                                         + ', ' + xlocEP + ',' + yEPQuarter);
                                    
                                    d3.select('#link' + currentData.data.id)
                                        .attr('d', 'M' + xlocEP + ',' + yEPQuarter
                                                       + ' Q' + ((getXLocation(childEP) + xlocEP) * (2 / 3) ) + ',' + ((getYLocation(epId) + getYLocation(childEP)) / 2)
                                                       + ' ' + ((getXLocation(childEP) + xEndChildEP) / 2) + ', ' + (getYLocation(childEP) + 1) );
                                        
                                    d3.select('#g' + currentData.data.id)
                                        .append('svg:text')
                                        .attr('text-anchor', 'middle')
                                        .attr('dy', '-.15em')
                                        .append('svg:textPath')
                                        .attr('startOffset', '50%')
                                        .attr('xlink:href', '#link' + currentData.data.id)
                                        .text('EP');
                                        
                                    
                                }
                                
                                
                                Snap('#pointer' + (currentData.data.id - 1)).remove();
                                envCount--;
                            }
                        });
                    }
                }
        });
    
})();