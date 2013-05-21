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
		 * Execute fn when dom ready.
		 * @param fn {Function}
		 */
		onDOMReady = function (fn) {
			var timer,
				win = window,
				doc = win.document,
				onreadystatechange = doc.onreadystatechange,
				domReady = false;

			function onStateChange(e) {
				// IE compatibility.
				e = e || win.event;
				// Mozilla, Opera, & Legacy.
				if (e && e.type && (/DOMContentLoaded|load/).test(e.type)) {
					fireDOMReady();
				// Legacy.
				} else if (doc.readyState) {
					if ((/loaded|complete/).test(doc.readyState)) {
						fireDOMReady();
					//IE, courtesy of Diego Perini. (http://javascript.nwbox.com/IEContentLoaded/)
					} else if (self === self.top && doc.documentElement.doScroll) {
						try {
							// Throw error before domReady.
							if (!domReady) {
								doc.documentElement.doScroll('left');
							}
						} catch (e) {
							return;
						}
						// If no error was thrown, the DOM must be ready.
						fireDOMReady();
					}
				}
			}

			// Fire the fn and cleans up memory.
			function fireDOMReady() {
				if (!domReady) {
					domReady = true;
					// Fire the fn.
					fn.call(null);
					// Clean up after the DOM is ready.
					if (doc.removeEventListener) {
						doc.removeEventListener('DOMContentLoaded', onStateChange, false);
					}
					// Clear the interval.
					clearInterval(timer);
				}
			}

			// Mozilla & Opera.
			if (doc.addEventListener) {
				doc.addEventListener("DOMContentLoaded", onStateChange, false);
			}
			// Safari & IE.
			timer = setInterval(onStateChange, 40);
			// IE & Legacy.
			onPageLoad(onStateChange);
			doc.onreadystatechange = function () {
				onStateChange.apply(doc, arguments);
				// Fire the original one.
				if (typeof onreadystatechange === 'function') {
					onreadystatechange.apply(doc, arguments);
				}
			};
		},

		/**
		 * Execute fn when page loaded.
		 * @param fn {Function}
		 */
		onPageLoad = function (fn) {
			var win = window,
				prev;

			if (win.addEventListener) {
				// Modern browsers.
				win.addEventListener('load', fn, false);
			} else if (win.attachEvent) {
				// IE.
				win.attachEvent('onload', fn);
			} else if (typeof win.onload === 'function') {
				// Legacy.
				// Keep the original one.
				prev = win.onload;
				win.onload = function () {
					fn.apply(win, arguments);
					prev.apply(win, arguments);
				};
			} else {
				// Legacy.
				win.onload = fn;
			}
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

	onDOMReady(function () {
		// Flush buffered function calls
		// and restore use function on DOMReady.
		seajs.use = _use;
		flush();
	});
}());

