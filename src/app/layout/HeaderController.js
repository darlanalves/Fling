$module.controller('HeaderController', ['$scope', '$state', 'SEARCH',
	function($scope, $state, SEARCH) {
		$scope.searchByName = function(name) {
			if (!name) return;

			$state.go('app.search', {
				name: name,
				tab: SEARCH
			}, {
				reload: true
			});
		};
	}
]);