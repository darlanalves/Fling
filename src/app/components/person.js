$module.directive('person', function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			person: '='
		},
		template: '<div class="person">' +
			'<a class="name" ng-bind="person.name" ng-click="selectPerson()"></a>' +
			'<div class="gender" ng-bind="person.gender | gender" ng-click="selectGender()"></div>' +
			'<div class="height" ng-bind="person.height" ng-click="selectHeight()"></div>' +
			'<div class="views" ng-bind="person.views"></div>' +
			'<span></span>' +
			'</div>',

		controller: 'PersonController'
	}
});

$module.controller('PersonController', ['$scope',
	function($scope) {
		$scope.selectGender = function() {
			$scope.$emit('filter.selected', 'gender', $scope.$eval('person.gender'));
		};

		$scope.selectHeight = function() {
			$scope.$emit('filter.selected', 'minHeight', $scope.$eval('person.height'));
		};

		$scope.selectPerson = function($event) {
			$scope.$emit('filter.selected', 'uid', $scope.$eval('person.uid'));
		};

	}
]);