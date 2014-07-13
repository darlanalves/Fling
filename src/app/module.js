var $module = angular.module('fling', ['ui.router', 'assert', 'defer'])

.config(['assertProvider',
	function(assertProvider) {
		assertProvider.enableThrow(true);
	}
]);