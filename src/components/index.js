let comArray = [];
comArray.push(require('./footer-bar.vue'));


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
