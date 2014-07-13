(function() {
	var trim = function(str) {
		return String(str).replace(/^\s*|\s*$/g, '');
	}

	angular.module('assert', [])

	.provider('assert', function() {
		var throwEnabled = false;

		this.enableThrow = function(value) {
			throwEnabled = !!value;
		};

		this.$get = ['$exceptionHandler',
			function($exceptionHandler) {
				function fail(error, cause) {
					if (typeof error === 'string') {
						error = new Error(error + (cause ? ' (cause: ' + cause + ')' : ''));
					}

					if (throwEnabled) {
						throw error;
					}

					$exceptionHandler(error);
				}

				function assert(value, message, cause) {
					if (!value) {
						fail(new Error(message), cause);
					}
				}

				return assert;
			}
		];
	})

	.factory('is', ['assert',
		function(assert) {
			var ERR_INVALID_TYPE = 'Invalid type';

			function invalidTypeMessage(cause) {
				return ERR_INVALID_TYPE + ': ' + cause;
			}

			function negatedValue(fn) {
				return function() {
					arguments[0] = !arguments[0];
					fn.apply(null, arguments);
				};
			}

			var is = {
				array: function(value, message) {
					assert(angular.isArray(value), message || invalidTypeMessage('value is not array'));
				},

				object: function(value, message) {
					assert(angular.isObject(value), message || invalidTypeMessage('value is not an object'));
				},

				string: function(value, message) {
					assert(angular.isString(value), message || invalidTypeMessage('value is not a string'));
				},

				number: function(value, message) {
					assert(angular.isNumber(value), message || invalidTypeMessage('value is not a number'));
				},

				empty: function(value, message) {
					value = (value === undefined || value === null || trim(value) === '');
					assert(value, message || 'Value is empty');
				}
			};

			var not = {};
			for (var assertion in is) {
				not[assertion] = negatedValue(is[assertion]);
			}

			is.not = not;
			assert.is = is;

			return assert.is;
		}
	]);
})();