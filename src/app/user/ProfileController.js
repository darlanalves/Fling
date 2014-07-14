$module.controller('User/ProfileController', ['$scope', '$state', '$stateParams', 'UserService',
	function($scope, $state, $stateParams, UserService) {
		if ($state.current.name === 'app.my-profile') {
			$scope.profile = UserService.getActiveProfile();
		} else {
			UserService.findOne($stateParams.uid).then(function(profile) {
				$scope.profile = profile;
			}, function(reason) {
				console.log(reason);
			});
		}
	}
]);