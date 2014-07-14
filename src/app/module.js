var $module = angular.module('fling', ['ui.router', 'assert', 'defer', 'ngSanitize'])

.config(['assertProvider',
	function(assertProvider) {
		assertProvider.enableThrow(true);
	}
]);