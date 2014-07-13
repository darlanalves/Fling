$module.directive('searchBox', function() {

	function debounce(fn, delay) {
		var timer;

		function run() {
			fn();
			clearTimeout(timer);
			timer = null;
		}

		return function() {
			if (timer) return;

			timer = setTimeout(run, delay);
		}
	}

	return {
		template: '<input type="text" ng-model="search.keyword" placeholder="{{placeholder}}" /><button class="button" ng-bind="actionText"></button>',
		replace: true,
		restrict: 'C',
		scope: {
			onsearch: '&',
			placeholder: '@',
			actionText: '@'
		},
		link: function($scope, $element, $attrs) {
			$scope.search = {};

			var handler = $scope.onsearch,
				trigger = debounce(function() {
					handler($scope.search.keywords);
				}, $attrs.delay || 50);

			$scope.$watch('search.keywords', handler);
		}
	}
})