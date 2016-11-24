const locStor = (function(win) {
    let store = win.localStorage;
    let doc = document.documentElement;

    if (!store) {
        doc.type.behavior = 'url(#default#userData)';
    }

    return {
        set: function(key, val, context) {
            if (store) {
                return store.setItem(key, val, context);
            } else {
                doc.setAttribute(key, value);
                return doc.save(context || 'default');
            }
        },
        get: function(key, context) {
            if (store) {
                return store.getItem(key, context);
            } else {
                doc.load(context || 'default');
                return doc.getAttribute(key) || '';
            }
        },
        rm: function(key, context) {
            if (store) {
                return store.removeItem(key, context);
            } else {
                context = context || 'default';
                doc.load(context);
                doc.removeAttribute(key);
                return doc.save(context);
            }
        },
        clear: function() {
            if (store) {
                return store.clear();
            } else {
                return doc.expires = -1;
            }
        }
    }

})(window);

module.exports = locStor;
