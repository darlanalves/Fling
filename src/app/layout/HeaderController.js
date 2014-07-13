$module.controller('HeaderController', ['$scope', '$state',
	function($scope, $state) {
		$scope.searchByName = function(name) {
			$state.go('app.people.search', {
				name: name
			});
		};
	}
]);