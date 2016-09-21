var require = {
    baseUrl: 'resources',
    paths: {
        'jquery': "common/js/jquery-1.11.3.min",
        'underscore': 'common/js/underscore',
        'bootstrap': 'common/js/bootstrap.min',
        'bluebootstrap': 'common/js/bootstrap.min',
        'util': 'common/js/jquery.util',
        'metisMenu': 'common/js/metisMenu.min',
        'datatables': 'common/js/jquery.dataTables.min',
        'backbone': 'common/js/backbone',
        'mn': 'common/js/backbone.marionette',
        'backbone.wreqr': 'common/js/backbone.wreqr',
        'backbone.babysitter': 'common/js/backbone.babysitter',
        'easyui':'common/js/jquery.easyui.min',
        'kindeditor':'common/kindeditor/kindeditor',
        'zh_CN':'common/kindeditor/lang/zh_CN'
    },
    shim: {
        bootstrap: {
            deps: [
                'jquery',
                'css!common/css/bootstrap.min.css'
            ]
        },
        underscore: {
            deps: [
                'jquery'
            ]
        },
        bluebootstrap: {
            deps: [
                'jquery',
                'css!common/css/min.bootstrap.css'
            ]
        },
        util: {
            deps: [
                'jquery',
                'css!common/css/jquery.util.css'
            ]
        },
        metisMenu: {
            deps: [
                'jquery',
                'css!common/css/metisMenu.min.css'
            ]
        },
        datatables: {
            deps: [
                'jquery',
                'css!common/css/jquery.dataTables.css'
            ]
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ]
        },
        mn: {
            deps: [
                'jquery',
                'underscore',
                'backbone'
            ]
        },
        easyui:{
            deps:[
                'jquery',
                'css!common/css/easyui.css',
                'css!common/css/icon.css'
            ]
        },
        zh_CN:{
            deps:[
                'jquery',
                'kindeditor',
                'css!common/kindeditor/themes/default/default.css'
            ]
        }
    },
    map: {
        '*': {
            'css': 'common/js/css',
            'text': 'common/js/text'
        }
    }
};


/**
 *删除数组指定下标或指定对象
 */
Array.prototype.remove = function (obj) {
    for (var i = 0; i < this.length; i++) {
        var temp = this[i];
        if (!isNaN(obj)) {
            temp = i;
        }
        if (temp == obj) {
            for (var j = i; j < this.length; j++) {
                this[j] = this[j + 1];
            }
            this.length = this.length - 1;
        }
    }
};
var hi = {template: {}};
hi.getQueryString=function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  decodeURIComponent(r[2]);
    return null;
}
hi.validate=function initValidate($){
    $('.not-null').on('blur', function () {
        var $this = $(this);
        var val = $this.val();
        if (val == null || val == '') {
            var  warningAlert=$('<div>').addClass('alert alert-warning').text('不得为空');
            $this.parent().append(warningAlert);
            setTimeout(function(){
                warningAlert.remove();
            },1000);
        }
    });
}

