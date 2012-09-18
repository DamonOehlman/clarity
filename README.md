# clarity

Clarity is a small utility library that is used to provide "deobfuscation" support for your secure data.  The library has been created to deal with the fact that configuration information is generally stored in plaintext and saved to repositories such as source control, or centralized configuration stores (at least that is the idea behind [sharedconfig](https://github.com/DamonOehlman/sharedconfig).  When this happens, it's very easy to accidently leak passwords or other information that should remain hidden.

Clarity makes it possible to store generalized information in these centralized stores, while storing more sensitive information in alternative stores and will reconcile the information at runtime when required.

Let's look at a really simple example first.  In this example, we have a url to a [CouchDB](http://couchdb.apache.org/) instance stored in our application code:

```js
var targetUrl = 'http://test:test@damonoehlman.iriscouch.com/clarity-tests',
    db = require('nano')(targetUrl);
```

In the case above, both our username and password have been exposed, which is probably less than ideal.  Using clarity though, we can obfuscate the connection string in the code and recreate the actual connection string by combining the information with ENVIRONMENT VARIABLES stored on the machine:

```js
var clarity = require('clarity').use(process.env),
    targetUrl = http://test:*****@damonoehlman.iriscouch.com/clarity-tests',
    db = require('nano')(clarity.decode(targetUrl));
```