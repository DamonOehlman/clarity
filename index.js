var data = {},
    reObfuscatedUser = /(\w+)\:(\*+)/,
    reObfuscatedVariable = /\*{2}(\w+)\*{2}/;

function clarity() {
    
}

/**
## clear

Clear the data currently stored within the clarity store
*/
clarity.clear = function() {
    data = {};
    
    return clarity;
}

clarity.decode = function(input) {
    // run some regex checks against the input string
    var matchUser = reObfuscatedUser.exec(input),
        matchVariable = reObfuscatedVariable.exec(input),
        output = input,
        parts = [];
        
    // if we are dealing with a variable, then decode appropriately
    // for users, we will be looking for the key %username%_pass (yes, lowercase)
    if (matchUser) {
        // initialise the parts of the response
        parts[0] = input.slice(0, matchUser.index);
        parts[1] = matchUser[1] + ':' + (data[(matchUser[1] + '_pass').toLowerCase()] || matchUser[2]);
        parts[2] = input.slice(matchUser.index + matchUser[0].length);
        
        // create the output
        output = parts.join('');
    }
    
    return output;
};

clarity.use = function() {
    function extend() {
        var dest = {},
            sources = Array.prototype.slice.call(arguments),
            source = sources.shift();
            
        while (source) {
            Object.keys(source).forEach(function(key) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            });
    
            source = sources.shift();
        }

        return dest;
    }
    
    // update the current data with the supplied sources
    data = extend.apply(null, [data].concat(Array.prototype.slice.call(arguments)));
    
    // return clarity
    return clarity;
};

module.exports = clarity;