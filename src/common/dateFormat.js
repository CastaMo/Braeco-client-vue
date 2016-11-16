Date.prototype.Format = function(fmt) {
    var k, o, str;
    o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (k in o) {
        if (!(new RegExp("(" + k + ")").test(fmt))) {
            continue;
        }
        if (RegExp.$1.length === 1) {
            str = o[k];
        } else {
            str = ("00" + o[k]).substr(("" + o[k]).length);
        }
        fmt = fmt.replace(RegExp.$1, str);
    }
    return fmt;
};
module.exports = Date.prototype.Format;