(function(undefined){

var $module = angular.module('fling-mock', ['fling', 'ngMockE2E']);
$module.run(function($httpBackend) {
	var users = {},
		userList = [],
		uid = 11670825078,
		i, u;

	$httpBackend.whenGET(/\/user\?.+/).respond(userList);

	$httpBackend.whenGET(/\/user\/.+/).respond(function(method, url, data) {
		var uid = url.match(/\/user\/(.+)/)[1];
		if (users[uid]) {
			return [200, users[uid]];
		}

		return [404];
	});

	$httpBackend.whenPOST('/user').respond(function(m, u, data) {
		if (data) {
			data = JSON.parse(data);
			users[data.uid] = data;
			userList.push(data);
			return [200, data];
		}

		return [400];
	});

	function user(id) {
		uid++;
		return {
			uid: String(uid),
			name: name(),
			height: ~~(Math.random() * 200),
			gender: Math.random() > .5 ? 'male' : 'female',
			views: ~~(Math.random() * 1000)
		};
	}

	var names = ['John', 'Doe', 'Peter', 'Dalsh', 'Dahl', 'Wheaton', 'Mary', 'Jhones', 'Jane', 'Whales'],
		fullNames = [];

	function name() {
		return names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)];
	}

	function fullName() {
		return fullNames[Math.floor(Math.random() * names.length)];
	}

	i = 100;
	while (i--) {
		fullNames.push(name());
	}

	i = 10;
	while (i--) {
		u = user();
		users[u.uid] = u;
		userList.push(u);
	}
});
}());