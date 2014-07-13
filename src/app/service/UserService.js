$module.factory('UserService', ['$http', 'assert', 'is', 'SearchFilter', 'rejected',
	function($http, assert, is, SearchFilter, rejected) {
		return {
			GENDER_MALE: 'male',
			GENDER_FEMALE: 'female',

			findOne: function(uid) {
				if (!uid) {
					return rejected(new Error('Identificação de usuário inválida'));
				}

				return $http.get('/user/' + uid);
			},

			/**
			 * @param {SearchFilter} filters
			 * 		String name
			 * 		String gender
			 * 		Number height
			 * 		Number uid
			 */
			findAll: function(filters) {
				try {
					assert(filters instanceof SearchFilter, 'Parâmetros de busca inválidos');
				} catch (e) {
					return rejected(e);
				}

				return $http.post('/user', filters.getParams());
			},

			create: function(userInfo) {
				try {
					is.number(+userInfo.uid, 'CPF inválido');
					is.number(+userInfo.height, 'Altura inválida');
					is.not.empty(userInfo.name, 'Nome inválido');
					is.not.empty(userInfo.gender, 'Sexo não informado');
				} catch (e) {
					return rejected(e);
				}

				return $http.post('/user', userInfo);
			}
		};
	}
]);