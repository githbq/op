define(function(require, exports, module) {
    module.exports="<div class=\"m-wremind\">\n\t<div class=\"remind-vector\"></div>\n\t<div class=\"remind-list\" ce-collection=\"list\">\n\t\t<p><%=item.count%>条未读的<%=item.content%>信息&nbsp;&nbsp;<a class=\"remind-go\" data-id=\"<%=item.id%>\" data-type=\"<%=item.type%>\">查看</a></p>\n\t</div>\n</div>\n\n\n";
});