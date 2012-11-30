// Asynchronous JS file loader.
var loader = (function () {
	var pending = {},

		head = document.getElementsByTagName('head')[0],

		base = head.getElementsByTagName('base')[0],

		/**
		 * Script element onload handler.
		 * @param el {Object}
		 * @callback {Function}
		 */
		onload = function (el, callback) {
			if ('onload' in el) { // For standard browsers.
				el.onload = function () {
					callback();
				};
			} else if ('onreadystatechange' in el) { // For legacy IE.
				el.onreadystatechange = function () {
					var state = this.readyState;

					if (state === 'loaded' || state === 'complete') {
						el.onreadystatechange = null;
						callback();
					}
				};
			}
		},

		exports = {
			/**
			 * Load a JS file.
			 * @param uri {string}
			 */
			load: function (uri) {
				var el;

				if (!pending[uri]) {
					// Avoid duplicated loading at the same time.
					pending[uri] = true;

					el = document.createElement('script');
					el.src = uri;
					el.charset = config.charset;
					el.async = 'async';

					onload(el, function () {
						// Clean useless DOM element.
						head.removeChild(el);
						delete pending[uri];
					});

					if (base) { // Avoid a known bug in IE6.
						head.insertBefore(el, base);
					} else {
						head.appendChild(el);
					}
				}
			}
		};

	return exports;
}());
