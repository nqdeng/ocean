// Prepare public APIs.
(function () {
	var mainModule = { // Main module for resolving id written in inline script.
			dependencies: [],
			exports: null,
			factory: function () {},
			id: location.href
		},

		exports = {
			/**
			 * Add a tail handler to a manager object member function.
			 * @param fnName {string}
			 * @param fn {Function}
			 */
			after: util.bind(aspect.after, manager),

			/**
			 * Add a head handler to a manager object member function.
			 * @param fnName {string}
			 * @param fn {Function}
			 */
			before: util.bind(aspect.before, manager),

			/**
			 * Change configuration.
			 * @param [option] {Object}
			 * @return {Object}
			 */
			config: function (option) {
				if (option) {
					util.merge(config, option);
				}

				return config;
			},

			/**
			 * Use modules.
			 * @param ids {Array|string}
			 * @param callback {Function}
			 */
			use: function (ids, callback) {
				ids = manager.resolve(mainModule, ids);
				manager.use(ids, callback);
			}
		};

	// Define global loader object.
	GLOBAL[GLOBAL_VAR_NAME] = exports;

	/**
	 * Define a module.
	 * @param id {string}
	 * @param dependencies {Array}
	 * @param factory {Function}
	 */
	GLOBAL.define = function (id, dependencies, factory) {
		id = manager.resolve(mainModule, id);
		manager.define(id, dependencies, factory);
	};
}());
