/*!
 * Vue-Lazyload.js v0.8.3
 * (c) 2016 Awe <hilongjw@gmail.com>
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.install = factory());
}(this, (function () { 'use strict';

var Promise = require('es6-promise').Promise;
var inBrowser = typeof window !== 'undefined';

if (!Array.prototype.$remove) {
    Array.prototype.$remove = function (item) {
        if (!this.length) return;
        var index = this.indexOf(item);
        if (index > -1) {
            return this.splice(index, 1);
        }
    };
}

var vueLazyload = (function (Vue) {
    var Options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var isVueNext = Vue.version.split('.')[0] === '2';
    var DEFAULT_URL = 'data:image/png;base64,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';

    var Init = {
        preLoad: Options.preLoad || 1.3,
        error: Options.error || DEFAULT_URL,
        loading: Options.loading || DEFAULT_URL,
        attempt: Options.attempt || 3,
        scale: Options.scale || inBrowser ? window.devicePixelRatio : 1,
        hasbind: false
    };

    var Listeners = [];
    var imageCache = [];

    var throttle = function throttle(action, delay) {
        var timeout = null;
        var lastRun = 0;
        return function () {
            if (timeout) {
                return;
            }
            var elapsed = +new Date() - lastRun;
            var context = this;
            var args = arguments;
            var runCallback = function runCallback() {
                lastRun = +new Date();
                timeout = false;
                action.apply(context, args);
            };
            if (elapsed >= delay) {
                runCallback();
            } else {
                timeout = setTimeout(runCallback, delay);
            }
        };
    };

    var _ = {
        on: function on(el, type, func) {
            el.addEventListener(type, func);
        },
        off: function off(el, type, func) {
            el.removeEventListener(type, func);
        }
    };

    var lazyLoadHandler = throttle(function () {
        for (var i = 0, len = Listeners.length; i < len; ++i) {
            checkCanShow(Listeners[i]);
        }
    }, 300);

    var onListen = function onListen(el, start) {
        if (start) {
            _.on(el, 'scroll', lazyLoadHandler);
            _.on(el, 'wheel', lazyLoadHandler);
            _.on(el, 'mousewheel', lazyLoadHandler);
            _.on(el, 'resize', lazyLoadHandler);
            _.on(el, 'animationend', lazyLoadHandler);
            _.on(el, 'transitionend', lazyLoadHandler);
        } else {
            Init.hasbind = false;
            _.off(el, 'scroll', lazyLoadHandler);
            _.off(el, 'wheel', lazyLoadHandler);
            _.off(el, 'mousewheel', lazyLoadHandler);
            _.off(el, 'resize', lazyLoadHandler);
            _.off(el, 'animationend', lazyLoadHandler);
            _.off(el, 'transitionend', lazyLoadHandler);
        }
    };

    var checkCanShow = function checkCanShow(listener) {

        if (imageCache.indexOf(listener.src) > -1) return setElRender(listener.el, listener.bindType, listener.src, 'loaded');
        var rect = listener.el.getBoundingClientRect();
        
        if (rect.top < window.innerHeight * Init.preLoad && rect.bottom > 0 && rect.left < window.innerWidth * Init.preLoad && rect.right > 0) {
            render(listener);
        }
    };

    var setElRender = function setElRender(el, bindType, src, state) {
        if (!bindType) {
            el.setAttribute('src', src);
        } else {
            // el.setAttribute('style', bindType + ': url(' + src + ')');
            // 这里会有style属性冲突，需要做一下赋值调整。
            el.style.backgroundImage = 'url(' + src + ')';
        }
        el.setAttribute('lazy', state);
    };

    var render = function render(item) {
        if (item.attempt >= Init.attempt) return false;

        item.attempt++;

        loadImageAsync(item).then(function (image) {
            setElRender(item.el, item.bindType, item.src, 'loaded');
            imageCache.push(item.src);
            Listeners.$remove(item);
        }).catch(function (error) {
            setElRender(item.el, item.bindType, item.error, 'error');
        });
    };

    var loadImageAsync = function loadImageAsync(item) {
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.src = item.src;

            image.onload = function () {
                resolve({
                    naturalHeight: image.naturalHeight,
                    naturalWidth: image.naturalWidth,
                    src: item.src
                });
            };

            image.onerror = function () {
                reject();
            };
        });
    };

    var componentWillUnmount = function componentWillUnmount(el, binding, vnode, OldVnode) {
        if (!el) return;

        for (var i = 0, len = Listeners.length; i < len; i++) {
            if (Listeners[i] && Listeners[i].el === el) {
                Listeners.splice(i, 1);
            }
        }

        if (Init.hasbind && Listeners.length == 0) {
            onListen(window, false);
        }
    };

    var checkElExist = function checkElExist(el) {
        var hasIt = false;

        Listeners.forEach(function (item) {
            if (item.el === el) hasIt = true;
        });

        if (hasIt) {
            return Vue.nextTick(function () {
                lazyLoadHandler();
            });
        }
        return hasIt;
    };

    var addListener = function addListener(el, binding, vnode) {
        if (el.getAttribute('lazy') === 'loaded') return;
        if (checkElExist(el)) return;

        var parentEl = null;
        var imageSrc = binding.value;
        var imageLoading = Init.loading;
        var imageError = Init.error;

        if (typeof binding.value !== 'string' && binding.value) {
            imageSrc = binding.value.src;
            imageLoading = binding.value.loading || Init.loading;
            imageError = binding.value.error || Init.error;
        }
        if (binding.modifiers) {
            parentEl = window.document.getElementById(Object.keys(binding.modifiers)[0]);
        }

        setElRender(el, binding.arg, imageLoading, 'loading');

        Vue.nextTick(function () {
            Listeners.push({
                bindType: binding.arg,
                attempt: 0,
                parentEl: parentEl,
                el: el,
                error: imageError,
                src: imageSrc
            });
            lazyLoadHandler();
            if (Listeners.length > 0 && !Init.hasbind) {
                Init.hasbind = true;
                onListen(window, true);
            }
            if (parentEl) {
                onListen(parentEl, true);
            }
        });
    };

    if (isVueNext) {
        Vue.directive('lazy', {
            bind: addListener,
            update: addListener,
            inserted: addListener,
            componentUpdated: lazyLoadHandler,
            unbind: componentWillUnmount
        });
    } else {
        Vue.directive('lazy', {
            bind: lazyLoadHandler,
            update: function update(newValue, oldValue) {
                addListener(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue,
                    oldValue: oldValue
                });
            },
            unbind: function unbind() {
                componentWillUnmount(this.el);
            }
        });
    }
});

return vueLazyload;

})));