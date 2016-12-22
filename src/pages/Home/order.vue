<template>
	<div id="Home-Order">
        <transition name="fade" mode="out-in">
    		<order-blank-page
                v-if="!orderForAlready || orderForAlready.length <= 0"
                v-on:menu-icon-click="routeToMenu"
            ></order-blank-page>
            <order-main
                v-else
            ></order-main>
        </transition>

	</div>
</template>

<script>
module.exports = {
	name: 'home-order',

    computed: {
        orderForAlready: function() {
            return this.$store.state.order.orderForAlready;
        }
    },

	created() {
        if (this.$root.isLoaded) {
            this.init();
        }
        let vm = this;
        this.$root.$on("root:getData", function() {
            setTimeout(function() {
                vm.init();
            }, 200);
        });
	},

    beforeDestroy() {
        this.$root.$off("root:getData");
    },

    methods: {
        init() {

        },
        routeToMenu() {
            if (!this.$store.state.isLoaded) {
                return;
            }
            let categoryId = this.$store.state.requireData.menu.categories[0].id;
            this.$root.$router.push(`/menu/main/${categoryId}`);
        }
    },

	components: {
        "order-blank-page": require("./components/order-blank-page"),
        "order-main": require("./components/order-main")
	}
}


</script>
