(function() {
	var TRENDING = 'trending',
		SEARCH = 'search';

	$module
		.constant('TRENDING', TRENDING)
		.constant('SEARCH', SEARCH)
		.run(['$rootScope', 'UserService',
			function($rootScope, UserService) {
				$rootScope.GENDER_MALE = UserService.GENDER_MALE;
				$rootScope.GENDER_FEMALE = UserService.GENDER_FEMALE;
				$rootScope.TRENDING = TRENDING;
				$rootScope.SEARCH = SEARCH;
			}
		]);
})();