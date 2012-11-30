ocean
=====

A experimental module loader with the same APIs of SeaJS(http://seajs.org).

API Reference
-------------

### define(id, dependencies, factory)

Define a module.

	define('foo.js', [ 'bar.js' ], function (require, exports, module) {
		var bar = require('bar.js');
		require.async('baz.js', function (baz) {
			// ...
		});
		// ...
	});

### seajs.use(id, callback)

Use modules by `id`. 'callback' is executed when all modules ready.

	seajs.use('foo', function (foo) {
		// ...
	});

	seajs.use([ 'bar', 'baz' ], function (bar, baz) {
		// ...
	});

### seajs.config(option)

Deep-merge configuration in `option` object with existing ones.

	seajs.config({
		alias: {
			'foo': 'http://foo.com',
		},
		base: 'http://bar.com/',
		charset: 'utf-8'
	});

### seajs.before(methodName, handler)

Add an AOP `handler` before an internal method.

	seajs.before('load', function (uris) {
		return [ combo(uris) ];
	});

### seajs.after(methodName, handler)

Add an AOP `handler` after an internal method.

	seajs.after('resolve', function (uri) {
		return map(uri);
	});

Module ID
---------

Module ID is a unique full URI assigned with a module. Module ID could write in partial or alias form but will be resolved to full URI finally.

### Full URI

Full URI is used as it is.

	seajs.use('http://foo.com/bar.js');

### Partial URI

Partial URI could be a relative pathname or a absolute pathname. In HTML page, relative pathname is resolved based on page URI. In a module, relative pathname is resolved based on module ID. And absolute pathname is always resolved based on seajs `base` configuration.

	# in http://foo.com/index.html
	seajs.use('./bar.js') // equals => seajs.use('http://foo.com/bar.js')

	# in http://foo.com/bar.js
	require('./baz.js') // equals => require('http://foo.com/baz.js')

	# base is configured to 'http://foo.com/bar/'
	require('baz.js') // equals => require('http://foo.com/bar/baz.js')

### Alias

If module ID is writen in absolute pathname, the first part could be an alias.

	# define alias: 'bar': 'http://foo.com/bar'
	require('bar/baz.js') // equals => require('http://foo/bar/baz.js')

Prepend `#` to ID can prevent alias parsing.

	# define alias: 'bar': 'http://foo.com/bar'
	# base is configured to 'http://foo.com/bar/'
	require('#bar/baz.js') // equals => require('http://foo/bar/bar/baz.js')

### Extname

If a URI does not have an extname, or not contain `?`, `.js` is appended to URI by default.

	# in http://foo.com/bar.js
	require('./baz') // equals => require('http://foo.com/baz.js')

Append '#' to ID can prevent default extname appending.

	# in http://foo.com/bar.js
	require('./baz#') // equals => require('http://foo.com/baz')
