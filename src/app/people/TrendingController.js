$module.controller('People/TrendingController', ['$scope', 'UserService', 'SearchFilter',
	function($scope, UserService, SearchFilter) {
		var filter = new SearchFilter();

		filter.setSorting('views', SearchFilter.DESC);

		UserService.findAll(filter).then(function(list) {
			$scope.results = list;
		});
	}
]);