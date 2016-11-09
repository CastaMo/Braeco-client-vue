
const routes = require('./routes.js');
const routeWeight = require("./routeWeight.js");
const config = require("./utils/config.js");
const components = require('./components/index.js');


const style = require('./style/index.less');

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
let count = 3,
    requireData = {};
let init = function() {
    new Vue({
        router: router,
        data() {
            return {
                transitionName: "page-fade",
                requireData: requireData,
                runningData: {}
            }
        },
        created() {
            this.checkIsUnfiniteState();
        },
        methods: {
            checkIsUnfiniteState() {
                let routerArray = this.$route.path.split('/')
                if (routerArray.pop() === 'x') {
                    router.push(routerArray.join("/"));
                }
            },
            checkForTransition(toPath, fromPath) {
                let to = toPath.split("/");
                to.shift();
                let from = fromPath.split("/");
                from.shift();

                let toValue = -10,
                    fromValue = -20;
                if (to.length === 0) {
                    toValue = -10;
                } else if (to.length >= 2) {
                    toValue = routeWeight[to[0]].value;
                    toValue += routeWeight[to[0]].next[to[1]].value;
                }
                if (from.length === 0) {
                    fromValue = -10;
                } else if (from.length >= 2) {
                    fromValue = routeWeight[from[0]].value;
                    fromValue += routeWeight[from[0]].next[from[1]].value;
                }

                this.transitionName = "page-fade";
                if (toValue - fromValue <= 4 && toValue >= fromValue) {
                    this.transitionName = "page-slide-left";
                } else if (fromValue - toValue <= 4 && fromValue >= toValue) {
                    this.transitionName = "page-slide-right";
                }
                console.log(toValue, fromValue);

            }
        },
        watch: {
            $route: function(to, from) {
                this.checkIsUnfiniteState();
                this.checkForTransition(to.fullPath, from.fullPath);
                console.log(arguments);
            }
        },
        components: {
            "footer-bar": Vue.component("footer-bar"),
            "router-link": Vue.component("router-link"),
            "router-view": Vue.component("router-view")
        }
    }).$mount('#braeco-client');
}

//试试箭头函数
let getData = requireName =>
    requireManage.get(requireName).require({
        method: "GET",
        success: function(result) {
            let data = result.data;
            if (result.message === "success") {
                for (let key in data) {
                    requireData[key] = data[key];
                }
                count--;
            }
            if (count === 0) {
                console.log(JSON.parse(JSON.stringify(requireData)));
                NProgress.done();
                init();
            }
        },
        always: function() {
            NProgress.done();
        }
    });

NProgress.start();
getData("getTableDinner");
getData("getTableLimit");
getData("getTableMember");
