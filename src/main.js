
const config = require("./common/config.js");
const style = require('./style/index.less');

window.onerror = function(msg, url, line, col, error) {
    if (error && error.stack && error.stack.indexOf("JSON.parse") >= 0) {
        mainVM.$emit("tips:error", "请求数据失败, 请退出重新扫码");
    };
}

//试试箭头函数
let getData = requireName =>
    requireManage.get(requireName).require({
        method: "GET",
        success: function(result) {
            let data = result.data;
            NProgress.inc(0.3);
            try {
                if (result.message === "success") {
                    for (let key in data) {
                        requireData[key] = data[key];
                    }
                    count--;
                }
                if (count === 0) {
                    console.log(JSON.parse(JSON.stringify(requireData)));
                    NProgress.done();
                    mainVM.$emit("tips:success", "初始化成功！");
                    mainVM.$store.dispatch("getData", {
                        requireData: requireData
                    });
                    setTimeout(function() {
                        mainVM.init();
                    }, 205);
                }
            } catch (e) {
                mainVM.$emit("tips:error", "请求数据失败, 请退出重新扫码");
            }
        }
    });

NProgress.start();
getData("getTableDinner");
getData("getTableLimit");
getData("getTableMember");
getData("getOrderQuery");

const routeWeight = require("./routeWeight.js");
const utils = require("./utils/index.js");


let count = 4,
    requireData = {};
let initMainVM = function() {
    return new Vue({
        router: router,
        store: store,
        data() {
            return {
                transitionName: "page-fade"
            }
        },
        computed: {
            orderForTrolley: function() {
                return this.$store.state.order.orderForTrolley;
            },
            final_coupon: function() {
                return this.$store.getters.final_coupon;
            },
            total_final_price: function() {
                return this.$store.getters.total_final_price;
            }
        },
        created() {
            this.checkIsUnfiniteState();
            let vm = this;
        },
        methods: {
            init() {
                let vm = this;
                let lsOrderForTrolley = this.readFromLocStor('orderForTrolley');

                let coupon_id = this.readFromLocStor('coupon-id') || "";

                if (coupon_id) {
                    this.$store.commit("order:confirm-coupon-id", {
                        coupon_id: coupon_id
                    });
                }

                let validate_opts = {
                    lsOrderForTrolley: lsOrderForTrolley
                };
                validate_opts = Vue.util.extend(validate_opts, {
                    failCallback: function(food_name_str) {
                        vm.$emit("tips:error", `${food_name_str} 数量不足`);
                    },
                    dishMap: vm.$store.getters.dishMap
                });
                this.$store.dispatch("order:validate-and-assign-for-orderForTrolley", validate_opts);
                
                this.$store.commit("user:try-login", {
                    member_info: this.$store.state.requireData.member_info
                });
            },
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
                    fromValue = -100;
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
                if (toValue - fromValue <= 20 && toValue > fromValue) {
                    this.transitionName = "page-slide-left";
                } else if (fromValue - toValue <= 20 && fromValue > toValue) {
                    this.transitionName = "page-slide-right";
                }
            },
            readFromLocStor(key) {
                return JSON.parse(utils.locStor.get(key) || "[]");
            },
            saveToLocStor(key, val) {
                utils.locStor.set(key, val);
            }
        },
        watch: {
            $route: function(to, from) {
                this.checkIsUnfiniteState();
                this.checkForTransition(to.fullPath, from.fullPath);
                this.$store.dispatch("property:endFoodProperty");
                this.$store.dispatch("user:endUserLogin");
                this.$store.dispatch("combo-delete:endComboDelete");
            },
            orderForTrolley: {
                handler: function(newData, oldData) {
                    this.saveToLocStor("orderForTrolley", JSON.stringify(newData));
                },
                deep: true
            },
            final_coupon: function(newData, oldData) {
                if (this.total_final_price) {
                    this.saveToLocStor("coupon-id", newData.id || "");
                }
            }
        },
        components: {
            "footer-bar": require("./components/footer-bar"),
            "trolley-footer-bar": require("./components/trolley-footer-bar"),
            "tips": require("./components/tips"),
            "user-login": require("./components/user-login")
        }
    });
}


var mainVM,
    store,
    router;


window.Vue = require("vue");
const lazyLoad = require("./common/vue-lazyload.js");

Vue.use(lazyLoad, {
  try: 3 // default 1
});

store = require("./store/index.js");

router = require("./router.js");

const sync = require("vuex-router-sync").sync;
sync(store, router);

mainVM = initMainVM();

mainVM.$mount('#braeco-client');

