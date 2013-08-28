/* jshint node: true */
'use strict';

var reObfuscatedUser = /([\w\-]+)\:(\*+)/;
var reObfuscatedVariable = /\*{2}([\w\-\.]+)(\|.*)?\*{2}/;
var hasOwn = Object.prototype.hasOwnProperty;

/**
  # clarity

  Clarity is a small utility library that is used to provide "deobfuscation"
  support for your secure data.  The library has been created to deal with 
  the fact that configuration information is generally stored in plaintext
  and saved to repositories such as source control, or centralized
  configuration stores (at least that is the idea behind
  [sharedconfig](https://github.com/DamonOehlman/sharedconfig).

  When this happens, it's very easy to accidently leak passwords or other
  information that should remain hidden.

  Clarity makes it possible to store generalized information in these
  centralized stores, while storing more sensitive information in alternative
  stores and will reconcile the information at runtime when required.

  ## Replacing Simple Values

  The most common use case when using clarity is to use it to replace
  configuration values with configuration values that are stored in
  environment variables.  For instance, consider the following simple
  example `config.json` file:

  ```json
  {
    "dbserver": "localhost",
    "dbport":   "7632",
    "dbuser":   "admin",
    "dbpass":   "teapot"
  }
  ```

  If we were then to import our configuration into our node program, we
  would be able to access the configuration values:

  ```js
  var config = require('./config.json');
  ```

  Using this technique for configuration, however, means that we don't
  have configurations for each of our environments (dev, test, staging,
  production) and we have also exposed some sensitive data in our
  configuration file.  While we can use a package such as
  [node-config](https://github.com/lorenwest/node-config) to assist with
  managing configurations for different environments, we still have
  potentially sensitive information stored in our configuration files.

  This can be avoided by using clarity to put value placeholders in our
  configuration instead:

  ```json
  {
    "dbserver": "**DB_SERVER**",
    "dbport":   "**DB_PORT**",
    "dbuser":   "**DB_USER**",
    "dbpass":   "**DB_PASS**"
  }
  ```

  Now if we were to load the configuration via clarity we could use
  machine environment variables to replace the values:

  ```js
  var clarity = require('clarity')(process.env);
  var config = clarity.decode(require('./config.json'));
  ```

  All values that have appropriate environment variables (e.g.
  `process.env.DB_SERVER`) would be replaced with the relevant value
  instead.  The only downside of this technique is that in development you
  need a whole swag of environment variables configured which can be quite
  annoying.

  To make life easier in development, you can use the default value
  functionality of clarity.  This is implemented by separating the
  environment key with the default value using a pipe (|) character:

  ```json
  {
    "dbserver": "**DB_SERVER|localhost**",
    "dbport":   "**DB_PORT|7632**",
    "dbuser":   "**DB_USER|admin**",
    "dbpass":   "**DB_PASS|teapot**"
  }
  ```

  ## Replacing values from nested data

  It is possible to access nested data values using a period to traverse
  the data structure. Such as:

  ```json
  {
    "dbserver": "**database.host**",
    "dbport":   "**database.port**",
    "dbuser":   "**database.user**",
    "dbpass":   "**database.password**"
  }
  ```

  ## Reference

**/

/**
  ### Clarity constructor

  Create a new instance of clarity.

  ```js
  var clarity = require('clarity')(process.env);
  ```

  Which is equivalent to:

  ```js
  var Clarity = require('clarity');
  var clarity = new Clarity(process.env);
  ```

**/
function Clarity(data) {
  if (! (this instanceof Clarity)) {
    return new Clarity(data);
  }

  // initialise empty data
  this.data = {};

  // use the provided data
  this.use(data);
}

module.exports = Clarity;

/**
  ### Clarity#clear()

  Clear the data currently stored within the clarity store

**/
Clarity.prototype.clear = function() {
  this.data = {};
  
  return this;
};

/**
  ### Clarity#decode(input)

  Decode the specified input value into it's actual value.

*/
Clarity.prototype.decode = function(input) {
  var matchUser;
  var matchVariable;
  var output;
  var parts;
  var replacement;

  function transverse(data, depth) {
    var block;

    if (depth.length === 1) {
      return data[depth.shift()] || ''
    }

    block = data[depth.shift()];
    if (!block || typeof block !== 'object') {
      return '';
    }
    
    return transverse(block, depth);
  }

  // if the input is an object, then walk through the object and clone
  if (typeof input == 'object' && (! (input instanceof String))) {
    return this.deepDecode(input);
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
    parts[1] = matchUser[1] + ':' + (this.data[(matchUser[1] + '_pass').toLowerCase()] || matchUser[2]);
    parts[2] = input.slice(matchUser.index + matchUser[0].length);
    
    // create the output
    output = parts.join('');
  }
  else if (matchVariable) {
    parts[0] = input.slice(0, matchVariable.index);

    if (matchVariable[1]) {
      replacement = this.data[matchVariable[1]] ||
        transverse(this.data, matchVariable[1].split('.'));
    }
    
    // If there is no replacement data use the default
    parts[1] = replacement || matchVariable[2] && matchVariable[2].slice(1);
    parts[2] = input.slice(matchVariable.index + matchVariable[0].length);
    output = parts.join('');
  }
  
  return output;
};

/**
  ### Clarity#deepDecode(input)

  The `deepDecode` method is used to unpack an object and decode each
  of the values within the object into it's actual value.

**/
Clarity.prototype.deepDecode = function(input) {
  var clone = {};
  var clarity = this;

  // if we have a string, then short circuit
  if (typeof input == 'string' || (input instanceof String)) {
    return this.decode(input);
  }
  // likewise if we have a type other than an object
  // then simple return the input
  else if (typeof input != 'object') {
    return input;
  }
  
  // If input is an array. Then return an array with it's
  // elements deep copied.
  if (input instanceof Array) {
    return input.map(clarity.deepDecode.bind(clarity));
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

/**
  ### Clarity#use(data*)

  Extend the data stored within clarity with additional data that will be
  used at decode time.
  
**/
Clarity.prototype.use = function() {
  function extend() {
    var dest = {};
    var sources = Array.prototype.slice.call(arguments);
    var source = sources.shift();

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
  this.data = extend.apply(null, [this.data].concat([].slice.call(arguments)));
  
  // return clarity
  return this;
};