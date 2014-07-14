$module.directive('tabset', function() {
	return {
		restrict: 'C',
		transclude: true,
		scope: {
			onselect: '&'
		},
		template: '<div tab-buttons="$parent.labels" active="$parent.tabs.active" onselect="$parent.openTab($tab)"></div><div ng-transclude></div>',
		controller: ['$scope',
			function($scope) {
				var tabs = $scope.tabs = [],
					labels = $scope.labels = [];

				tabs.active = 0;

				this.register = function(tabEl, tabAttr) {
					tabs.push(tabEl);
					labels.push(tabAttr.label || '');

					if ('active' in tabAttr) {
						tabs.active = tabs.length - 1;

						if (tabAttr.active) {
							$scope.$watch(tabAttr.active, function(isActive) {
								if (isActive) openTabByElement(tabEl);
							});
						}
					}
				};

				function openTabByElement(el) {
					for (var i = 0, len = tabs.length; i < len; i++) {
						if (el === tabs[i]) {
							openTab(i);
							break;
						}
					}
				}

				var openTab = $scope.openTab = this.openTab = function($tab) {
					tabs.forEach(function(tab, current) {
						if (current === $tab) {
							tab.addClass('active');
							tabs.active = $tab;
							$scope.onselect($scope, {
								tab: tab
							});
						} else {
							tab.removeClass('active');
						}
					});
				};

				setTimeout(function() {
					if (tabs.active) {
						$scope.openTab(tabs.active);
					} else {
						$scope.openTab(0);
					}
				});

				$scope.$on('$destroy', function() {
					tabs.length = 0;
				});
			}
		]
	};
})

.directive('tabButtons', ['$parse',
	function($parse) {
		return {
			replace: true,
			scope: {},
			template: '<div class="tab-buttons"><span class="tab-button" ng-class="{active: isActive($index)}" ng-repeat="tab in tabs track by $index" ng-click="selectTab($index)">{{tab}}</span></div>',

			link: function($scope, $element, $attrs) {
				$scope.tabs = $scope.$eval($attrs.tabButtons);

				var onselect = $parse($attrs.onselect)($scope);

				$scope.isActive = function(index) {
					return +$parse($attrs.active)($scope) == index;
				};

				$scope.selectTab = function(index) {
					onselect && onselect(index);
				};
			}
		};
	}
])

.directive('tab', function() {
	return {
		restrict: 'C',
		require: '?^tabset',
		link: function($scope, $element, $attrs, tabset) {
			tabset.register($element, $attrs);
		}
	};
});