hi.initMenu=function($){
    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent().parent().addClass('in');
    if (element.is('li')) {
        element.addClass('active');
    }
}
function initHi($, Backbone, Marionette, _) {
    if (hi.app == null) {
        hi.app = new Marionette.Application();
    }
    if (hi.app.scrollToTop == null) {
        hi.app.scrollToTop = function () {
            $('html, body').animate({scrollTop: 0}, 0)
        }
    }

    if (hi.app.cache == null) {
        hi.app.cache = {
            store: {},//当前模板
            set: function (data) {
                var viewPath = this._getViewPath();

                var cachedModel = hi.app.cache.store[viewPath] || (hi.app.cache.store[viewPath] = {});
                cachedModel.data = data;
                cachedModel.scrollTop = $(window).scrollTop();
                cachedModel.lastAccessTime = new Date().getTime();
            },
            get: function (key, defaultValue) {
                var cachedModel = hi.app.cache._getStore();
                if (!cachedModel || !cachedModel.data || (key && !cachedModel.data[key]))  return defaultValue || null;

                return key ? cachedModel.data[key] : cachedModel.data;
            },
            updateData: function (viewPath, idField, newData) {
                var cachedModel = hi.app.cache.store[this._getViewPath(viewPath)];
                if (!cachedModel) return;

                var cachedData = cachedModel.data;
                if (!cachedData || !cachedData.data) return;

                var cachedDataData = cachedData.data;
                for (var i = 0; i < cachedDataData.length; i++) {
                    if (cachedDataData[i][idField] == newData[idField]) {
                        cachedDataData[i] = newData;
                        break;
                    }
                }
            },
            clear: function (viewPath) {
                this.store[this._getViewPath(viewPath)] = null;
            },
            clearAll: function () {
                this.store = {};
            },
            scroll: function () {
                var cachedModel = hi.app.cache._getStore();
                if (!cachedModel) return hi.app.scrollToTop();

                $('html, body').animate({scrollTop: cachedModel.scrollTop}, 0);
            },
            _getStore: function () {
                return this.store[this._getViewPath()];
            },
            _getViewPath: function (viewPath) {
                return viewPath ? viewPath.replace(/\//g, '') : hi.app.router.currentView;
            }
        }
    }
    if (hi.app.events == null) {
        hi.app.events = {
            /***********************滚动分页*********************************/
            paging: new Backbone.Model({
                defaults: {
                    scroll: false
                }
            })
        }
    }
    $(window).scroll(function (e) {
        var winTop = $(window).scrollTop(),
            docHeight = $(document).height(),
            winHeight = $(window).height();
        if ((winTop / (docHeight - winHeight)) >= 0.95) {
            hi.app.events.paging.set("scroll", !hi.app.events.paging.get("scroll"));
        }
    });

    if (hi.app.s == null) {
        hi.app.s = function (template) {
            var templateTagIndexIdMapping_tag = {};
            var templateTagIndexIdMapping_content = {};
            var templateTagPattern = new RegExp("(<template(.|\\s)*?id\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>)", "ig");
            var templateTagArr;
            while ((templateTagArr = templateTagPattern.exec(template)) != null) {
                templateTagIndexIdMapping_tag[templateTagArr.index] = RegExp.$3;
                templateTagIndexIdMapping_content[templateTagArr.index] = templateTagArr.index + RegExp.$1.length;
            }
            if (_.keys(templateTagIndexIdMapping_tag).length <= 0) return;
            var templateTagEndPattern = new RegExp("(<\/template>)", "ig");
            var templateTagEndArr;
            if ((templateTagEndArr = templateTagEndPattern.exec(template)) != null) {
                var _templateTagStartIndexTag = _.keys(templateTagIndexIdMapping_tag);
                var _templateTagStartIndexContent = _.keys(templateTagIndexIdMapping_content);
                for (var currIndex = 0; currIndex < _templateTagStartIndexTag.length; currIndex++) {
                    if (parseInt(_templateTagStartIndexTag[currIndex]) < templateTagEndArr.index) {
                        if (!_templateTagStartIndexTag[currIndex + 1] || parseInt(_templateTagStartIndexTag[currIndex + 1]) > templateTagEndArr.index) {
                            hi.template[templateTagIndexIdMapping_tag[_templateTagStartIndexTag[currIndex]]] = template.substring(templateTagIndexIdMapping_content[_templateTagStartIndexContent[currIndex]], templateTagEndArr.index);
                            hi.app.s(template.replace(template.substring(_templateTagStartIndexTag[currIndex], templateTagEndArr.index + RegExp.$1.length), ''));
                            break;
                        }
                    }
                }
            }
        }
    }
    _.extend(Marionette.TemplateCache.prototype, {

        loadTemplate: function (templateId, options) {
            var template = Backbone.$(templateId).html();
            (!template || template.length === 0) && hi.template[templateId] && (template = hi.template[templateId]);
            if (template && template.length > 0)   return template;

            throw new Marionette.Error({
                name: 'NoTemplateError',
                message: 'Could not find template: "' + templateId + '"'
            });

        }
    });
}
;