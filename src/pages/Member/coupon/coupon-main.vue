<template>

<div id='coupon-main'>
	<div class='coupon-wrapper'>
		<div class='coupon-container'>
			<ul class='coupon-list'>
				<coupon-item
					v-for="coupon_item in couponArr"
					:coupon-item="coupon_item"
					:state="type"
					:is-choose="choose_coupon_id == coupon_item.id"
					v-on:item-click="chooseItem"
				></coupon-item>
			</ul>
		</div>
	</div>
	<div class="btn-field" v-show="type === 'use'">
		<button
			class="confirm-btn braeco-btn yellow wider"
			v-on:click="confirmClick"
		>确认使用</button>
	</div>
</div>

</template>

<script>

module.exports = {
	name: 'coupon-main',
	props: {
		couponArr: Array
	},
	data() {
		return {
			choose_coupon_id: null
		};
	},
	created() {

	},
	computed: {
		type: function() {
			return this.$store.state.route.params.type;
		},
		total_final_price: function() {
			return this.$store.getters.total_final_price;
		}
	},
	methods: {
		chooseItem(item) {
			this.choose_coupon_id = item.id;
		},
		confirmClick() {
			console.log(this.choose_coupon_id);
			this.$router.back();
		}
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

.btn-field {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 25px 0;
    background-color: #FFFCF6;
    border-top: solid 1px #C8C7CC;
    text-align: center;
    .confirm-btn {
        width: 200px;
        margin: 0 auto;
        line-height: 48px;
        font-size: 20px;
    }
}

</style>

