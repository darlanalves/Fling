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