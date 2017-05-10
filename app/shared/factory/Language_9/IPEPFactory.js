(function(){
    'use strict';
    
    angular.module('astInterpreter')
        .factory('l8.IPEPFactory', function(){
            
            /*
                Construct a IPEP object
            */
            function IPEP(tree, env) {
                this.ip = tree; // the ip, the "instruction pointer"
                this.ep = env;  // the ep, the "environment pointer"
            }
            
            return{
                'IPEP': IPEP,
            }
            
        });
})();