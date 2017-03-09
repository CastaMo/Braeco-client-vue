<template>

	<div id='coupon-blank'>
		<div class='coupon-blank-wrapper'>
			<div class="coupon-lack-container">
				<div class="icon-field">
					<div class="coupon-icon"></div>
				</div>
				<div class="word-field">
					<p>您现在还没有卡券，请先点餐 ~</p>
				</div>
				<div class="btn-field">
					<button
						class="confirm-btn braeco-btn yellow wider"
						v-on:click="btnClickEvent"
					>去点餐</button>
				</div>
			</div>
		</div>
	</div>

</template>


<script>

module.exports = {
	name: 'coupon-blank',
	methods: {
		btnClickEvent() {
			this.$emit("btn-click");
		}
	}

}

</script>


<style lang="less" scoped>

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

#coupon-blank {
	text-align: center;
	.coupon-blank-wrapper {
		padding: 88px 0;
		.icon-field {
			width: 180px;
			margin: 0 auto;
			.coupon-icon {
				.background-norm();
				width: 180px;
				height: 180px;
				background-size: 180px 180px;
				background-image: url("../../../assets/coupon-about/coupon-big-icon.png");
			}
		}
		.word-field {
			margin: 27px 0;
            font-size: 16px;
            line-height: 22px;
		}
		.btn-field {
			.confirm-btn {
				line-height: 48px;
				font-size: 20px;
				width: 200px;
			}
		}
	}
}

</style>
