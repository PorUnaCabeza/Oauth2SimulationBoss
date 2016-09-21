/**
 * Created by admin on 2016/2/21.
 */
require(['jquery',
        'bootstrap',
        'util',
        'metisMenu',
        'css!modules/admin/css/font-awesome.min.css',
        'css!modules/admin/css/sb-admin-2.css'],
    function ($) {
        $('#side-menu').metisMenu();
        hi.initMenu($);
        $('#commitWayBill').click(function () {
            var itemName = $('#itemName').val(),
                originPlace = $('#originPlace').val(),
                destination = $('#destination').val(),
                expense = $('#expense').val(),
                weight = $('#weight').val(),
                sender = $('#sender').val(),
                receiver = $('#receiver').val();
            $.sendj('admin/ajax/addWayBill',
                {
                    itemName: itemName,
                    originPlace: originPlace,
                    destination: destination,
                    expense: expense,
                    weight: weight,
                    sender: sender,
                    receiver: receiver
                },
                function (data) {
                    console.log(data);
                    location.href = 'admin/waybill/showId';
                }
            )
        });

        hi.validate($);

        $(window).bind("load resize", function () {
            topOffset = 50;
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 768) {
                $('div.navbar-collapse').addClass('collapse');
                topOffset = 100; // 2-row-menu
            } else {
                $('div.navbar-collapse').removeClass('collapse');
            }

            height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $("#page-wrapper").css("min-height", (height) + "px");
            }
        });


    }
);