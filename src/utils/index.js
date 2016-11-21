var Braeco = {
    utils: {
        food        : require("./food.js"),
        category    : require("./category.js"),
        property    : require("./property.js")
    }
};

window.Braeco = Braeco;

module.exports = {
    Braeco: Braeco,
    locStor: require("./localStorage.js")
};