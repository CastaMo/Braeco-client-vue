<template>

<div id='coupon-main'>
	<div class='coupon-wrapper'>
		<div class='coupon-container'>
			<ul class='coupon-list'>
				<coupon-item
					v-for="coupon_item in couponorder"
					:coupon-item="coupon_item"
				></coupon-item>
			</ul>
		</div>
	</div>
</div>

</template>

<script>

module.exports = {
	name: 'coupon-main',
	props: {
		couponorder: Array
	},
	data() {
		return {

		};
	},
	computed: {

	},
	components: {
		'coupon-item': require("./coupon-item")
	}
}

</script>

<style lang="less" scoped>

#coupon-main {
	.coupon-wrapper {
		width: 91.47%;
		margin: 0 auto;
		.coupon-container {
			padding: 16px 0 120px;
		}
	}
}

</style>

