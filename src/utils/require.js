;
var util = function(doc, undefined) {
    'use strict';
    var ajax,
        deepCopy,
        getJSON,
        is;

    function callback(xhr, options) {
        if (xhr.readyState === 4) {
            var result = xhr.responseText,
                status = xhr.status;
            if (typeof options.always === "function") {
                options.always(result);
            }
            if (status === 200) {
                if (typeof options.success === "function") {
                    options.success(result);
                }
            } else if (status === 400) {
                if (typeof options.badRequest === "function") {
                    options.badRequest(xhr)
                } else {
                    alert("请求非法");
                }
            } else if (status === 401) {
                if (typeof options.unauthorized === "function") {
                    options.unauthorized(xhr);
                } else {
                    alert("权限不足");
                }
            } else if (status === 403) {
                if (typeof options.forbidden === "function") {
                    options.forbidden(xhr);
                } else {
                    alert("禁止访问");
                }
            } else if (status === 404) {
                if (typeof options.notFound === "function") {
                    options.notFound(xhr);
                } else {
                    alert("请求资源不存在");
                }
            } else if (status === 405) {
                if (typeof options.methodNotAllowed === "function") {
                    options.methodNotAllowed(xhr);
                } else {
                    alert("请求非法");
                }
            } else if (status === 500) {
                if (typeof options.internalServerError === "function") {
                    options.internalServerError(xhr);
                } else {
                    alert("服务器内部错误");
                }
            } else if (status === 503) {
                if (typeof options.serviceUnavailable === "function") {
                    options.serviceUnavailable(xhr);
                } else {
                    alert("操作过于频繁, 请稍后重试");
                }
            }
        }
    }

    ajax = function(options) {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else { //for IE6
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = function() {
            callback(xhr, {
                success: options.success,
                always: options.always,
                unavailabled: options.unavailabled
            });
        }
        xhr.open(options.type, options.url, options.async);
        if (options.type.toUpperCase() === "POST") {
            xhr.setRequestHeader("Content-type", "application/json");
        }
        if (typeof options.header === "object") {
            var header = options.header;
            for (var key in header) {
                if (header.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, header[key]);
                }
            }
        }
        if (typeof options.data !== "undefined") {
            xhr.send(options.data);
        } else {
            xhr.send();
        }
        return xhr;
    }

    is = function(obj, type) {
        var toString = Object.prototype.toString;
        return (type === 'Null' && obj == null) ||
            (type == "Undefined" && Object === undefined) ||
            toString.call(obj).slice(8, -1) === type;
    }

    deepCopy = function(oldObj, newObj) {
        for (var key in oldObj) {
            var copy = oldObj[key];
            if (oldObj === copy) continue; //如window.window === window，会陷入死循环，需要处理一下
            if (is(copy, "Object")) {
                newObj[key] = deepCopy(copy, newObj[key] || {});
            } else if (is(copy, "Array")) {
                newObj[key] = []
                newObj[key] = deepCopy(copy, newObj[key] || []);
            } else {
                newObj[key] = copy;
            }
        }
        return newObj;
    }

    getJSON = function(json) {
        if (typeof json === "string" && json) {
            json = JSON.parse(json)
        }
        return json
    }

    return {
        getJSON: getJSON,
        ajax: ajax,
        deepCopy: deepCopy
    };
}(document);




var requireManage;
requireManage = (function() {
    var ref$, getJSON, ajax, deepCopy, _requires, _defaultConfig, _getNormalAjaxObject, _allRequireName, _allRequireURL, _correctURL, _setHeader, _getRequireDataStr, _requireFailCallback, _normalHandle, _requireHandle, Require, _initAllRequire;
    ref$ = [util.getJSON, util.ajax, util.deepCopy], getJSON = ref$[0], ajax = ref$[1], deepCopy = ref$[2];
    _requires = {};
    _defaultConfig = {
        async: true,
        type: "POST"
    };
    _getNormalAjaxObject = function(config) {
        return {
            url: config.url,
            type: config.type,
            async: config.async
        };
    };
    _allRequireName = [
        'getTableDinner',
        'getTableLimit',
        'getTableMember'
    ];
    _allRequireURL = {
        'getTableDinner': '/api/Table/Dinner',
        'getTableLimit': '/api/Table/Limit',
        'getTableMember': '/api/Table/Member'
    };
    _setHeader = {};

    _requireFailCallback = {

    };

    var normRequireData = function(data) {
        return data.JSON + "";
    }
    _getRequireDataStr = {

    };

    _correctURL = {

    };

    _normalHandle = function(name, result_, success) {
        var result, message, code;
        result = getJSON(result_);
        message = result.message;
        // code = Number(result.code);
        // if (code === 200) {
        //     if (result.enmsg === "ok") {
        //         return typeof success == 'function' ? success(result) : void 8;
        //     } else {
        //         return alert(result.cnmsg);
        //     }
        // } else if (code === 302) {
        //     if (result.cnmsg) {
        //         alert(cnmsg + " 正在跳转中...", true);
        //         setTimeout(function() {
        //             location.href = result.data.url;
        //         }, 2000);
        //     } else {
        //         location.href = result.data.url;
        //     }
        // } else {
        //     alert(result.cnmsg);
        // }_normalHandle = function(name, result_, success){
        if (message === "success") {
            return typeof success == 'function' ? success(result) : void 8;
        } else if (message) {
            return typeof _requireFailCallback[message] == 'function' ? _requireFailCallback[message]() : void 8;
        } else {
            return alert("系统错误");
        }
    };
    _requireHandle = function(name, config) {
        return function(options) {
            var ajaxObject;
            ajaxObject = _getNormalAjaxObject(config);
            ajaxObject.type = options.method || ajaxObject.type;
            ajaxObject.data = typeof _getRequireDataStr[name] == 'function' ? _getRequireDataStr[name](options.data) : void 8;
            if (typeof _correctURL[name] == 'function') {
                _correctURL[name](ajaxObject, options.data);
            }
            if (typeof _setHeader[name] == 'function') {
                _setHeader[name](ajaxObject, options.data);
            }
            ajaxObject.success = function(result_) {
                return _normalHandle(name, result_, options.success);
            };
            ajaxObject.always = options.always;
            return ajax(ajaxObject);
        };
    };
    Require = (function() {
        Require.displayName = 'Require';
        var prototype = Require.prototype,
            constructor = Require;

        function Require(options) {
            deepCopy(options, this);
            this.init();
            _requires[this.name] = this;
        }
        prototype.init = function() {
            return this.initRequire();
        };
        prototype.initRequire = function() {
            var config;
            config = {};
            deepCopy(_defaultConfig, config);
            config.url = this.url;
            return this.require = _requireHandle(this.name, config);
        };
        return Require;
    }());
    _initAllRequire = function() {
        var i$, ref$, len$, i, name, require, results$ = [];
        for (i$ = 0, len$ = (ref$ = _allRequireName).length; i$ < len$; ++i$) {
            i = i$;
            name = ref$[i$];
            results$.push(require = new Require({
                name: name,
                url: _allRequireURL[name]
            }));
        }
        return results$;
    };
    return {
        get: function(name) {
            return _requires[name];
        },
        initial: function() {
            return _initAllRequire();
        }
    };
}.call(this));
requireManage.initial();
module.exports = requireManage;