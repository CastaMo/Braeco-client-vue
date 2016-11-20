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
		value: 100,
		next: {
			main: {value: 0},
			info: {value: 1}
		}
	},
	menu: {
		value: 200,
		next: {
			info: {value: 0},
			main: {value: 1},
			order: {value: 2}
		}
	}
};

module.exports = routeWeight;
