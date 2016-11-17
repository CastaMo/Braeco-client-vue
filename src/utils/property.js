var property = {
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
    }
};

module.exports = property;