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