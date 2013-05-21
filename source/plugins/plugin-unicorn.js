/**
 * ocean request combo plugin
 * Copyright(c) 2010 ~ 2012 Alibaba.com, Inc.
 * MIT Licensed
 */

(function () {
	var PATTERN_EXT = /(\.css|\.js)$/,

		PATTERN_PROTOCOL = /^(http:|https:)/,

		/**
		 * Combine uris in a group.
		 * @param uris {Array}
		 * @return {string}
		 */
		combine = function (uris) {
			var parts = uris[0].split('/'),
				base,
				len = uris.length,
				i,
				pathnames = [],
				result, ptr, stamp, count;

			OUTER:
			while (parts.length > 0) {
				base = parts.join('/') + '/';
				parts.pop();
				for (i = 0; i < len; ++i) {
					if (uris[i].indexOf(base) !== 0) {
						continue OUTER;
					}
				}
				break;
			}

			result = [ [] ];
			stamp = [ 0, 0 ];
			ptr = 0;
			count = 0;

			for (i = 0; i < len; ++i) {
				parts = uris[i].split('?');

				parts[0] = parts[0].split(base)[1];

				(parts[1] || '').replace(/t=([0-9a-f]+)_([0-9a-f]+)/, function (all, s1, s2) {
					stamp[0] += parseInt(s1 || '0', 16);
					stamp[1] += parseInt(s2 || '0', 16);
				});

				if (count > 1900) {
					result[ptr] = base + '??' + result[ptr].join(',') +
						'?t=' + stamp[0].toString(16) + '_' + stamp[1].toString(16);
					stamp = [ 0, 0 ];
					result.push([]);
					ptr += 1;
					count = 0;
				}

				result[ptr].push(parts[0]);
				count += parts[0].length;
			}

			result[ptr] = base + '??' + result[ptr].join(',') +
				'?t=' + stamp[0].toString(16) + '_' + stamp[1].toString(16);

			return result;
		},

		/**
		 * Flatten an array.
		 * @param arr {Array}
		 * @return {Array}
		 */
		flatten = function (arr) {
			var result = [],
				len = arr.length,
				i = 0;

			for (; i < len; ++i) {
				if (typeof arr[i][0] !== 'string') { // Not an atom.
					result = result.concat(flatten(arr[i]));
				} else {
					result.push(arr[i]);
				}
			}

			return result;
		},

		/**
		 * Flatten an array.
		 * @param arr {Array}
		 * @return {Array}
		 */
		flatten2 = function (arr) {
			var result = [],
				len = arr.length,
				i = 0;

			for (; i < len; ++i) {
				if (typeof arr[i] === 'object') { // Sub array.
					result = result.concat(flatten2(arr[i]));
				} else {
					result.push(arr[i]);
				}
			}

			return result;
		},

		/**
		 * Group array items.
		 * @param arr {Array}
		 * @return {Array}
		 */
		group = function (arr) {
			return flatten(map(groupBy(arr, PATTERN_PROTOCOL), function (arr) {
				return groupBy(arr, PATTERN_EXT);
			}));
		},

		/**
		 * Group array items by regexp pattern.
		 * @param arr {Array}
		 * @param pattern {RegExp}
		 * @return {Array}
		 */
		groupBy = function (arr, pattern) {
			var len = arr.length,
				i = 0,
				re, key,
				tmp = {};

			for (; i < len; ++i) {
				re = arr[i].match(pattern);
				key = re ? re[1] : '';
				if (!tmp[key]) {
					tmp[key] = [];
				}
				tmp[key].push(arr[i]);
			}

			return values(tmp);
		},

		/**
		 * Convert values in an array.
		 * @param arr {Array}
		 * @param fn {Function}
		 * @return {Array}
		 */
		map = function (arr, fn) {
			var len = arr.length,
				i = 0,
				result = [];

			for (; i < len; ++i) {
				result[i] = fn(arr[i]);
			}

			return result;
		},

		/**
		 * Get values of an object.
		 * @param obj {Object}
		 * @return {Array}
		 */
		values = function (obj) {
			var key,
				values = [];

			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					values.push(obj[key]);
				}
			}

			return values;
		};

	// Combine URIs before module manager loads JS files.
	seajs.after('load', function (ids) {
		return flatten2(map(group(ids), combine));
	});
}());
