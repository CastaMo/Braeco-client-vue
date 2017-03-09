<template>
    <div id='Member-Coupon'>
        <transition name="fade" mode="out-in">
    		<coupon-blank
                v-if="!order_for_already || order_for_already.length <= 0"
                v-on:btn-click="routeToCouponView"
            ></coupon-blank>
        </transition>
    </div>
</template>


<script>

module.exports = {
    name: 'member-coupon',
    data() {
        return {
            choose: -1
        };
    },
    computed: {
    	couponorder: function() {
    		return this.$store.state.requireData.couponorder;
    	}
    },
    methods: {
    	routeToCouponView() {
    		if (!this.$store.state.isLoaded) {
                return;
            }
            let categoryId = this.$store.state.requireData.menu.categories[0].id;
            this.$router.push(`/menu/main/${categoryId}`);
    	}
    },
    components: {
    	'coupon-blank': require("./coupon-blank")
    }
}

</script>

<style scoped lang="less"></style>
