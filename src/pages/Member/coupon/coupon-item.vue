<template>

	<li
		class='coupon'
		:class="[state, {
			'choose': isChoose,
			'disabled': couponItem.$disabled
		}]"
		v-on:click="itemClickEvent"
	>
		<div class='basic-info'>
			<div class='left-part overview-part'>
				<div class='reduce-cost-field'>
					<p class='reduce-cost font-number-word'>{{couponItem.cost_reduce}}</p>
				</div>
				<div class='cost-field'>
					<p class='cost'>
						<span>满 </span>
						<span class='price font-number-word'>{{couponItem.cost}}</span>
						<span> 可用</span>
					</p>
				</div>
			</div>
			<div class='left-part detail-part'>
				<div class='name-field'>
					<p class='name'>微信代金券</p>
				</div>
				<div class='apply-field'>
					<p class='apply'>仅限在本餐厅中使用</p>
				</div>
				<div class='composition-field'>
					<p class='composition'>
						<span>最多可叠加使用 </span>
						<span class='font-number-word'>{{couponItem.max_use}}</span>
							<span> 张</span>
					</p>
				</div>
				<div class='date-field'>
					<p class='date'>
						<span>有效期至 </span>
						<span class='font-number-word'>{{new Date(Number(couponItem.end_time) * 1000).Format("yyyy.MM.dd")}}</span>
					</p>
				</div>
			</div>
			<div class='clear'></div>
		</div>
	</li>

</template>

<script>

module.exports = {
	name: 'coupon-item',
	props: {
		couponItem: Object,
		state: String,
		isChoose: Boolean
	},
	methods: {
		itemClickEvent() {
			if (this.couponItem.$disabled) {
				return;
			}
			this.$emit("item-click", this.couponItem);
		}
	}
};

</script>

<style lang="less" scoped>

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.coupon {
	&.disabled {
		color: #C8C7CC;
		.basic-info .overview-part {
			.reduce-cost-field {
				color: #C8C7CC;
			}
			.cost-field span.price {
				color: #C8C7CC;
			}
		}
	}
	&.view {
		background-image: url("../../../assets/coupon-about/coupon-display.png");
	}
	&.use {
		background-image: url("../../../assets/coupon-about/coupon-use-unchoose.png");
		&.choose {
			background-image: url("../../../assets/coupon-about/coupon-use-choose.png");
		}
	}
	position: relative;
	.background-norm();
	width: 100%;
	height: 135px;
	background-size: 100% 135px;
	margin-bottom: 5px;
	.basic-info {
		height: 120px;
		.overview-part {
			width: 33.8%;
			height: 100%;
			margin-left: 5px;
			text-align: center;
			.reduce-cost-field {
				line-height: 28px;
				font-size: 20px;
				color: #910012;
				margin-top: 37px;
				p:before {
					content: "￥";
					font-size: 14px;
				}
			}
			.cost-field {
				line-height: 18px;
				font-size: 12px;
				span.price {
					color: #910012;
					&:before {
						content: "￥";
					}
				}
			}
		}
		.detail-part {
			width: 53.6%;
			height: 100%;
			margin-left: 15px;
			font-size: 12px;
			line-height: 18px;
			font-weight: 300;
			.name-field {
				margin-top: 18.5px;
				line-height: 25px;
				font-weight: 700;
				font-size: 18px;
			}
			.apply-field {
				margin-top: 4px;
			}
		}
	}
}


</style>
