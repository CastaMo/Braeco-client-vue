const routeWeight = {
	home: {
		value: 0,
		next: {
			menu: {value: 0},
			order: {value: 1},
			member: {value: 2}
		}
	},
	activity: {
		value: 10,
		next: {
			main: {value: 0},
			info: {value: 1}
		}
	},
	menu: {
		value: 20,
		next: {
			main: {value: 0}
		}
	}
};

module.exports = routeWeight;
