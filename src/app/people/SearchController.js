$module.controller('People/SearchController', ['$scope', '$state', '$stateParams', 'UserService', 'SearchFilter',
	function($scope, $state, $stateParams, UserService, SearchFilter) {
		var filters = $scope.filters = new SearchFilter();

		$scope.$on('filter.changed', updateResults);
		$scope.$on('filter.selected', function($e, name, value) {
			if (name === 'uid') {
				$state.go('app.profile', {
					uid: value
				});
				return;
			}

			filters.setFilter(name, value);
			updateResults();
		});

		$scope.updateSearch = updateResults;

		$scope.search = {
			minHeight: +$stateParams.minHeight | 0,
			maxHeight: +$stateParams.maxHeight | 0,
			height: +$stateParams.height | 0,
			name: $stateParams.name || '',
			gender: $stateParams.gender || null
		};

		filters.setFilters($scope.search);

		function getParams() {
			var params = {};
			angular.forEach(filters.$filter, function(value, name) {
				if (+value === 0 || value === null) return;

				params[name] = value;
			});

			return params;
		}

		function updateResults() {
			var params = getParams();

			UserService.findAll(filters).then(function(results) {
				$scope.results = results;
				$state.transitionTo($state.current.name, params, {
					inherit: false
				});
			}, function(results) {
				console.log(results);
			});
		}

		updateResults();
	}
]);