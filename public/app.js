(function(undefined){

var $module = angular.module('fling', ['ui.router', 'assert', 'defer'])

.config(['assertProvider',
	function(assertProvider) {
		assertProvider.enableThrow(true);
	}
]);
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
$module.directive('searchBox', function() {

	function debounce(fn, delay) {
		var timer;

		function run() {
			fn();
			clearTimeout(timer);
			timer = null;
		}

		return function() {
			if (timer) return;

			timer = setTimeout(run, delay);
		}
	}

	return {
		template: '<input type="text" ng-model="search.keyword" placeholder="{{placeholder}}" /><button class="button" ng-bind="actionText"></button>',
		replace: true,
		restrict: 'C',
		scope: {
			onsearch: '&',
			placeholder: '@',
			actionText: '@'
		},
		link: function($scope, $element, $attrs) {
			$scope.search = {};

			var handler = $scope.onsearch,
				trigger = debounce(function() {
					handler($scope.search.keywords);
				}, $attrs.delay || 50);

			$scope.$watch('search.keywords', handler);
		}
	}
})
$module.controller('HeaderController', ['$scope', '$state',
	function($scope, $state) {
		$scope.searchByName = function(name) {
			$state.go('app.people.search', {
				name: name
			});
		};
	}
]);
$module.controller('People/SearchController', function() {

});
$module.controller('People/TrendingController', function() {

});
$module.factory('SearchFilter', function() {
	function SearchFilter() {
		if (!this instanceof SearchFilter) {
			return new SearchFilter();
		}

		this.clearFilters();
		this.clearSorting();
	}

	SearchFilter.prototype = {
		constructor: SearchFilter,

		clearFilters: function() {
			this.$filter = {};
		},

		clearSorting: function() {
			this.$sort = null;
		},

		setFilter: function(name, value) {
			this.$filter[name] = value;
		},

		setSorting: function(rule, direction) {
			this.$sort = {
				name: rule,
				direction: direction || 'asc'
			};
		},

		setPageParams: function(page, limit) {
			this.$page = Math.abs(page | 0);
			this.$limit = limit | 0;
		},

		getParams: function() {
			return {
				filter: this.$filter,
				sort: this.$sort,
				page: this.$page,
				limit: this.$limit
			}
		}
	};

	return SearchFilter;
});
$module.factory('UserService', ['$http', 'assert', 'is', 'SearchFilter', 'rejected',
	function($http, assert, is, SearchFilter, rejected) {
		return {
			GENDER_MALE: 'male',
			GENDER_FEMALE: 'female',

			findOne: function(uid) {
				if (!uid) {
					return rejected(new Error('Identificação de usuário inválida'));
				}

				return $http.get('/user/' + uid);
			},

			/**
			 * @param {SearchFilter} filters
			 * 		String name
			 * 		String gender
			 * 		Number height
			 * 		Number uid
			 */
			findAll: function(filters) {
				try {
					assert(filters instanceof SearchFilter, 'Parâmetros de busca inválidos');
				} catch (e) {
					return rejected(e);
				}

				return $http.post('/user', filters.getParams());
			},

			create: function(userInfo) {
				try {
					is.number(+userInfo.uid, 'CPF inválido');
					is.number(+userInfo.height, 'Altura inválida');
					is.not.empty(userInfo.name, 'Nome inválido');
					is.not.empty(userInfo.gender, 'Sexo não informado');
				} catch (e) {
					return rejected(e);
				}

				return $http.post('/user', userInfo);
			}
		};
	}
]);


}());