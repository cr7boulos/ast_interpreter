(function(){

'use strict';
angular
        .module('astInterpreter')
        .factory('prettyPrinterFactory', function () {
            
            

            function prettyPrint2(formatting, tree) {
                var result = "";

                if (tree.depth() === 0) {
                    return formatting + tree.element;
                }
                else if (tree.depth() === 1) {
                    result += formatting + "( " + tree.element;
                    for (var i = 0; i < tree.degree() - 1; i++) {
                        result += prettyPrint2(" ", tree.getSubTree(i));
                    }
                    result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                    return result;
                }
                else if (tree.depth() > 1) {
                    if(tree.element === "prog" ||
                        tree.element === "begin") {
                        result += formatting + "( " + tree.element;
                        for (var x = 0; x < tree.degree() ; x++) {
                            result += "\n" + prettyPrint2("   ", tree.getSubTree(x));
                        }
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "print") {
                        result += formatting + "( " + tree.element;
                        for (var y = 0; y < tree.degree() - 1; y++) {
                            result += prettyPrint2(" ", tree.getSubTree(y));
                        }
                        result += prettyPrint2(" ", tree.getSubTree(tree.degree() - 1)) + " )";
                        return result;
                    }
                    else if (tree.element === "if") {
                        result += formatting + "( " + tree.element;
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(1));
                        result += "\n" + prettyPrint2(formatting + "     ", tree.getSubTree(2));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "while") {
                        result += formatting + "( " + tree.element;
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "        ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "fun") {
                        result += formatting + "( " + tree.element;
                        result += prettyPrint2(" ", tree.getSubTree(0));
                        result += "\n" + prettyPrint2(formatting + "      ", tree.getSubTree(1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element === "lambda") {
                        result += formatting + "( " + tree.element;
                        for (var t = 0; t < tree.degree() - 1; t++) {
                            result += prettyPrint2(" ", tree.getSubTree(t));
                        }
                        result += "\n" + prettyPrint2(formatting + "    ", tree.getSubTree(tree.degree() - 1));
                        return result + "\n" + formatting + ")";
                    }
                    else if (tree.element == "apply") {
                        if(tree.depth() == 2)
                        {
                            result +=  formatting + "( " + tree.element;
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
                            result += formatting + "( " + tree.element;
                            result += prettyPrint2(" ", tree.getSubTree(0));
                            result += prettyPrint2(" ", tree.getSubTree(1)) + " )";
                            return result;
                        }
                        else {
                            result += formatting + "( " + tree.element;
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
                            result += formatting + "( " + tree.element;
                            for (var z = 0; z < tree.degree() ; z++) {
                                result += "\n" + prettyPrint2(formatting + "   ", tree.getSubTree(z));
                            }
                            return result + "\n" + formatting + ")";
                        }
                        else {
                            result += formatting + "( " + tree.element;
                            for (var q = 0; q < tree.degree() - 1; q++) {
                                result += prettyPrint2(" ", tree.getSubTree(i));
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
                return prettyPrint2("", tree);
            }

            return {
                'prettyPrint': prettyPrint
            }
        });
        
})();