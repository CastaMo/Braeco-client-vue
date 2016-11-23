const order = {
	getFixedDataForOrder(food, properties, groups, num) {
		let temp = {};
		temp.id = food.id;
		temp.name = food.name;
		temp.dcStr = food.dcStr;
		temp.tag = food.tag;
		temp.price = food.default_price;
		temp.type = food.type;
		temp.groups = groups;
		if (temp.type === 'normal' && properties.length > 0) {
			temp.price += Braeco.utils.property.getDiffPriceByChoose(groups, properties);
			temp.chooseInfo = Braeco.utils.property.getInfoArrayByChoose(groups, properties).join("、");
		}
		temp.num = num;
		return temp;
	},
    tryGetOrderItemByFoodId(orderForTrolley, foodId, isExtend) {
        let temp = null;
        orderForTrolley.forEach(function(orderItem) {
            if (Number(foodId) === Number(orderItem.id)) {
                temp = orderItem;
                return false;
            }
        });

        // 若找不到则新建一个
        if (!temp && isExtend) {
            orderForTrolley.push(temp = {
                id: foodId,
                subItems: []
            });
        }
        return temp;
    },
    tryGetSubItemByGroups(subItems, groups, isExtend) {
        let temp = null;
        subItems.forEach(function(subItem) {
            // 若为普通单品或者groups项相同，则匹配成功
            if (
                !groups
            ||  JSON.stringify(subItem.groups) === JSON.stringify(groups)
            ) {
                temp = subItem;
                return null;
            }
        });
        // 若找不到则新建一个
        if (!temp && isExtend) {
            subItems.push(temp = {
                num: 0,
                groups: groups
            });
        }
        return temp;
    }
}

module.exports = order;
