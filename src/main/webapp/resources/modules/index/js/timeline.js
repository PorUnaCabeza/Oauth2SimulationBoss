/**
 * Created by zhangxs on 2016/5/9.
 */
require(['jquery',
        'backbone',
        'mn',
        'underscore',
        'text!modules/index/tpl/timeLine.html',
        'bootstrap',
        'util',
        'css!modules/admin/css/font-awesome.min.css',
        'css!modules/admin/css/sb-admin-2.css',
        'css!modules/admin/css/timeline.css'],
    function ($, Backbone, Marionette, _, tpl) {
        initHi($, Backbone, Marionette, _);
        hi.app.s(tpl);
        var wayBillId = hi.getQueryString("wayBillId");
        var Dispatch = Backbone.Model.extend({
            defaults: {
                id: "",
                originPlace: "",
                destination: "",
                driverId: "",
                vehicleId: "",
                createTime: "",
                arriveTime: "",
                state: ""
            }
        });

        var DispatchView = Marionette.ItemView.extend({
            template: "dispatch-item"
        });

        var DispatchList = Backbone.Collection.extend({
            model: Dispatch,
            initialize: function () {
                var $this = this;
                $._send('admin/ajax/getJourneyRecordByWayBillId/' + wayBillId, function (data) {
                    var dispatchData= _.sortBy(data,function(dispatch){
                        return new Date(dispatch.createTime);
                    });
                    _.each(dispatchData,function(dispatch,index){
                        dispatch.index=index;
                    });
                    console.log(dispatchData);
                    $this.add(dispatchData);
                });
            }
        });
        var DispatchListView=Marionette.CollectionView.extend({
            childView: DispatchView,
            initialize: function () {

            }
        });


        var TimeLineLayout = Marionette.LayoutView.extend({
            el: "#time-panel",
            template: 'timeline-list-layout',
            regions: {
                dispatchList: "#dispatch-list"
            },
            initialize: function () {

            },
            onShow: function () {
                this.dispatchList=new DispatchList();
                this.showChildView('dispatchList',new DispatchListView({collection: this.dispatchList}));
            }
        });
        new TimeLineLayout().render().onShow();

    }
);