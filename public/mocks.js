(function(undefined){

var $module = angular.module('fling-mock', ['fling', 'ngMockE2E']);
$module.run(function($httpBackend) {
	$httpBackend.whenGET('/foo').respond(200, 'whoo');
});
}());