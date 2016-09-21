<%--
  Created by IntelliJ IDEA.
  User: admin
  Date: 2016/2/19
  Time: 13:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
%>
<html>
<head>
    <base href="<%=basePath%>">
    <title></title>
    <link rel="stylesheet" href="./resources/common/css/bootstrap.min.css"/>
    <script src="resources/common/js/require-config.js"></script>
    <script src="resources/common/js/require.js" data-main="modules/login/js/login"></script>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-md-4 col-md-offset-4">
            <div class="login-panel panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Please Sign In</h3>
                </div>
                <div class="panel-body">
                    <form role="form">
                        <fieldset>
                            <div class="form-group">
                                <input id="username" class="form-control"  autofocus>
                            </div>
                            <div class="form-group">
                                <input id="password" class="form-control" placeholder="Password" name="password" type="password"
                                       value="">
                            </div>

                            <!-- Change this to a button or input when using this as a form -->
                            <a id="login" class="btn btn-lg btn-success btn-block">Login</a>
                        </fieldset>
                    </form>
                    <div id="warning-alert" style="display: none;" class="alert alert-warning" role="alert">
                        帐号密码不匹配
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
