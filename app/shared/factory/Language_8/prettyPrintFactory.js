(function(){
//this factory needs a strong unit test!!
'use strict';
angular
        .module('astInterpreter')
        .factory('l8.prettyPrinterFactory', function () {
            
            var counter = 0;

            function prettyPrint2(formatting, tree) {
                var result = "";

                if (tree.depth() === 0) {
                    return formatting + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                }
                else if (tree.depth() === 1) {
                    result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                    for (var i = 0; i < tree.degree() - 1; i++) {
                        result += prettyPrint2(" ", tree.getSubTree(i));
                    }
                    result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                    return result;
                }
                else if (tree.depth() > 1) {
                    if(tree.element === "prog" ||
                        tree.element === "begin") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var x = 0; x < tree.degree() ; x++) {
                            result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(x));
                        }
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "print") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var y = 0; y < tree.degree() - 1; y++) {
                            result += prettyPrint2(" ", tree.getSubTree(y));
                        }
                        result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                        return result;
                    }
                    else if (tree.element === "if") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(1));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(2));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "while") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "        ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "fun") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "lambda") {
                        result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                        for (var t = 0; t < tree.degree() - 1; t++) {
                            result += prettyPrint2(" ", tree.getSubTree(t));
                        }
                        result += "\n" + prettyPrint2(formatting + "    ", tree.getSubTree(tree.degree() - 1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element == "apply") {
                        if(tree.depth() == 2)
                        {
                            result +=  formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var c = 0; c < tree.degree() ; c++) {
                                result += prettyPrint2(" ", tree.getSubTree(c));
                            }
                            return result + " )";
                        }
                        else
                        {
                            //TODO: Implement this feature
                            return "Needs to be Implemented 1";
                        }
                    }
                    else if(tree.element === "var" ||
                            tree.element === "set") {
                        if (tree.depth() === 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += prettyPrint2(" ", tree.getSubTree(1)) + " )";
                            return result;
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                            return result + "\n" + formatting + ")";

                        }
                    }
                    else if(tree.element === "+" ||
                            tree.element === "-"  ||
                            tree.element === "*"  ||
                            tree.element === "/"  ||
                            tree.element === "^"  ||
                            tree.element === "%"  ||
                            tree.element === "--"  ||
                            tree.element === "++"  ||
                            tree.element === "||"  ||
                            tree.element === "!="  ||
                            tree.element === "&&"  ||
                            tree.element === "=="  ||
                            tree.element === "<"  ||
                            tree.element === "<="  ||
                            tree.element === ">"  ||
                            tree.element === ">=" ){
                        if (tree.depth() > 2) {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var z = 0; z < tree.degree() ; z++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(z));
                            }
                            return result + "\n" + formatting + ")";
                        }
                        else {
                            result += formatting + "( " + "<span class='pNode' id='spn" + counter++ + "'>" + tree.element + "</span>";
                            for (var q = 0; q < tree.degree() - 1; q++) {
                                result += prettyPrint2(" ", tree.getSubTree(q));
                            }
                            result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                            return result;
                        }
                    }
                }

                //TODO: Make sure this is never reached!
                return "Needs to be Implemented 2";

            }

            function prettyPrint(tree) {
                var result = prettyPrint2("", tree);
                console.log("Printing from prettyPrintFactory");
                console.log(result);
                counter = 0; //reset the counter for proper highlighting of nodes
                return result;
            }

            return {
                'prettyPrint': prettyPrint
            }
        });
        
})();