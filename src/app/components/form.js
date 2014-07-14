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