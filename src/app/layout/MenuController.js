$module.controller('MenuController', ['$scope', 'UserService',
	function($scope, UserService) {
		$scope.hasProfileActive = function() {
			return UserService.hasProfileActive();
		};
	}
]);