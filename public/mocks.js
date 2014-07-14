(function(undefined){

var $module = angular.module('fling-mock', ['fling', 'ngMockE2E']);
$module.run(function($httpBackend) {
	var users = {},
		userList = [],
		uid = 11670825078;

	$httpBackend.whenGET(/\/user/).respond(function() {
		return [200, userList];
	});

	function user(id) {
		uid++;
		return {
			uid: String(uid),
			name: name(),
			height: ~~(Math.random() * 200),
			gender: Math.random() > .5 ? 'male' : 'female'
		};
	}

	var names = ['John Doe', 'Peter Dalsh', 'Dahl Wheaton', 'Mary Jhones', 'Jane Whales'];

	function name() {
		return names[Math.floor(Math.random() * names.length)];
	}

	var i = 5;
	while (i--) userList.push(user());

	i = 100;
	while (i--) {
		names.push(name());
	}
});
}());