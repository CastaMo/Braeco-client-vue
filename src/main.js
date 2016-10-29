const components = require('./components/index.js');
const routes = require('./routes.js');

const config = require("./utils/config.js");

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
        mounted() {
            this.checkIsUnfiniteState();
        },
        methods: {
            checkIsUnfiniteState() {
                let routerArray = this.$route.path.split('/')
                if (routerArray.pop() === 'x') {
                    router.push(routerArray.join("/"));
                }
            }
        },
        components: {
            "footer-bar": Vue.component("footer-bar"),
            "router-link": Vue.component("router-link"),
            "router-view": Vue.component("router-view")
        },
        watch: {
            "$route"(to, from) {
                this.checkIsUnfiniteState();
                this.$emit("root:route-change", to.path);
            }
        }
    }).$mount('#braeco-client');
}

//试试箭头函数
let getData = url =>
    Vue.http.get(url)
        .then(function(resp) {
            let result = (resp.data),
                data = resp.data.data;
            if (result.message === "success") {
                for (let key in data) {
                    requireData[key] = data[key];
                }
                count--;
            }
            if (count === 0) {
                NProgress.done();
                init();
            }
        })
        .finally(function() {});


NProgress.start();
getData("/Table/Dinner");
getData("/Table/Limit");
getData("/Table/Member");