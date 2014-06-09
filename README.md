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


[![NPM](https://nodei.co/npm/clarity.png)](https://nodei.co/npm/clarity/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/clarity.svg?branch=master)](https://travis-ci.org/DamonOehlman/clarity) [![stable](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/badges/stability-badges) 

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

### Clarity#clear()

Clear the data currently stored within the clarity store

### Clarity#deepDecode(input)

The `deepDecode` method is used to unpack an object and decode each
of the values within the object into it's actual value.

### Clarity#use(data*)

Extend the data stored within clarity with additional data that will be
used at decode time.

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
