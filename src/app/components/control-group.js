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