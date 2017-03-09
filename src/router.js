
const HomeMenu = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Home'], function(component) {
        var Home = require("./pages/Home");
        var component = Home.menu;
        resolve(component);
        NProgress.done();
    }, "Home");
}
const HomeOrder = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Home'], function(component) {
        var Home = require("./pages/Home");
        var component = Home.order;
        resolve(component);
        NProgress.done();
    }, "Home");
    // return require(['./pages/Home/order.vue'], resolve);
}
const HomeMember = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Home'], function(component) {
        var Home = require("./pages/Home");
        var component = Home.member;
        resolve(component);
        NProgress.done();
    }, "Home");
    // return require(['./pages/Home/member.vue'], resolve);
}

const ActivityMain = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Activity'], function(component) {
        var Activity = require("./pages/Activity");
        var component = Activity.main;
        resolve(component);
        NProgress.done();
    }, "Activity");
    // return require(['./pages/Activity/main.vue'], resolve);
}
const ActivityInfo = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Activity'], function(component) {
        var Activity = require("./pages/Activity");
        var component = Activity.info;
        resolve(component);
        NProgress.done();
    }, "Activity");
    // return require(['./pages/Activity/info.vue'], resolve);
}

const MenuInfo = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Menu'], function(component) {
        var Menu = require("./pages/Menu");
        var component = Menu.info;
        resolve(component);
        NProgress.done();
    }, "Menu");
    // return require(['./pages/Menu/info.vue'], resolve);
}
const MenuMain = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Menu'], function(component) {
        var Menu = require("./pages/Menu");
        var component = Menu.main;
        resolve(component);
        NProgress.done();
    }, "Menu");
	// return require(['./pages/Menu/main.vue'], resolve);
}
const MenuCombo = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Menu'], function(component) {
        var Menu = require("./pages/Menu");
        var component = Menu.combo;
        resolve(component);
        NProgress.done();
    }, "Menu");
    // return require(['./pages/Menu/combo.vue'], resolve);
}
const MenuOrder = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Menu'], function(component) {
        var Menu = require("./pages/Menu");
        var component = Menu.order;
        resolve(component);
        NProgress.done();
    }, "Menu");
    // return require(['./pages/Menu/order.vue'], resolve);
}

const MemberPay = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Member'], function(component) {
        var Member = require("./pages/Member");
        var component = Member.pay;
        resolve(component);
        NProgress.done();
    }, "Member");
    // return require(['./pages/Member/pay.vue'], resolve);
}
const MemberRecharge = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Member'], function(component) {
        var Member = require("./pages/Member");
        var component = Member.recharge;
        resolve(component);
        NProgress.done();
    }, "Member");
    // return require(['./pages/Member/recharge.vue'], resolve);
}
const MemberOrder = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Member'], function(component) {
        var Member = require("./pages/Member");
        var component = Member.order;
        resolve(component);
        NProgress.done();
    }, "Member");
    // return require(['./pages/Member/order.vue'], resolve);
}

const MemberCoupon = function(resolve) {
    NProgress.start();
    return require.ensure(['./pages/Member'], function(component) {
        var Member = require("./pages/Member");
        var component = Member.coupon;
        resolve(component);
        NProgress.done();
    }, "Member");
    // return require(['./pages/Member/order.vue'], resolve);
}

const test = function(resolve) {
	return require(['./specialRoute/test.vue'], resolve);
}

const routes = [

    { path: '/home/menu', component: HomeMenu},
    { path: '/home/order', component: HomeOrder},
    { path: '/home/member', component: HomeMember},

    { path: '/activity/main', component: ActivityMain},
    { path: '/activity/info/:activityId', component: ActivityInfo},

    { path: '/menu/info/:foodId', component: MenuInfo},
    { path: '/menu/main/:categoryId', component: MenuMain},
    { path: '/menu/combo/:comboId', component: MenuCombo},
    { path: '/menu/order', component: MenuOrder},

    { path: '/member/pay/:payType', component: MemberPay},
    { path: '/member/recharge', component: MemberRecharge},
    { path: '/member/order/:orderId', component: MemberOrder},
    { path: '/member/coupon/:type', component: MemberCoupon},

    { path: '/test', component: test},
    { path: '/', redirect: '/home/menu/x'}
];


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
