(function () {
   "use strict"; 

   angular.module('astInterpreter')
   .factory('l10.consCellFactory', function(){
       
       function ConsCell(carValue, cdrCC) {
            this.car = carValue;
            this.cdr = cdrCC;

            this.toString = function () {
                var result = "";
                if (this.car !== null) {
                    result += " " + this.car;
                    if (this.cdr !== null) {
                        result += this.cdr;
                    }
                }
                return result;
            }
        }//ConsCell

        return {
            "ConsCell": ConsCell
        };

    });

})();
