const food = {
	getChooseAllFirstPrice(food, groupsMap) {
        let price = food.default_price;
        if (food.type === "normal") {
            if (food.groups && food.groups.length > 0) {
                food.groups.forEach(function(groupId) {
                    let content = groupsMap[groupId].content[0];
                    price += content.price;
                });
            }
        }
        return price;
    },
    getPriceByDcTypeAndDc(price, dc_type, dc) {
        if (dc_type === "sale") {
            return price - dc;
        }
        if (dc_type === "discount") {
            return price * dc / 100;
        }
        if (dc_type === "static_combo") {
            return price;
        }
        if (dc_type === "discount_combo") {
            return price * dc / 10000;
        }
        if (dc_type === "combo_static") {
            return price;
        }
        return price;
    },

    getDcForFood(food, dishLimit) {
        if (!food.dc_type || food.dc_type === "none") {
            return "";
        }

        let numToChinese = ["零","一","二","三","四","五","六","七","八","九","十"]
        if (food.dc_type === "discount") {
            let num = food.dc
            if (food.dc % 10 === 0) {
                num = numToChinese[Math.round(food.dc) / 10];
            } else {
                num = food.dc / 10;
            }
            return `${num}折`;
        }

        if (food.dc_type === "sale") return `减${food.dc}元`;
        if (food.dc_type === "half") return `第二份半价`;
        if (food.dc_type === "limit") {
            let dc = dishLimit[food.id];
            return `剩${dc}件`;
        }
        if (food.dc_type === "static_combo") {
            return `底价${food.default_price}元`;
        }
        if (food.dc_type === "combo_static") {
            return "只计属性价差";
        }
        if (food.dc_type === "discount_combo") {
            let num = food.dc;
            if (food.dc % 1000 === 0) {
                num = numToChinese[Math.round(food.dc) / 1000];
            } else {
                num = food.dc / 1000;
            }
            return `套餐内${num}折`;
        }
    },
    getFixedDataForFood(dish, groupsMap, dishLimit) {
    	let temp = {};

    	let largeWidth = document.body.clientWidth;
    	let largeHeight = Math.floor(largeWidth * 200 / 375);

        temp.able = dish.able;
        temp.dc = dish.dc;
        temp.dc_type = dish.dc_type;
        temp.dcStr = this.getDcForFood(dish, dishLimit);
        temp.default_price = dish.default_price;
        temp.groups = dish.groups;
        temp.id = dish.id;
        temp.name = dish.name;
        temp.name2 = dish.name2;

        temp.largeWidth = largeWidth;
        temp.largeHeight = largeHeight;

        temp.smallWidth = 100;
        temp.smallHeight = 100;

        if (dish.pic) {
            temp.smallPic = `${dish.pic}?imageView2/1/w/${temp.smallWidth * 2}/h/${temp.smallWidth * 2}`;
            temp.largePic = `${dish.pic}?imageView2/1/w/${temp.largeWidth * 2}/h/${temp.largeHeight * 2}`;
        }
        temp.chooseAllFirstPrice = this.getChooseAllFirstPrice(dish, groupsMap);
        temp.currentPrice = this.getPriceByDcTypeAndDc(temp.chooseAllFirstPrice, dish.dc_type, dish.dc);
        temp.tag = dish.tag;
        temp.type = dish.type;
        temp.detail = dish.detail;
        return temp;
    }
};


module.exports = food;
