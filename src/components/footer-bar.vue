<template>
    <transition :name="transitionName" mode="out-in">
        <div class='footer-bar' v-show="routeLastItem">
            <ul class='bottom-field'>
                <li v-for="liItem in liData"
                    class="bottom-item"
                    v-bind:id="`bottom-item-${liItem}`"
                    v-on:click="liClickEvent(liItem)"
                    v-bind:class="{'choose': (routeLastItem === liItem)}"
                ></li>
            </ul>
        </div>
    </transition>
</template>

<script>

module.exports = {
    name: 'footer-bar',
    data() {
        return {
            liData: [
                "menu",
                "order",
                "member"
            ],
            routeLastItem: '',
            transitionName: ''
        }
    },
    mounted() {
        let vm = this;
        let routeLastItem = this.$root.$route.path.split("/").pop();
        let routeFirstItem = this.$root.$route.path.split("/")[1];
        vm.transitionName = 'slide-bottom';
        vm.setRouteLastItem(routeLastItem);

        vm.$root.$watch("$route", function(to, from) {
            let toPath = to.path;
            let fromPath = from.path;
            let routeLastItem = toPath.split("/").pop();
            let routeFirstItem = vm.$root.$route.path.split("/")[1];
            vm.setRouteLastItem(routeFirstItem, routeLastItem);

            let toRouteFirstItem = toPath.split("/")[1];
            let fromRouteFirstItem = fromPath.split("/")[1];
            if (toRouteFirstItem !== fromRouteFirstItem) {
                vm.transitionName = 'slide-bottom';
            } else {
                vm.transitionName = '';
            }
        });
    },
    methods: {
        liClickEvent(item) {
            this.$root.$router.push(`/home/${item}`);
        },
        setRouteLastItem(routeFirstItem, routeLastItem) {
            let vm = this;
            vm.routeLastItem = '';
            if (routeFirstItem !== 'home') {
                return;
            }
            this.liData.every(function(liItem) {
                if (liItem === routeLastItem) {
                    vm.routeLastItem = routeLastItem;
                    return false;
                }
                return true;
            });
        }
    }
}

</script>

<style lang="less" scoped>
.background-linear-gradient(@from: rgba(0, 0, 0, 0), @to: rgba(0, 0, 0, 1)) {
    background: -webkit-linear-gradient(@from, @to);
    background: -o-linear-gradient(@from, @to);
    background: -moz-linear-gradient(@from, @to);
    background: linear-gradient(@from, @to);
}

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    ul.bottom-field {
        height: 55px;
        width: 100%;
        .background-linear-gradient(rgba(38, 38, 38, 0.9), rgba(0, 0, 0, 0.9));
        > *:not(.clear) {
            float: left;
        }
        li {
            width: 33.3%;
            height: 100%;
            .background-norm();
            &#bottom-item-menu {
                background-size: 25px 44px;
                background-image: url("../assets/menu-unchecked.png");
                &.choose {
                    background-image: url("../assets/menu-checked.png");
                }
            }
            &#bottom-item-order {
                background-size: 29px 45px;
                background-image: url("../assets/order-unchecked.png");
                &.choose {
                    background-image: url("../assets/order-checked.png");
                }
            }
            &#bottom-item-member {
                background-size: 22px 45px;
                background-image: url("../assets/member-unchecked.png");
                &.choose {
                    background-image: url("../assets/member-checked.png");
                }
            }
        }
    }
}

</style>
