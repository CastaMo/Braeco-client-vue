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
	}
}

module.exports = order;