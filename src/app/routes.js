$module.config(['$stateProvider',
	function($stateProvider) {
		var states = {
			'app': {
				url: '',
				templateUrl: '/layout/layout.html'
			},

			'app.user.signup': {
				url: '/app/signup',
				templateUrl: '/user/signup.html',
				controller: 'User/SignupController'
			},

			'app.user.my-profile': {
				url: '/app/me',
				templateUrl: '/user/profile.html',
				controller: 'User/ProfileController'
			},

			'app.people': {
				url: '/app/people',
				templateUrl: '/people/people.html'
			},

			'app.people.trending': {
				url: '/trending',
				templateUrl: '/people/trending.html',
				controller: 'People/TrendingController'
			},

			'app.people.search': {
				url: '/search?name&gender&height',
				templateUrl: '/people/search.html',
				controller: 'People/SearchController'
			}
		};

		angular.forEach(states, function(config, name) {
			$stateProvider.state(name, config);
		});
	}
]);