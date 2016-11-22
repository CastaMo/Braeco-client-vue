<template>
	<div id="Menu-Order">
		<div class='menu-order-wrapper'>
			<div class='menu-order-container'>
				<div class='order menu-order-item-container'>
					<ul>
						<order-item
							v-for="orderItem in orderItems"
							:orderItem="orderItem"
						>
						</order-item>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
module.exports = {
	name: 'menu-order',
	data() {
		return {
			orderItems: [],
			groupsMap: {},
			dishLimit: null
		}
	},
	created() {
		let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groupsMap[group.id] = group;
        });

        this.dishLimit = this.$root.requireData.dish_limit;

        this.orderItems = this.getItemsForOrder();
	},
	components: {
		'order-item': Vue.component('order-item')
	},
	methods: {
		getItemsForOrder() {
			let temp = [];
			let vm = this;
			this.$root.tempData.orderForTrolley.forEach(function(orderItem) {
				orderItem.subItems.forEach(function(subItem) {
					let dish = vm.$root.getDishById(orderItem.id);
					let food = Braeco.utils.food.getFixedDataForFood(dish, vm.groupsMap, vm.dishLimit);
					let foodProperty = Braeco.utils.property.getFixedDataForProperty(dish, vm.groupsMap);
					let order = Braeco.utils.order.getFixedDataForOrder(food, foodProperty.properties, subItem.groups, subItem.num);
					temp.push(order);
					console.log(order);
				});
			});
			return temp;
		}
	}
}


</script>

<style lang="less" scoped>

.menu-order-container {
	padding: 16px 0 80px 0;
}

.menu-order-item-container {
	margin-bottom: 16px;
	background-color: #fff;
	border-top: solid 1px #C8C7CC;
	border-bottom: solid 1px #C8C7CC;
	li.order-item:last-of-type {
		.order-item-wrapper {
			color: #fff;
			color: red;
		}
	}
}

</style>