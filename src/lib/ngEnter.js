angular.module('ng').directive('ngEnter', ['$parse',
	function($parse) {
		return {
			compile: function(_element, _attrs) {
				var fn = $parse(_attrs.ngEnter);

				return function($scope, $element) {
					$element.on('keyup', function(event) {
						if (event.keyCode !== 13) return;

						$scope.$apply(function() {
							fn($scope, {
								$event: event
							});
						});
					});
				};
			}
		};
	}
]);