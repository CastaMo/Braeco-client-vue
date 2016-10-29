<template>
	<div class='footer-bar'>
		<ul class='bottom-field'>
			<li
				class="bottom-item"
				id="bottom-item-Menu"
				v-on:click="liClickEvent('menu')"
				v-bind:class="{'choose': isMenu}"
			></li>
			<li
				class="bottom-item"
				id="bottom-item-Order"
				v-on:click="liClickEvent('order')"
				v-bind:class="{'choose': isOrder}"
			></li>
			<li
				class="bottom-item"
				id="bottom-item-Member"
				v-on:click="liClickEvent('member')"
				v-bind:class="{'choose': isMember}"
			></li>
		</ul>
	</div>
</template>

<style lang="less" scoped>
.background-linear-gradient(@from: rgba(0, 0, 0, 0), @to: rgba(0, 0, 0, 1)) {
    background: -webkit-linear-gradient(@from, @to);
    background: -o-linear-gradient(@from, @to);
    background: -moz-linear-gradient(@from, @to);
    background: linear-gradient(@from, @to);
}

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.footer-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 1;
	width: 100%;
	ul.bottom-field {
		height: 55px;
		width: 100%;
		.background-linear-gradient(rgba(38, 38, 38, 0.9), rgba(0, 0, 0, 0.9));
		> *:not(.clear) {
			float: left;
		}
		li {
			width: 33.3%;
			height: 100%;
			.background-norm();
			&#bottom-item-Menu {
				background-size: 25px 44px;
				background-image: url("../assets/menu-unchecked.png");
				&.choose {
					background-image: url("../assets/menu-checked.png");
				}
			}
			&#bottom-item-Order {
				background-size: 29px 45px;
				background-image: url("../assets/order-unchecked.png");
				&.choose {
					background-image: url("../assets/order-checked.png");
				}
			}
			&#bottom-item-Member {
				background-size: 22px 45px;
				background-image: url("../assets/member-unchecked.png");
				&.choose {
					background-image: url("../assets/member-checked.png");
				}
			}
		}
	}
}
</style>

<script>

module.exports = {
	name: 'footer-bar',
	data() {
		return {
			liData: [
				"Menu",
				"Order",
				"Member"
			],
		}
	},
	props: ['choose'],
	computed: {
		isMenu() {
			return this.choose === 'Menu';
		},
		isOrder() {
			return this.choose === 'Order';
		},
		isMember() {
			return this.choose === 'Member';
		}
	},
	methods: {
		liClickEvent(item) {
			this.$root.$router.push(`/home/${item}`);
		}
	}
}

</script>