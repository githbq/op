define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"trtpl\">\r\n\t<% _.each( content, function( item , index ){%>\r\n\t\t<tr>\r\n\t\t\t<td></td>\r\n\t\t\t<td><%=item.name%></td>\r\n\t\t\t<td><%=item.id%></td>\r\n\t\t\t<td><%=item.cityStr%></td>\r\n\t\t\t<td><%=item.regionName %></td>\r\n\t\t\t<td><%=item.statusStr%></td>\r\n\t\t\t<td> \r\n\t\t\t\t<a data-id=\"<%=item.id%>\" class=\"agent-edit\" data-permissions=\"F010010\">编辑</a> \r\n\t\t\t\t<a data-id=\"<%=item.id%>\" data-name=\"<%=item.name%>\" class=\"agent-detail\" data-permissions=\"F010003\">查看用户</a> \r\n\t\t\t</td>\r\n\t\t\t<td></td>\r\n\t\t</tr>\r\n\t<% }) %>\r\n</script>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n";
=======
    module.exports="<script type=\"text/template\" id=\"trtpl\">\n\t<% _.each( content, function( item , index ){%>\n\t\t<tr>\n\t\t\t<td></td>\n\t\t\t<td><%=item.name%></td>\n\t\t\t<td><%=item.id%></td>\n\t\t\t<td><%=item.cityStr%></td>\n\t\t\t<td><%=item.regionName %></td>\n\t\t\t<td><%=item.statusStr%></td>\n\t\t\t<td> \n\t\t\t\t<a data-id=\"<%=item.id%>\" class=\"agent-edit\" data-permissions=\"F010010\">编辑</a> \n\t\t\t\t<a data-id=\"<%=item.id%>\" data-name=\"<%=item.name%>\" class=\"agent-detail\" data-permissions=\"F010003\">查看用户</a> \n\t\t\t</td>\n\t\t\t<td></td>\n\t\t</tr>\n\t<% }) %>\n</script>\n\n\n\n\n\n\n\n\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});