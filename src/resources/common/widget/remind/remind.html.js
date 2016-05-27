define(function(require, exports, module) {
    module.exports="<div class=\"m-wremind\">\r\n\t<div class=\"remind-vector\"></div>\r\n\t<div class=\"remind-list\" ce-collection=\"list\">\r\n\t\t<p><%=item.count%>条未读的<%=item.content%>信息&nbsp;&nbsp;<a class=\"remind-go\" data-id=\"<%=item.id%>\" data-type=\"<%=item.type%>\">查看</a></p>\r\n\t</div>\r\n</div>\r\n\r\n\r\n";
});