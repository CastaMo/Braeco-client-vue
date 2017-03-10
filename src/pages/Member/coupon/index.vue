<template>
    <div id='Member-Coupon'>
        <transition name="fade" mode="out-in">
    		<coupon-blank
                v-if="!coupon_arr || coupon_arr.length <= 0"
                v-on:btn-click="routeToCouponView"
            ></coupon-blank>
            <coupon-main
            	v-else
                :coupon-arr="coupon_arr"
            ></coupon-main>
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
    	coupon_arr: function() {
    		return this.$store.getters.coupon_arr;
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
    	'coupon-blank': require("./coupon-blank"),
    	'coupon-main': require("./coupon-main")
    }
}

</script>

<style scoped lang="less"></style>
