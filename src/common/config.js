let nprogress = require("./nprogress.js");
let fastclick = require("./fastclick.js");
let requireManage = require("./require.js");
let lazyLoad = require("./vue-lazyload.js");
let dateFormat = require("./dateFormat.js");

window.requireManage = requireManage;
import Vue from "vue"

new fastclick(document.body);

Vue.use(lazyLoad, {
  try: 3 // default 1
});


module.exports = {}
