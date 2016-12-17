<template>
	<div id='Member-Recharge'>
		<div class='member-recharge-wrapper'>
			<div class='member-recharge-container'>
				<div id='recharge'>
					<div class='title-field'>
						<div class='title-wrapper'>
							<div class='title-container'>
								<p>选择充值金额</p>
							</div>
						</div>
					</div>
					<ul class='recharge-list' v-if="charge_ladder && charge_ladder.length > 0">
						<li
							class='recharge-item'
							v-for="recharge in charge_ladder"
						>
							<div class='recharge-item-wrapper margin-left-wrapper'>
								<div class='recharge-item-container'>
									<div class='left-part item-info-field'>
										<div class='normal'>
											<p class='pay-money'>{{recharge.pay}}</p>
										</div>
									</div>
									<div class='right-part choose-icon-field'>
										<div class='choose-icon'></div>
									</div>
									<div class='clear'></div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>


<script>

module.exports = {
	name: 'member-recharge',
	data() {
		return {

		};
	},
	computed: {
		charge_ladder: function() {
			return this.$store.getters.charge_ladder;
		}
	}
}

</script>

<style scoped lang="less">

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

#Member-Recharge {
	.member-recharge-wrapper {
		.member-recharge-container {
			padding: 16px 0 80px 0;
		}
	}
}

#recharge {
	border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
	.title-field {
		line-height: 39px;
		color: #030303;
		font-weight: bold;
		border-bottom: solid 1px #C8C7CC;
		.title-wrapper {
			margin: 0 16px;
		}
		&:last-child {
			border-bottom: none;
		}
	}
	ul.recharge-list {
		li.recharge-item {

			.recharge-item-container {
				padding-right: 16px;
			}

			.item-info-field {
				.normal {
					line-height: 58px;
				}
				.pay-money {
					&:before {
						content: '￥';
						font-size: 12px;
					}
				}
			}
			.choose-icon-field {
				margin-top: 17px;
				.choose-icon {
					width: 24px;
					height: 24px;
					.background-norm();
					background-size: 24px 24px;
					background-image: url("../../assets/pay-choose-icon-unchecked.png");
				}
			}

			&:last-of-type {
				.margin-left-wrapper {
					border-bottom: none;
				}
			}
		}
	}
}

</style>