const HomeMenu = function(resolve) {
    return require(['./pages/Home/menu.vue'], resolve);
}
const HomeOrder = function(resolve) {
    return require(['./pages/Home/order.vue'], resolve);
}
const HomeMember = function(resolve) {
    return require(['./pages/Home/member.vue'], resolve);
}

const routes = [
    { path: '/', redirect: '/home/menu/x'},
    { path: '/home/menu', component: HomeMenu},
    { path: '/home/order', component: HomeOrder},
    { path: '/home/member', component: HomeMember}
];

module.exports = routes;