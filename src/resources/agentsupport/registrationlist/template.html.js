define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" class=\"trTpl\">\r\n <% _.each(content,function(item){%>\r\n <tr>\r\n <td> </td>\r\n <td><%=item.name%></td>\r\n <td><%=item.account%></td>\r\n <td><%=item.sourceStr%></td>\r\n <td><%=item.statusStr%></td>\r\n <td><%=item.provinceStr%></td>\r\n <td><%=item.registerTimeStr%></td>\r\n <td>\r\n <a data-id=\"<%=item.id%>\" class=\"detail\">详情</a>\r\n <a data-id=\"<%=item.id%>\" class=\"distribute\">分配</a>\r\n </td>\r\n <td> </td>\r\n </tr>\r\n <%}) %>\r\n</script>\r\n\r\n<script type=\"text/template\" class=\"fenpei\">\r\n <div class=\"m-disagent\">\r\n <p class=\"title\">\r\n <span>用户名称</span><input type=\"text\" placeholder=\"查询\" ce-model=\"keyword\">\r\n </p>\r\n <table>\r\n <thead>\r\n <tr>\r\n <th>用户名称</th>\r\n <th>操作</th>\r\n </tr>\r\n </thead>\r\n <tbody ce-collection=\"list\">\r\n <tr data-name=\"<%=item.name%>\">\r\n <td>\r\n <%=item.name%>\r\n </td>\r\n <td>\r\n <a class=\"bindperson\" data-id=\"<%=item.id%>\">绑定</a>\r\n </td>\r\n </tr>\r\n </tbody>\r\n </table>\r\n </div>\r\n</script>\r\n\r\n\r\n\r\n\r\n";
});