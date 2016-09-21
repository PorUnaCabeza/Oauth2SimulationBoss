<%--
  Created by IntelliJ IDEA.
  User: admin
  Date: 2016/2/20
  Time: 16:33
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
    <script src="resources/common/js/require-config.js"></script>
    <script src="resources/common/js/require.js" data-main="modules/index/js/index"></script>
</head>
<body>
<div>
    <h1 style="text-align: center;">Boss</h1>
</div>
<div>
    <h2 style="text-align: center;">
        <a href="login/login">登录</a>
    </h2>
</div>

</body>
</html>
