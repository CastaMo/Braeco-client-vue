<template>
	<div class="trolley-footer-bar">
		<div class='trolley-full-bar'>
			<div class='left-part order-price-field'>
				<span>总价:</span>
				<span class='order-price'>43</span>
			</div>
			<div class='right-part btn-field'>
				<button class='confirm-btn'>选好了</button>
			</div>
			<div class='clear'></div>
		</div>
		<div class='trolley-icon-field'>
			<div class='trolley-icon'>
				<div class='order-number'>77</div>
			</div>
		</div>
	</div>
</template>


<script>

module.exports = {
	name: 'trolley-footer-bar',
	data() {
		return {

		}
	}
}

</script>

<style lang="less" scoped>

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.ellipsisWithLineNum (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

.trolley-footer-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 44px;
}

.trolley-full-bar {
	height: 44px;
	width: 100%;
	background-color: #8B572A;

	.order-price-field {
		margin-left: 77px;
		line-height: 44px;
		color: #fff;
		.ellipsisWithLineNum(1);
		width: 140px;
		.order-price {
			&:before {
				content: '￥';
				font-size: 13px;
			}
		}
	}

	.btn-field {
		.confirm-btn {
			width: 100px;
			height: 44px;
			line-height: 44px;
			color: #fff;
			background-color: #FFC107;
			border: none;
			font-size: 16px;
			&:active {
	            background-color: #FFB300;
	        }
	        &:focus {
	        	outline: none;
	        }
		}
	}

}

.trolley-icon-field {
	position: absolute;
	bottom: 4px;
	left: 16px;
	.trolley-icon {
		width: 48px;
		height: 48px;
		background-size: 48px 48px;
		.background-norm();
		background-image: url(data:image/jpg;base64,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);
		.order-number {
			position: absolute;
			width: 16px;
			height: 16px;
			background-color: #D0021B;
			top: 5px;
			right: 6px;
			color: #fff;
			.rounded-corners(50%);
			line-height: 16px;
			text-align: center;
			font-size: 12px;
		}
	}
}

</style>