/**
 * Created by admin on 2016/2/20.
 */
require(['jquery',
    'underscore',
    'bootstrap',
    'util',
    'css!modules/admin/css/font-awesome.min.css',
    'css!modules/admin/css/sb-admin-2.css',
    'css!modules/admin/css/timeline.css'],
    function($){
        var wayBillId=hi.getQueryString("wayBillId");
        $._send('admin/ajax/getJourneyRecordByWayBillId/'+wayBillId,function(data){
            _.each(data,function(dispatch,index){
                $('#timeline').append(formatTimeLine(dispatch,index));
                console.log(dispatch);
            });
        });
    });
function formatTimeLine(dispatch,index){
    var direction='';
    var icon='fa-check';
    var color='success';
    if(index%2!='0'){
        direction='class="timeline-inverted"';
    }
    if(dispatch.state=='1'){
        icon='fa-credit-card';
        color='warning';
    }
    return '<li ' +direction+
        '>'+
        '<div class="timeline-badge ' +
        color +
        '">'+'<i class="fa ' +
         icon +
        '">'+'</i>'+
        '</div>'+
        '<div class="timeline-panel">'+
        '<div class="timeline-heading">'+
        '<h4 class="timeline-title">'+
       dispatch.originPlace+'-'+dispatch.destination+
    '</h4>'+
    '<p>'+'<small class="text-muted">'+'<i class="fa fa-clock-o">'+'</i>'+
    dispatch.arriveTime+'抵达'+dispatch.destination+
    '</small>'+
    '</p>'+
    '</div>'+
    '</div>'+
    '</li>';
}
