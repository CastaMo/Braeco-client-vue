var Braeco = {
    utils: {
        food        : require("./food.js"),
        category    : require("./category.js"),
        property    : require("./property.js"),
        order       : require("./order.js"),
        combo       : require("./combo.js")
    }
};

window.Braeco = Braeco;

module.exports = {
    Braeco: Braeco,
    locStor: require("./localStorage.js")
};
