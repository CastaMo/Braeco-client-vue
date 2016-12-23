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
            combo: {value: 1},
            main: {value: 2},
            order: {value: 3}
        }
    },
    member: {
        value: 300,
        next: {
            recharge: {value: 0},
            order: {value: 25},
            pay: {value: 50}
        }
    }
};

module.exports = routeWeight;
