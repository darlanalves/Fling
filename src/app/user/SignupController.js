$module.controller('User/SignupController', ['$scope', '$state', 'UserService',
	function($scope, $state, UserService) {
		$scope.user = {};

		$scope.saveUser = function($form) {
			if ($form && $form.$invalid) return;

			UserService.create($scope.user).then(function() {
				$state.go('app.user.profile', {
					id: $scope.user.uid
				});
			});
		};
	}
]);