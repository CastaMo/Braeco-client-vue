let comArray = [];
comArray.push(require('./footer-bar.vue'));
comArray.push(require('./rotate-display.vue'));
comArray.push(require('./trolley-footer-bar.vue'));
comArray.push(require('./tips.vue'));
comArray.push(require('./food-item.vue'));
comArray.push(require('./order-item.vue'));


const build = function(Vue) {
    comArray.forEach(function(item) {
        Vue.component(item.name, item);
    });
};

if (typeof window !== 'undefined' && window.Vue) {
    build(window.Vue);
};

module.exports = {
    build
};
