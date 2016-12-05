const HomeMenu = function(resolve) {
    return require(['./pages/Home/menu.vue'], resolve);
}
const HomeOrder = function(resolve) {
    return require(['./pages/Home/order.vue'], resolve);
}
const HomeMember = function(resolve) {
    return require(['./pages/Home/member.vue'], resolve);
}

const ActivityMain = function(resolve) {
    return require(['./pages/Activity/main.vue'], resolve);
}
const ActivityInfo = function(resolve) {
    return require(['./pages/Activity/info.vue'], resolve);
}

const MenuInfo = function(resolve) {
    return require(['./pages/Menu/info.vue'], resolve);
}
const MenuMain = function(resolve) {
	return require(['./pages/Menu/main.vue'], resolve);
}
const MenuCombo = function(resolve) {
    return require(['./pages/Menu/combo.vue'], resolve);
}
const MenuOrder = function(resolve) {
    return require(['./pages/Menu/order.vue'], resolve);
}

const test = function(resolve) {
	return require(['./specialRoute/test.vue'], resolve);
}

const routes = [
    { path: '/', redirect: '/home/menu/x'},

    { path: '/home/menu', component: HomeMenu},
    { path: '/home/order', component: HomeOrder},
    { path: '/home/member', component: HomeMember},

    { path: '/activity/main', component: ActivityMain},
    { path: '/activity/info/:activityId', component: ActivityInfo},

    { path: '/menu/info/:foodId', component: MenuInfo},
    { path: '/menu/main/:categoryId', component: MenuMain},
    { path: '/menu/combo/:comboId', component: MenuCombo},
    { path: '/menu/order', component: MenuOrder},

    { path: '/test', component: test}
];

const Vue = require("vue");
// const VueRouter = require("vue-router");
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { x: 0, y: 0 };
    }
});

module.exports = router;
