$module.config(['$stateProvider',
	function($stateProvider) {
		var states = {
			'app': {
				url: '',
				templateUrl: '/layout/layout.html'
			},

			'app.signup': {
				url: '/app/signup',
				templateUrl: '/user/signup.html',
				controller: 'User/SignupController'
			},

			'app.my-profile': {
				url: '/app/me',
				templateUrl: '/user/profile.html',
				controller: 'User/ProfileController'
			},

			'app.profile': {
				url: '/app/profile/:uid',
				templateUrl: '/user/profile.html',
				controller: 'User/ProfileController'
			},

			'app.search': {
				url: '/app/search?name&gender&minHeight&maxHeight&height',
				templateUrl: '/people/search.html',
				controller: 'People/SearchController'
			},

			'app.trending': {
				url: '/app/trending',
				templateUrl: '/people/trending.html',
				controller: 'People/TrendingController'
			}
		};

		angular.forEach(states, function(config, name) {
			$stateProvider.state(name, config);
		});
	}
]);