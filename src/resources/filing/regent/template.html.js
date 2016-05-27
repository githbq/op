define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<div class=\"m-disagent\">\r\n <p class=\"title\">\r\n <span>代理商名称</span><input type=\"text\" placeholder=\"查询\" ce-model=\"keyword\">\r\n </p>\r\n <table>\r\n <thead>\r\n <tr>\r\n <th>代理商名称</th>\r\n <th>操作</th>\r\n </tr>\r\n </thead>\r\n <tbody ce-collection=\"list\">\r\n <tr data-name=\"<%=item.name%>\">\r\n <td>\r\n <%=item.name%>\r\n </td>\r\n <td>\r\n <a class=\"bindagent\" data-id=\"<%=item.id%>\" data-permissions=\"F011015\">绑定</a>\r\n </td>\r\n </tr>\r\n </tbody>\r\n </table>\r\n</div>\r\n";
=======
    module.exports="<div class=\"m-disagent\">\n <p class=\"title\">\n <span>代理商名称</span><input type=\"text\" placeholder=\"查询\" ce-model=\"keyword\">\n </p>\n <table>\n <thead>\n <tr>\n <th>代理商名称</th>\n <th>操作</th>\n </tr>\n </thead>\n <tbody ce-collection=\"list\">\n <tr data-name=\"<%=item.name%>\">\n <td>\n <%=item.name%>\n </td>\n <td>\n <a class=\"bindagent\" data-id=\"<%=item.id%>\" data-permissions=\"F011015\">绑定</a>\n </td>\n </tr>\n </tbody>\n </table>\n</div>\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});