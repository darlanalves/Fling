$module.factory('SearchFilter', function() {
	function SearchFilter() {
		if (!this instanceof SearchFilter) {
			return new SearchFilter();
		}

		this.clearFilters();
		this.clearSorting();
	}

	SearchFilter.prototype = {
		constructor: SearchFilter,
		ASC: 'asc',
		DESC: 'desc',

		clearFilters: function() {
			this.$filter = {};
		},

		clearSorting: function() {
			this.$sort = null;
		},

		setFilters: function(filter) {
			this.$filter = filter;
		},

		setFilter: function(name, value) {
			this.$filter[name] = value;
		},

		unsetFilter: function(name) {
			this.$filter[name] = null;
			delete this.$filter[name];
		},

		setSorting: function(rule, direction) {
			this.$sort = {
				name: rule,
				direction: direction || this.ASC
			};
		},

		setPageParams: function(page, limit) {
			this.$page = Math.abs(page | 0);
			this.$limit = limit | 0;
		},

		getParams: function() {
			return {
				filter: angular.copy(this.$filter),
				sort: angular.copy(this.$sort),
				page: this.$page,
				limit: this.$limit
			}
		}
	};

	return SearchFilter;
});