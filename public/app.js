(function(undefined){

var $module = angular.module('fling', ['ui.router', 'assert', 'defer', 'ngSanitize'])

.config(['assertProvider',
	function(assertProvider) {
		assertProvider.enableThrow(true);
	}
]);
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
$module.config(['$stateProvider',
	function($stateProvider) {
		var states = {
			'app': {
				url: '',
				templateUrl: '/layout/layout.html'
			},

			'app.user': {
				abstract: true,
				template: '<ui-view/>'
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
$module.directive('controlGroup', function() {
	return {
		restrict: 'C',
		compile: function($element, $attrs) {
			if ('required' in $attrs) {
				['input', 'select', 'textarea'].forEach(function(el) {
					$element.find(el).attr('ng-required', 'true');
				});
			}
		}
	};
});
$module.directive('form', function() {
	return {
		restrict: 'C',
		link: function($scope, $element) {
			setTimeout(function() {
				var inputs = $element.find('input, textarea, select, button'),
					i = 0,
					len = inputs.length,
					input;

				for (; i < len; i++) {
					input = angular.element(inputs[i]);
					if (input.attr('autofocus')) {
						inputs[i].focus();
						break;
					}
				}
			});
		}
	}
})
$module.directive('person', function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			person: '='
		},
		template: '<div class="person">' +
			'<a class="name" ng-bind="person.name" ng-click="selectPerson()"></a>' +
			'<div class="gender" ng-bind="person.gender" ng-click="selectGender()"></div>' +
			'<div class="height" ng-bind="person.height" ng-click="selectHeight()"></div>' +
			'<span></span>' +
			'</div>',

		controller: 'PersonController'
	}
});

$module.controller('PersonController', ['$scope',
	function($scope) {
		$scope.selectGender = function() {
			$scope.$emit('filter.selected', 'gender', $scope.$eval('person.gender'));
		};

		$scope.selectHeight = function() {
			$scope.$emit('filter.selected', 'minHeight', $scope.$eval('person.height'));
		};

		$scope.selectName = function($event) {
			$scope.$emit('filter.selected', 'uid', $scope.$eval('person.uid'));
		};

	}
]);
$module.directive('radioGroup', function() {
	var $uid = 1;

	function uid() {
		return 'input--radio-' + ($uid++);
	}

	return {
		restrict: 'C',
		link: function($scope, $element) {
			var inputs = $element.find('input'),
				len = inputs.length,
				i = 0,
				id, input, label;

			for (; i < len; i++) {
				input = angular.element(inputs[i]);
				label = input.next();

				if (!label.attr('for')) {
					id = uid();
					label.attr('for', id);
					input.attr('id', id);
					//angular.element(label.find('input')[0])
				}
			}
		}
	}
})
$module.directive('searchBox', function() {

	function debounce(fn, delay) {
		var timer = null;
		return function() {
			timer || (timer = setTimeout(function() {
				timer = false;
				fn();
			}, delay));
		};
	}

	return {
		template: '<div ng-class="{\'with-button\': withButton}"><input type="text" ng-attr-tabindex="{{tabindex}}" ng-class="{mini:mini}" ng-model="search.keywords" placeholder="{{placeholder}}" ng-enter="doSearch()" class="input" /><button ng-if="withButton" class="primary button" ng-click="doSearch()" ng-bind="actionText" type="submit" ng-class="{mini:mini}"></button></div>',
		restrict: 'C',
		scope: {
			onsearch: '&',
			onchange: '&',
			placeholder: '@',
			actionText: '@',
			tabindex: '@'
		},

		link: function($scope, $element, $attrs) {
			$scope.search = {};

			var onchange = $scope.onchange(),
				onsearch = $scope.onsearch(),
				onchangeTrigger = debounce(function() {
					onchange && onchange($scope.search.keywords);
				}, $attrs.delay || 200);

			$scope.$watch('search.keywords', onchangeTrigger);
			$scope.mini = ('mini' in $attrs);
			$scope.withButton = ('button' in $attrs);

			$scope.doSearch = function() {
				onsearch && onsearch($scope.search.keywords);
			};
		}
	}
})
$module.directive('tabset', function() {
	return {
		restrict: 'C',
		transclude: true,
		scope: {
			onselect: '&'
		},
		template: '<div tab-buttons="$parent.labels" active="$parent.tabs.active" onselect="$parent.openTab($tab)"></div><div ng-transclude></div>',
		controller: ['$scope',
			function($scope) {
				var tabs = $scope.tabs = [],
					labels = $scope.labels = [];

				tabs.active = 0;

				this.register = function(tabEl, tabAttr) {
					tabs.push(tabEl);
					labels.push(tabAttr.label || '');

					if ('active' in tabAttr) {
						tabs.active = tabs.length - 1;

						if (tabAttr.active) {
							$scope.$watch(tabAttr.active, function(isActive) {
								if (isActive) openTabByElement(tabEl);
							});
						}
					}
				};

				function openTabByElement(el) {
					for (var i = 0, len = tabs.length; i < len; i++) {
						if (el === tabs[i]) {
							openTab(i);
							break;
						}
					}
				}

				var openTab = $scope.openTab = this.openTab = function($tab) {
					tabs.forEach(function(tab, current) {
						if (current === $tab) {
							tab.addClass('active');
							tabs.active = $tab;
							$scope.onselect($scope, {
								tab: tab
							});
						} else {
							tab.removeClass('active');
						}
					});
				};

				setTimeout(function() {
					if (tabs.active) {
						$scope.openTab(tabs.active);
					} else {
						$scope.openTab(0);
					}
				});

				$scope.$on('$destroy', function() {
					tabs.length = 0;
				});
			}
		]
	};
})

.directive('tabButtons', ['$parse',
	function($parse) {
		return {
			replace: true,
			scope: {},
			template: '<div class="tab-buttons"><span class="tab-button" ng-class="{active: isActive($index)}" ng-repeat="tab in tabs track by $index" ng-click="selectTab($index)">{{tab}}</span></div>',

			link: function($scope, $element, $attrs) {
				$scope.tabs = $scope.$eval($attrs.tabButtons);

				var onselect = $parse($attrs.onselect)($scope);

				$scope.isActive = function(index) {
					return +$parse($attrs.active)($scope) == index;
				};

				$scope.selectTab = function(index) {
					onselect && onselect(index);
				};
			}
		};
	}
])

.directive('tab', function() {
	return {
		restrict: 'C',
		require: '?^tabset',
		link: function($scope, $element, $attrs, tabset) {
			tabset.register($element, $attrs);
		}
	};
});
$module.directive('tagBar', function() {
	return {
		restrict: 'A',
		scope: {
			tags: '=tagBar'
		},
		template: '<ul class="tag-bar"><li class="tag" ng-repeat="tag in tags"><span>{{tag.label}}</span> <a ng-click="removeTag(tag)">&times;</a></li></ul>',
		link: function($scope) {
			$scope.removeTag = function(tag) {
				$scope.$emit('tag.remove', tag);
			};
		}
	}
});
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
$module.controller('MenuController', ['$scope', 'UserService',
	function($scope, UserService) {
		$scope.hasProfileActive = function() {
			return UserService.hasProfileActive();
		};
	}
]);
$module.controller('People/SearchController', ['$scope', '$state', '$stateParams', 'UserService', 'SearchFilter',
	function($scope, $state, $stateParams, UserService, SearchFilter) {
		var filters = $scope.filters = new SearchFilter();

		$scope.$on('filter.changed', updateResults);
		$scope.$on('filter.selected', function($e, name, value) {
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
			$state.go($state.current.name, params, {
				inherit: false
			});

			UserService.findAll(filters).then(function(results) {
				$scope.results = results;
			}, function(results) {
				console.log(results);
			});
		}

		updateResults();
	}
]);
$module.controller('People/TrendingController', function() {

});
$module.directive('searchTags', ['genderFilter',
	function(genderFilter) {
		return {
			scope: {
				filters: '='
			},
			template: '<div tag-bar="searchTags"></div>',
			link: function($scope) {
				var tags = $scope.searchTags = [],
					filters = $scope.filters.$filter;

				function updateTags() {
					tags.length = 0;

					if (+filters.minHeight) {
						tags.push({
							label: 'Altura mínima: ' + filters.minHeight,
							name: 'minHeight'
						});
					}

					if (+filters.maxHeight) {
						tags.push({
							label: 'Altura máxima: ' + filters.maxHeight,
							name: 'maxHeight'
						});
					}

					if (+filters.height) {
						tags.push({
							label: 'Altura: ' + filters.height,
							name: 'height'
						});
					}

					if (filters.name) {
						tags.push({
							label: 'Nome: ' + filters.name,
							name: 'name'
						});
					}

					if (filters.gender) {
						tags.push({
							label: 'Sexo: ' + genderFilter(filters.gender),
							name: 'gender'
						});
					}
				}

				$scope.$on('tag.remove', function($e, tag) {
					$scope.filters.unsetFilter(tag.name);
					updateTags();
					$scope.$emit('filter.changed');
				});

				updateTags();
			}
		};
	}
]);
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

		setFilters: function(filter) {
			this.$filter = filter;
		},

		setFilter: function(name, value) {
			this.$filter[name] = value;
		},

		unsetFilter: function(name) {
			this.$filter[name] = null;
			delete this.$filter[name];
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
				filter: angular.copy(this.$filter),
				sort: angular.copy(this.$sort),
				page: this.$page,
				limit: this.$limit
			}
		}
	};

	return SearchFilter;
});
$module.factory('UserService', ['$http', 'assert', 'is', 'SearchFilter', 'rejected',
	function($http, assert, is, SearchFilter, rejected) {
		var profile = null;

		return {
			GENDER_MALE: 'male',
			GENDER_FEMALE: 'female',

			/**
			 * @return Boolean
			 */
			hasProfileActive: function() {
				return profile !== null;
			},

			/**
			 * @param {Number} uid
			 */
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

				return $http.get('/user', {
					params: filters.getParams()
				}).then(function(response) {
					return response.data;
				});
			},

			/**
			 * @param {Object} userInfo
			 */
			create: function(userInfo) {
				try {
					is.number(+userInfo.uid, 'CPF inválido');
					is.number(+userInfo.height, 'Altura inválida');
					is.not.empty(userInfo.name, 'Nome inválido');
					is.not.empty(userInfo.gender, 'Sexo não informado');
				} catch (e) {
					return rejected(e);
				}

				return $http.post('/user', userInfo).then(function() {
					return profile = userInfo;
				});
			}
		};
	}
]);
$module.filter('gender', ['UserService',
	function(UserService) {
		return function(gender) {
			if (gender === UserService.GENDER_MALE) return 'masculino';
			if (gender === UserService.GENDER_FEMALE) return 'feminino';

			return '';
		};
	}
]);

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
}());