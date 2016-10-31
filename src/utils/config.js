let nprogress = require("./nprogress.js");
let fastclick = require("./fastclick.js");
let requireManage = require("./require.js");
window.requireManage = requireManage;

new fastclick(document.body);


module.exports = {}