/**
 * ocean lazy-use plugin
 * Copyright(c) 2010 ~ 2012 Alibaba.com, Inc.
 * MIT Licensed
 */

(function () {
	var _use = seajs.use, // The original one.

		buffer = [],

		/**
		 * Flush buffered function calls.
		 */
		flush = function () {
			var ids = [],
				tmp = buffer.slice(), // Create an copy before buffer is cleared.
				len = buffer.length,
				i = 0;

			for (; i < len; ++i) {
				ids = ids.concat(buffer[i].ids);
			}

			buffer = [];

			_use.call(seajs, ids, function () {
				var len = tmp.length,
					i = 0;

				for (; i < len; ++i) {
					_use.call(seajs, tmp[i].ids, tmp[i].callback);
				}
			});
		},

		/**
		 * The fake one.
		 * @param ids {Array|string}
		 * @param callback {Function}
		 */
		use = function (ids, callback) {
			buffer.push({
				ids: ids,
				callback: callback
			});
		};

	// Define APIs.
	seajs.flush = flush;
	seajs.use = use;

	_use('$', function ($) {
		$(function () {
			// Flush buffered function calls
			// and restore use function on DOMReady.
			seajs.use = _use;
			flush();
		});
	});
}());

