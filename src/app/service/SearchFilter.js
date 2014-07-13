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

		clearFilters: function() {
			this.$filter = {};
		},

		clearSorting: function() {
			this.$sort = null;
		},

		setFilter: function(name, value) {
			this.$filter[name] = value;
		},

		setSorting: function(rule, direction) {
			this.$sort = {
				name: rule,
				direction: direction || 'asc'
			};
		},

		setPageParams: function(page, limit) {
			this.$page = Math.abs(page | 0);
			this.$limit = limit | 0;
		},

		getParams: function() {
			return {
				filter: this.$filter,
				sort: this.$sort,
				page: this.$page,
				limit: this.$limit
			}
		}
	};

	return SearchFilter;
});