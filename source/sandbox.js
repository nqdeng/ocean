// Error isolation sandbox.
var sandbox = (function () {
	var queue = [],

		head = document.getElementsByTagName('head')[0],

		base = head.getElementsByTagName('base')[0],

		exports = {
			/**
			 * Run function in sandbox.
			 * @param fn {Function}
			 * @param context {Object|null}
			 * @param args {Array}
			 */
			run: function (fn, context, args) {
				var el = document.createElement('script');

				el.text = GLOBAL_VAR_NAME + '._exec()';
				queue.push([ fn, context || null, args || [] ]);

				// Execute code synchronously.
				if (base) { // Avoid a known bug in IE6.
					head.insertBefore(el, base);
				} else {
					head.appendChild(el);
				}

				// Clean up.
				head.removeChild(el);
			},

			/**
			 * Trigger sandbox.
			 * This function will be registered in global object.
			 */
			_exec: function () {
				var meta = queue.pop();

				meta[0].apply(meta[1], meta[2]);
			}
		};

	return exports;
}());