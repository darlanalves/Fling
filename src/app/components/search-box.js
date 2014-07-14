$module.directive('searchBox', function() {

	function debounce(fn, delay) {
		var timer = null;
		return function() {
			timer || (timer = setTimeout(function() {
				timer = false;
				fn();
			}, delay));
		};
	}

	return {
		template: '<div ng-class="{\'with-button\': withButton}"><input type="text" ng-attr-tabindex="{{tabindex}}" ng-class="{mini:mini}" ng-model="search.keywords" placeholder="{{placeholder}}" ng-enter="doSearch()" class="input" /><button ng-if="withButton" class="primary button" ng-click="doSearch()" ng-bind="actionText" type="submit" ng-class="{mini:mini}"></button></div>',
		restrict: 'C',
		scope: {
			onsearch: '&',
			onchange: '&',
			placeholder: '@',
			actionText: '@',
			tabindex: '@'
		},

		link: function($scope, $element, $attrs) {
			$scope.search = {};

			var onchange = $scope.onchange(),
				onsearch = $scope.onsearch(),
				onchangeTrigger = debounce(function() {
					onchange && onchange($scope.search.keywords);
				}, $attrs.delay || 200);

			$scope.$watch('search.keywords', onchangeTrigger);
			$scope.mini = ('mini' in $attrs);
			$scope.withButton = ('button' in $attrs);

			$scope.doSearch = function() {
				onsearch && onsearch($scope.search.keywords);
			};
		}
	}
})