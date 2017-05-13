(function(){
    'use strict';
    angular
        .module('astInterpreter')
        .directive('envSvg', function(){
                return {
                    'restrict': 'E',
                    'replace': true,
                    'template': '<div id="envBase" class="envBase-l0-l9"><svg id="sBase" viewBox="0 0 150 300"></svg></div>',
                    'link': function(scope, element, attrs ){
                        
                        var envCount = 0;
                        var totalHeight = 0;
                        var emptyEnv = 30; //height of an empty env
                        var xWidth = 150; //width of a single env
                        var xMargin = 10;
                        var yMargin = 10; //bottom y Margin
                        var varAddedHeight = 25; //extention of the length of an environment when a new variable is pushed to it.
                        
                        function pushTriangles(currentEnv, count) {
                            //there are one fewer triangle pointers than there are environments
                            while (currentEnv < count - 1) {
                                console.log("Current triangle");
                                console.log(currentEnv);
                                var oldHeight = Snap('#pointer' + currentEnv).transform();
                                Snap('#pointer' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log("Env count");
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        function pushEnvs(currentEnv, count) {
                            while (currentEnv < count) {
                                console.log("Current env");
                                console.log(currentEnv);
                                var oldHeight = Snap('#env' + currentEnv).transform();
                                Snap('#env' + currentEnv).transform('translate( 0 ' + (oldHeight.localMatrix.f + varAddedHeight) + ')');
                                console.log("Env count");
                                console.log(count);
                                //Snap('#pointer' + currentEnv).attr('height', oldHeight + 15);
                                currentEnv++;
                            }
                        }
                        
                        scope.$watch('index', function(newValue){
                            if (newValue === -1) {
                                Snap("#sBase").paper.clear(); //reset the env Stack on click of the Visualize data button
                                //console.log(envCount);
                                envCount = 0;
                                totalHeight = 0;

                               
                            }

                            //this resets all the text fill colors back to their default color--black
                            //every single time a new animation is triggered.
                            d3.selectAll('.envVar').attr('fill', '#000');
                            
                            var currentData = scope.main.getCurrentAnimObject();
                            console.log(currentData);
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
                                        fill: '#000',
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
                                //var envStack = d3.select("#env" + currentData.data.id);
                                //console.log(envStack);
                                //envStack.remove();
                                Snap('#env' + currentData.data.id).remove();
                                Snap('#pointer' + (currentData.data.id - 1)).remove();
                                envCount--;
                            }
                        });
                    }
                }
        });
    
})();