<template>
	<div id="Home-Order">
        <transition name="fade" mode="out-in">
    		<order-blank-page
                v-if="!orderItems"
                v-on:menu-icon-click="routeToMenu"
            ></order-blank-page>
        </transition>
	</div>
</template>

<script>
module.exports = {
	name: 'home-order',
    data() {
        return {
            orderItems: null
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
        "order-blank-page": require("./components/order-blank-page")
	}
}


</script>
