// A simple AOP lib.
var aspect = (function () {
	var headHandler = {},

		tailHandler = {},

		/**
		 * Wrap a member function to enable adding head&tail handlers.
		 * @param obj {Object}
		 * @param fnName {string}
		 */
		hijack = function (obj, fnName) {
			var origin = obj[fnName];

			headHandler[fnName] = [];
			tailHandler[fnName] = [];

			obj[fnName] = function () {
				var args = util.toArray(arguments),
					ret;

				args = runHandlers(headHandler[fnName], obj, args, true);
				ret = origin.apply(obj, args);
				return runHandlers(tailHandler[fnName], obj, [ ret ], false);
			};
		},

		/**
		 * Run head&tail handlers serially.
		 * @param queue {Array}
		 * @param context {Object}
		 * @param isHead {boolean}
		 * @param ret {*}
		 */
		runHandlers = function (queue, context, args, isHead) {
			var len = queue.length,
				i = 0,
				tmp;

			for (; i < len; ++i) {
				tmp = queue[i].apply(context, args);
				if (tmp !== UNDEFINED) {
					args = isHead ? tmp : [ tmp ];
				}
			}

			return isHead ? args : args[0];
		},

		exports = {
			/**
			 * Add a head handler.
			 * @param fnName {string}
			 * @param fn {Function}
			 */
			before: function (fnName, fn) {
				if (!headHandler[fnName]) {
					hijack(this, fnName);
				}

				headHandler[fnName].push(fn);
			},

			/**
			 * Add a tail handler.
			 * @param fnName {string}
			 * @param fn {Function}
			 */
			after: function (fnName, fn) {
				if (!tailHandler[fnName]) {
					hijack(this, fnName);
				}

				tailHandler[fnName].push(fn);
			}
		};

	return exports;
}());
