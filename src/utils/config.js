let nprogress = require("./nprogress.js");
let fastclick = require("./fastclick.js");
let requireManage = require("./require.js");
let lazyLoad = require("./vue-lazyload.js");


window.requireManage = requireManage;

new fastclick(document.body);

Vue.use(lazyLoad, {
  try: 3 // default 1
});


module.exports = {}