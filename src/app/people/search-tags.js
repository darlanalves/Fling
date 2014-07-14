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