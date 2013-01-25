var data = {},
    reObfuscatedUser = /([\w\-]+)\:(\*+)/,
    reObfuscatedVariable = /\*{2}([\w\-]+)(\|.*)?\*{2}/,
    hasOwn = Object.prototype.hasOwnProperty;

function clarity() {
}

/**
## clear

Clear the data currently stored within the clarity store
*/
clarity.clear = function() {
    data = {};
    
    return clarity;
};

clarity.decode = function(input) {
    var matchUser, matchVariable, output, parts;

    // if the input is an object, then walk through the object and clone
    if (typeof input == 'object' && (! (input instanceof String))) {
        return clarity.deepDecode(input);
    }
    
    // run some regex checks against the input string
    matchUser = reObfuscatedUser.exec(input);
    matchVariable = reObfuscatedVariable.exec(input);
    output = input;
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
    else if (matchVariable) {
        parts[0] = input.slice(0, matchVariable.index);
        parts[1] = data[matchVariable[1]] || matchVariable[2].slice(1);
        parts[2] = input.slice(matchVariable.index + matchVariable[0].length);
        
        output = parts.join('');
    }
    
    return output;
};

clarity.deepDecode = function(input) {
    var clone = {};
    
    // if we have a string, then short circuit
    if (typeof input == 'string' || (input instanceof String)) {
        return clarity.decode(input);
    }
    // likewise if we have a type other than an object
    // then simple return the input
    else if (typeof input != 'object') {
        return input;
    }
    
    // iterate through the keys within the object
    // and return the decoded value
    Object.keys(input).forEach(function(key) {
        if (hasOwn.call(input, key)) {
            clone[key] = clarity.deepDecode(input[key]);
        }
    });
    
    return clone;
};

clarity.use = function() {
    function extend() {
        var dest = {},
            sources = Array.prototype.slice.call(arguments),
            source = sources.shift();

        while (source) {
            Object.keys(source).forEach(function(key) {
                if (hasOwn.call(source, key)) {
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