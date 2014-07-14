$module.filter('gender', ['UserService',
	function(UserService) {
		return function(gender) {
			if (gender === UserService.GENDER_MALE) return 'masculino';
			if (gender === UserService.GENDER_FEMALE) return 'feminino';

			return '';
		};
	}
]);