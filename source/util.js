// Build-in utility functions.
var util = (function () {
	var PATTERN_HREF = /^(\w+:\/\/)([^\/]*)(\/.+)?$/,

		toString = Object.prototype.toString,

		slice = Array.prototype.slice,

		util = {
			/**
			 * Bind function execution context.
			 * @param fn {Function}
			 * @param context {Object}
			 * @return {Function}
			 */
			bind: function (fn, context) {
				return function () {
					fn.apply(context, arguments);
				};
			},

			/**
			 * Get own property names of an object.
			 * @param obj {Object}
			 * @return {Array}
			 */
			keys: Object.keys || function (obj) {
				var result = [],
					key;

				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						result.push(key);
					}
				}

				return result;
			},

			/**
			 * Test whether the given value is a normal object.
			 * @param value {*}
			 * @return {boolean}
			 */
			isObject: function (value) {
				return toString.call(value) === '[object Object]';
			},

			/**
			 * Deep-merge properties of the source to the target.
			 * @param target {Object}
			 * @param source {Object}
			 * @return {Object}
			 */
			merge: function (target, source) {
				var keys = util.keys(source),
					i = 0,
					len = keys.length,
					key;

				for (; i < len; ++i) {
					key = keys[i];
					if (util.isObject(target[key]) && util.isObject(source[key])) {
						util.merge(target[key], source[key]);
					} else {
						target[key] = source[key];
					}
				}

				return target;
			},

			/**
			 * Normalize a uri, resolving '.' and '..'.
			 * @param uri {string}
			 * @return {string}
			 */
			normalize: function (uri) {
				var re, protocol, hostname, pathname, parts, i;

				re = uri.match(PATTERN_HREF);
				protocol = re[1];
				hostname = re[2];
				pathname = re[3];

				parts = pathname.split('/');

				for (i = 0; i < parts.length; ++i) {
					if (parts[i] === '.' || parts[i] === '..' && i < 2) {
						parts.splice(i, 1);
						i = i - 1;
					} else if (parts[i] === '..') {
						parts.splice(i - 1, 2);
						i = i - 2;
					}
				}

				pathname = parts.join('/');

				return protocol + hostname + pathname;
			},

			/**
			 * Convert an array-like object to a real array.
			 * @param obj {Object}
			 * @return {Array}
			 */
			toArray: function (obj) {
				return slice.call(obj);
			}
		};

	return util;
}());
