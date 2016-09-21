<%--
  Created by IntelliJ IDEA.
  User: admin
  Date: 2016/2/20
  Time: 16:31
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
    <%--<script src="resources/common/js/require.js" data-main="modules/index/js/query"></script>--%>
    <script src="resources/common/js/require.js" data-main="modules/index/js/timeline"></script>
</head>
<body>
<div class="panel-body">
<div class="row">
    <div class="col-xs-6" id="time-panel">

    </div>
</div>
</div>
</body>
</html>
