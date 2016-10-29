(function(win) {
    var toastAlertElemListDom,
        createAlertElemDom,
        removeAlertElemDom,
        showAlertElemDom,
        createTimeoutToRemove;

    toastAlertElemListDom = $("ul.toast-elem-list");
    createAlertElemDom = function(content, sucessClass) {
        var dom;
        dom = $("<li class='toast-elem" + sucessClass + "'><p>" + content + "</p></li>");
        return dom;
    };
    removeAlertElemDom = function(dom) {
        return dom.fadeOut(300, function() {
            dom.remove();
        });
    };
    showAlertElemDom = function(dom) {
        return dom.fadeIn(300);
    };
    createTimeoutToRemove = function(dom) {
        return setTimeout(function() {
            removeAlertElemDom(dom);
        }, 2000);
    };
    win.toast = function(content, isSuccess) {
        var dom,
            sucessClass = "";
        if (isSuccess) {
            sucessClass = " success";
        }
        dom = createAlertElemDom(content, sucessClass);
        $("ul.toast-elem-list").append(dom);
        showAlertElemDom(dom);
        return createTimeoutToRemove(dom);
    };
}.call(this, window));

module.exports = {}