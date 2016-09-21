/**
 * Created by admin on 2016/2/19.
 */
require(['jquery','util'],function($,bootstrap){
    $('#login').click(function(){
        var username=$('#username').val();
        var password=$('#password').val();
        $.sendj('login/checkLogin',{username:username,password:password},function(data){
            if(data.code=='1'){
                $('#warning-alert').hide();
                window.location.href="admin/index";
            }
            else{
                $('#warning-alert').show();
            }
        });

    });
});