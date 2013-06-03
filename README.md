# clarity

Clarity is a small utility library that is used to provide "deobfuscation" support for your secure data.  The library has been created to deal with the fact that configuration information is generally stored in plaintext and saved to repositories such as source control, or centralized configuration stores (at least that is the idea behind [sharedconfig](https://github.com/DamonOehlman/sharedconfig).  When this happens, it's very easy to accidently leak passwords or other information that should remain hidden.

Clarity makes it possible to store generalized information in these centralized stores, while storing more sensitive information in alternative stores and will reconcile the information at runtime when required.

## Replacing Simple Values

The most common use case when using clarity is to use it to replace configuration values with configuration values that are stored in environment variables.  For instance, consider the following simple example `config.json` file:

```
{
	"dbserver": "localhost",
	"dbport":   "7632",
	"dbuser":   "admin",
	"dbpass":   "teapot"
}
```

If we were then to import our configuration into our node program, we would be able to access the configuration values:

```js
var config = require('./config.json');
```

Using this technique for configuration, however, means that we don't have configurations for each of our environments (dev, test, staging, production) and we have also exposed some sensitive data in our configuration file.  While we can use a package such as [node-config](https://github.com/lorenwest/node-config) to assist with managing configurations for different environments, we still have potentially sensitive information stored in our configuration files.

This can be avoided by using clarity to put value placeholders in our configuration instead:

```
{
	"dbserver": "**DB_SERVER**",
	"dbport":   "**DB_PORT**",
	"dbuser":   "**DB_USER**",
	"dbpass":   "**DB_PASS**"
}
```

Now if we were to load the configuration via clarity we could use machine environment variables to replace the values:

```js
var clarity = require('clarity').use(process.env),
	config = clarity.decode(require('./config.json'));
```

All values that have appropriate environment variables (e.g. `process.env.DB_SERVER`) would be replaced with the relevant value instead.  The only downside of this technique is that in development you need a whole swag of environment variables configured which can be quite annoying.

To make life easier in development, you can use the default value functionality of clarity.  This is implemented by separating the environment key with the default value using a pipe (|) character:

```
{
	"dbserver": "**DB_SERVER|localhost**",
	"dbport":   "**DB_PORT|7632**",
	"dbuser":   "**DB_USER|admin**",
	"dbpass":   "**DB_PASS|teapot**"
}
```

## Replacing values from nested data

It is possible to access nested data values using a period to traverse the data structure. Such as:

```
{
	"dbserver": "**database.host**",
	"dbport":   "**database.port**",
	"dbuser":   "**database.user**",
	"dbpass":   "**database.password**"
}
```