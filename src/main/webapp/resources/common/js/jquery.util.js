/**
 * Created by liolay on 15-6-10.
 */
(function ($) {
    $.fn.extend({
        picScale: function (scale, minHeight) {
            this.each(function (index, element) {
                var height = $(element).width() * scale;
                $(element).css("height", (height > minHeight) ? height : minHeight + "px");
            });
            return this;
        }
    });

    // 添加遮罩层
    $.layOn = function (layId, zindex) {
        var $body = $("body").addClass('lay-on');

        var html = "<div class='thick'";
        layId && (html += " id='" + layId + "' ");
        zindex && (html += " style='z-index:" + zindex + "' ");
        html += "/>";
        return $(html).appendTo($body).show();
    };

    // 去除遮罩层
    $.layOff = function (layId) {

        var selector = "div[class='thick']";

        layId && (selector += "[id='" + layId + "']");
        $(selector).remove();

        $("div[class='thick']:visible").length <= 0 && $("body").removeClass('lay-on');
    };

    //加载中,会判断当前 DOM 是否已经存在 loading 遮罩层,如果已存在将直接返回,可传入 force 为 true 强制增加遮罩层
    $.loadOn = function (loadText, loadId, force) {
        var selector = "div[class='loadding']";
        if (!force && $(selector).length > 0) return;

        loadId = loadId || 'loadOn' + new Date().getTime();
        var html = '<div class="loadding" ';
        html += ' id="' + loadId + '" ';
        html += '><div class="load">';
        html += '<div id="circularG">';
        html += '<div id="circularG_1" class="circularG">';
        html += '</div>';
        html += '<div id="circularG_2" class="circularG">';
        html += '</div>';
        html += '<div id="circularG_3" class="circularG">';
        html += '</div>';
        html += '<div id="circularG_4" class="circularG">';
        html += '</div>';
        html += '<div id="circularG_5" class="circularG">';
        html += '</div>';
        html += '<div id="circularG_6" class="circularG">';
        html += '</div>';
        html += '<div id="circularG_7" class="circularG">';
        html += '</div>';
        html += '<div id="circularG_8" class="circularG">';
        html += '</div>';
        html += '</div>';
        html += '<div class="text">';
        html += (loadText || '正在加载');
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $.layOn(loadId);
        return $(html).appendTo($("body")).show();
    };

    $.loadOff = function (loadId) {
        var selector = "div[class='loadding']";
        loadId && (selector += "[id='" + loadId + "']");
        $.layOff(loadId);
        return $(selector).remove();
    };

    //带确定的提示框
    $.tipOn = function (tipId, tipText, after, btnText, callback) {
        tipId = tipId || 'tipOn' + new Date().getTime();
        var html = '<div class="tips tip-with-confirm" ';
        html += ' id="' + tipId + '" ';
        html += '><div class="tip">';
        html += '<div class="text">';
        html += (tipText || '系统提示');
        html += '</div>';
        html += '<div class="confirm">' + (btnText || "确定") + '</div>';
        html += '</div>';
        html += '</div>';

        $.layOn(tipId);
        $(html).appendTo($("body")).show().find(".confirm").on("click", function () {
            var tp = $(this).parents(".tips");
            if (callback) return callback(function () {
                tp.remove();
                $.layOff(tipId);
            });
            tp.remove();
            $.layOff(tipId);
            after && after();
        });
    };

    window._alert = window.alert;
    window.alert = function (tipText) {
        $.tipOn(null, tipText);
    };
    window.alert.noConflict = function () {
        window.alert = window._alert;
        delete window._alert;
    };

    $.tipOff = function (tipId) {
        var selector = "div[class*='tip-with-confirm']";
        tipId && (selector += "[id='" + tipId + "']");
        $.layOff(tipId);
        return $(selector).remove();
    };

    //询问选择
    var defaultConfirmSettings = {
        id: null,
        tipText: "确认信息",
        confirmBtn: "确定",
        cancelBtn: "取消",
        confirm: null,
        cancel: null,
        afterConfirm: null,
        afterCancel: null
    };

    $.confirmOn = function (option) {
        var settings = $.extend({}, defaultConfirmSettings, option || {});
        var confirmId = settings.id || 'confirmOn' + new Date().getTime();
        var html = '<div class="tips tip-with-confirm-cancel" ';
        html += ' id="' + confirmId + '" ';
        html += '><div class="tip">';
        html += '<div class="text">';
        html += (settings.tipText || '系统提示');
        html += '</div>';
        html += '<div class="confirm">' + (settings.cancelBtn || "取消") + '</div>';
        html += '<div class="cancel">' + (settings.confirmBtn || "确定") + '</div>';
        html += '</div>';
        html += '</div>';

        $.layOn(confirmId);
        $(html).appendTo($("body")).show().find(".cancel").on("click", function () {
            var tp = $(this).parents(".tips");
            if (settings.confirm) return settings.confirm(function () {
                tp.remove();
                $.layOff(confirmId);
            });
            tp.remove();
            $.layOff(confirmId);
            settings.afterConfirm && settings.afterConfirm();
        }).end().find(".confirm").on("click", function () {
            var tp = $(this).parents(".tips");
            if (settings.cancel) return settings.cancel(function () {
                tp.remove();
                $.layOff(confirmId);
            });
            tp.remove();
            $.layOff(confirmId);
            settings.afterCancel && settings.afterCancel();
        });
    };

    $.confirmOff = function (confirmId) {
        var selector = "div[class*='tip-with-confirm-cancel']";
        confirmId && (selector += "[id='" + confirmId + "']");
        $.layOff(confirmId);
        return $(selector).remove();
    };

    //成功提示toast
    var commonTipTimeOutId;
    $.toastOn = function (toastId, msg, callback, after, timeoutMill, click) {
        var args;
        if (arguments.length === 1 && toastId !== null && 'object' === typeof toastId && (args = toastId)) {
            toastId = args.toastId;
            msg = args.msg;
            callback = args.callback;
            after = args.after;
            timeoutMill = args.timeoutMill;
            click = args.click;
        }

        commonTipTimeOutId && $.toastOff(toastId);

        var timeout = timeoutMill || 2000;
        toastId = toastId || 'confirmOn' + new Date().getTime();
        var html = '<div class="tips tip-with-toast" ';
        html += ' id="' + toastId + '" ';
        html += '><div class="tip">';
        html += '<div class="success-text">';
        html += (msg || '系统提示');
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $.layOn(toastId);
        var $content = $(html).appendTo($("body")).show(),
            clearToast = function () {
                $content.remove();
                $.layOff(toastId);
            };

        click && $('[id=' + toastId + ']').one('click', function () {
            click(clearToast);
        });

        commonTipTimeOutId = setTimeout(function () {
            if (callback) return callback(clearToast);
            clearToast();
            after && after();
        }, timeout);
    };

    $.toastOff = function (toastId) {
        commonTipTimeOutId && clearTimeout(commonTipTimeOutId);

        var selector = "div[class*='tip-with-toast']";
        toastId && (selector += "[id='" + toastId + "']");
        $.layOff(toastId);
        return $(selector).remove();

    };

    /**
     * 进度条
     * @param processId
     * @param title
     */
    $.progressOn = function (processId, title) {
        processId = processId || 'progressOn' + new Date().getTime();
        var html = '<div class="tips tip-with-progress" ';
        html += ' id="' + processId + '" ';
        html += '><div class="tip">';
        html += '<div class="success-text" style="padding: 20px 13px;">';
        html += (title || '正在导入,请稍候...');
        html += '<div class="progress" style="margin: 15px 0px;height: 10px;">'
        html += '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;background-color: #56AFBD;">'
        html += '<span class="sr-only">0% Complete</span>';
        html += '</div>';
        html += '</div>';
        html += '<span id="progressPer" style="color: #56AFBD">0</span><span style="color: #56AFBD">%</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $.layOn(processId);
        $(html).appendTo($("body")).show();
    };

    $.progressOff = function (processId) {
        var selector = "div[class*='tip-with-progress']";
        processId && (selector += "[id='" + processId + "']");
        $.layOff(processId);
        return $(selector).remove();
    };

    /**
     * 带交互的对话框,为Backbone定制,其他无法使用,考虑到多层对话框交互太差,目前只支持同时弹出1个对话框
     * @param dialogId          指定dialogId
     * @param title             dialog标题
     * @param contentViewPath   视图地址
     * @param options           视图参数
     * @param width             宽
     * @param height            高
     * @param event          close关闭事件
     */
    var _dialog;
    $.dialogOn = function (dialogId, title, contentViewPath, options, width, height, event) {
        dialogId = dialogId || 'dialogOn' + new Date().getTime();
        var html = '<div class="tips tip-with-dialog" ';
        html += ' id="' + dialogId + '" >';
        html += '<div class="dialog-content" style="';
        if (height)
            html += 'height:' + height + ';';
        if (width)
            html += 'width:' + width + '';
        html += '">';
        html += '<div class="dialog-title"><span class="title">' + (title || "") + '</span><span class="operation"><i class="iconfont operation-close">&#xe61b;</i></span></div>'
        html += '<div class="dialog-body">';
        html += '加载中...';
        //html += '<div class="sk-spinner sk-spinner-fading-circle">';
        //html += '<div class="sk-circle1 sk-circle"></div>         ';
        //html += '<div class="sk-circle2 sk-circle"></div>         ';
        //html += '<div class="sk-circle3 sk-circle"></div>         ';
        //html += '<div class="sk-circle4 sk-circle"></div>         ';
        //html += '<div class="sk-circle5 sk-circle"></div>         ';
        //html += '<div class="sk-circle6 sk-circle"></div>         ';
        //html += '<div class="sk-circle7 sk-circle"></div>         ';
        //html += '<div class="sk-circle8 sk-circle"></div>         ';
        //html += '<div class="sk-circle9 sk-circle"></div>         ';
        //html += '<div class="sk-circle10 sk-circle"></div>        ';
        //html += '<div class="sk-circle11 sk-circle"></div>        ';
        //html += '<div class="sk-circle12 sk-circle"></div>        ';
        //html += '</div>                                           ';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $.layOn(dialogId);
        $(html).appendTo($("body")).show().find(".operation-close").on("click", function () {
            if (event) return event();
            _dialog.destroy();
            var tp = $(this).parents(".tips");
            tp.remove();
            $.layOff(dialogId);

        });

        _dialog = Marionette.LayoutView.extend({
            el: '.tip-with-dialog',
            regions: {
                content: '.dialog-body'
            }
        });
        _dialog = new _dialog;

        require([contentViewPath], function (ContentView) {
            _dialog.showChildView("content", new ContentView(options))
        }, function (error) {
            $.tipOn(null, "系统异常,请刷新浏览器后重试");
        });

    };
    $.dialogOff = function (dialogId) {
        _dialog && _dialog.destroy();

        var selector = "div[class*='tip-with-dialog']";
        dialogId && (selector += "[id='" + dialogId + "']");
        $.layOff(dialogId);
        return $(selector).remove();
    };


    /**
     * 弹出框
     */
    var defaultOption = {
        tipText: "列表信息",
        confirmBtn: "确定",
        cancelBtn: "取消",
        destroy: null,
        confirm: null,
        cancel: null,
        close: null,
        afterConfirm: null,
        afterCancel: null,
        afterClose: null
    };

    $.outPanel = function (opt, listHtml) {

        var setting = $.extend({}, defaultOption, opt || {});
        var html = '<div class="tips tipsPanel" ';
        html += 'id="panelOn">';
        html += '<div class="panelText">';
        html += setting.tipText;
        html += '<span class="close"><i class="iconfont">&#xe61b;</i></span></div>';
        html += '<div class="panelContent">';
        if (listHtml.length > 0) {
            html += listHtml;
        } else {
            html += '<div class="noInfo">暂无列表信息</div>';
        }
        html += "</div>";
        if (setting.button) {
            html += '<div class="operationArea">';
            html += '<span class="btn active confirm" >' + setting.confirmBtn + '</span>';
            html += '<span class="btn active cancel">' + setting.cancelBtn + '</span>';
            html += '</div>';
        }
        html += "</div>";
        $.layOn();

        if ($("#panelOn").length > 0) return $("#panelOn").show().css("z-index", "100001");

        $(html).appendTo($("body")).show().find(".confirm").on("click", function () {
            var tp = $(this).parents(".tips");
            setting.confirm && setting.confirm();
            if (setting.destroy) {
                tp.remove();
            } else {
                tp.hide();
            }
            $.layOff();
            setting.afterConfirm && setting.afterConfirm();
        }).end().find(".cancel").on("click", function () {
            var tp = $(this).parents(".tips");
            if (setting.destroy) {
                tp.remove();
            } else {
                tp.hide();
            }
            $.layOff();
            setting.cancel && setting.cancel();
            setting.afterCancel && setting.afterCancel();
        }).end().find(".close").on("click", function () {
            var tp = $(this).parents(".tips");
            if (setting.destroy) {
                tp.remove();
            } else {
                tp.hide();
            }
            $.layOff();
            setting.close && setting.close();
            setting.afterClose && setting.afterClose();
        });
    };

    $.paging = {};
    $.paging.getPages = function (currentPage, totalPage, visiblePage) {
        var pages = [];

        var half = Math.floor(visiblePage / 2);
        var start = currentPage - half + 1 - visiblePage % 2;
        var end = currentPage + half;

        if (start <= 0) {
            start = 1;
            end = visiblePage;
        }
        if (end > totalPage) {
            start = totalPage - visiblePage + 1;
            end = totalPage;
        }

        var itPage = start;
        while (itPage <= end) {
            itPage > 0 && pages.push(itPage);
            itPage++;
        }
        return {"currentPage": currentPage, "numeric": pages};
    };

    var send = function (url, data, beforeSend, complete, success, error, type, contentType) {
        return $.ajax({
            type: type || "POST",
            contentType: contentType || 'application/x-www-form-urlencoded;charset=UTF-8',
            url: url,
            data: data,
            error: error,
            beforeSend: beforeSend,
            complete: complete,
            success: success
        });
    };


    var sendBase = function (url, data, success, error, type, showModal, contentType) {
        try {
            offlineTag && (type = 'get') && ( url = UrlMapping._getRemoteUrl(url));
        } catch (e) {
        }
        var reqId = new Date().getTime();
        var timeoutId;
        return send(url, data, function () {
            showModal && (timeoutId = setTimeout(function () {
                $.loadOn(null, reqId);
            }, 500));
        }, function () {
            showModal && timeoutId && clearTimeout(timeoutId);
        }, function (data) {
            success && success(data);
            showModal && $.loadOff(reqId);
        }, function () {
            error && error();
            !error&&(location.href="shiro/unauthor");
            showModal && $.loadOff(reqId);
        }, type, contentType);
    };

    $._send = function (url, success, error, type) {
        return sendBase(url, null, success, error, type);
    };

    $.send = function (url, data, success, error, type) {
        return sendBase(url, data, success, error, type);
    };

    $.sendj = function (url, data, success, error, type) {
        return sendBase(url, JSON.stringify(data), success, error, type, false, 'application/json;charset=UTF-8');
    };

    $._sendm = function (url, success, error, type) {
        return sendBase(url, null, success, error, type, true);
    };

    $.sendm = function (url, data, success, error, type) {
        return sendBase(url, data, success, error, type, true);
    };

    $.sendmj = function (url, data, success, error, type) {
        return sendBase(url, JSON.stringify(data), success, error, type, true, 'application/json;charset=UTF-8');
    };

    /**
     *
     * @param selector 父级元素选择器
     * @param audioSrc  音频url
     * @param option
     * @returns {*} 例如 $.createAudio("#toAudio", "../audio/beipan.mp3", {preload: false});
     */
    var audioDefaults = {
        preload: true,
        loop: true,
        autoplay: true,
        specical: true
    }

    $.createAudio = function (selector, audioSrc, option) {
        if (!window.HTMLAudioElement)return;
        if (!(selector && audioSrc))return console.error("arguments is undefine!");
        option = $.extend({}, audioDefaults, option || {});
        var html = '<div class="audio-btn ' + (option.preload ? 'on' : 'off') + '"';
        html += '>';

        if (option.specical) {
            html += '<div class="specical_1 specical iconfont"></div>';
            html += '<div class="specical_2 specical iconfont"></div>';
            html += '<div class="specical_3 specical iconfont"></div>';
        }
        html += '<div class="audio-btn-icon-cache-on"></div>';
        html += '<div class="audio-btn-icon-cache-off"></div>';
        html += '<div class="audio-btn-icon"></div>';
        html += '<audio id="show-audio" src=' + audioSrc;
        option.preload && (html += ' preload');
        option.loop && (html += ' loop');
        html += '></audio></div>';

        $(html).appendTo($(selector)).show().on('click', function () {
            $(".audio-btn").toggleClass('on').toggleClass('off');
            $(this).hasClass("on") ? document.getElementById("show-audio").play() : document.getElementById("show-audio").pause();
        })

        return option.autoplay && document.getElementById("show-audio").play();
    }

    /**
     * @param selector 走马灯所在元素选择器
     * @param showText 走马灯的文字
     */
    $._rollText = function (selector, showText) {
        var cInteval,
            showText = showText || "背景音乐",
            rolltext = '<div class="rollText" style="position:absolute;white-space:nowrap;">' + showText + '</div>';
        $(selector + " .rollText").remove();
        $(rolltext).appendTo($(selector));
        var areaLength = $(selector).width(),
            textlengt = $(".rollText").width(),
            left = 0;
        textlengt <= areaLength ? $(".rollText").css({left: 0, right: 0}) :
            cInteval = setInterval(function () {
                areaLength - left <= textlengt ? $(".rollText").css({"left": left -= 0.5}) :
                    $(".rollText").css({"left": left = 0});
            }, 130);
        return cInteval;
    }

    /**
     * 内嵌模块渲染
     *
     */
    $._addNewArea = function (options) {
        var layOutView = options.layOutView,
            newRegion = options.region,
            path = options.path,
            data = options.data;

        require([path], function (ContentView) {
            layOutView.addRegion("newArea", newRegion);
            layOutView.showChildView("newArea", new ContentView(data));
        }, function (error) {
            $.tipOn(null, "系统异常,请刷新浏览器后重试");
        })
    };

    (function () {
        var matched, browser;
        // Use of jQuery.browser is frowned upon.
        // More details: http://api.jquery.com/jQuery.browser
        // jQuery.uaMatch maintained for back-compat
        $.uaMatch = function (ua) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        };

        matched = $.uaMatch(navigator.userAgent);
        browser = {};

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        $.browser = browser;

        $.isModernBrowser = function () {
            return typeof Uint8Array !== 'undefined'
        };

    })();

})(jQuery);