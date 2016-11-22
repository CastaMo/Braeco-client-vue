const property = {
    getFixedDataForProperty(dish, groupsMap) {
        let temp = {};
        temp.id = dish.id;
        temp.name = dish.name;
        temp.default_price = dish.default_price;
        temp.dc_type = dish.dc_type;
        temp.dc = dish.dc;
        temp.properties = [];
        dish.groups.forEach(function(groupId) {
            temp.properties.push(groupsMap[groupId]);
        });
        return temp;
    },
    getDiffPriceByChoose(chooseArray, properties) {
        let diff = 0;
        chooseArray.forEach(function(choose, index) {
            diff += properties[index].content[choose].price;
        });
        return diff;
    },
    getInfoByChoose(chooseArray, properties) {
        let info = "";
        chooseArray.forEach(function(choose, index) {
            info += properties[index].content[choose].name;
        });
        return info;
    }
};

module.exports = property;