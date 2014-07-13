angular.module("fling").run(['$templateCache', function(a) { a.put('', '');
	a.put('', '');
	a.put('', '');
	a.put('', '<ul><li><a ui-sref="app.signup">Inscrever-se</a></li><li><a ui-sref="app.my-profile">Meu perfil</a></li><li><a ui-sref="app.people.trending">Buscar pessoas</a></li></ul>');
	a.put('', '<header class="header" ng-controller="HeaderController"><h1 class="branding"><span>Fling</span></h1><div class="search-box" onsearch="searchByName()" action-text="Go" placeholder="Search people..."></div></header><aside><div ng-include="\'/layout/menu.html\'"></div></aside><section><div ui-view=""></div></section>');
	 }]);