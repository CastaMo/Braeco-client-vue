<template>
	<div id="Home-Order">
        <transition name="fade" mode="out-in">
    		<order-blank-page
                v-if="!order_for_already || order_for_already.length <= 0"
                v-on:menu-icon-click="routeToMenu"
            ></order-blank-page>
            <order-main
                v-else
                v-on:order-already-item-click="routeToMemberOrder"
            ></order-main>
        </transition>

	</div>
</template>

<script>
module.exports = {
	name: 'home-order',

    computed: {
        order_for_already: function() {
            return this.$store.state.order.order_for_already;
        }
    },


    methods: {
        routeToMenu() {
            if (!this.$store.state.isLoaded) {
                return;
            }
            let categoryId = this.$store.state.requireData.menu.categories[0].id;
            this.$root.$router.push(`/menu/main/${categoryId}`);
        },
        routeToMemberOrder(id) {
            this.$router.push(`/member/order/${id}`);
        }
    },

	components: {
        "order-blank-page": require("./components/order-blank-page"),
        "order-main": require("./components/order-main")
	}
}


</script>
