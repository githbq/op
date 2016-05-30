define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"list\">\r\n <% _.each( content, function(item){ %>\r\n <tr>\r\n <td><a data-id=\"<%=item.id%>\" class=\"attachement\"><%=item.attachmentName%><a></td>\r\n <td><%=item.attachmentSizeStr%></td>\r\n <td><%=item.remark%></td>\r\n <td><%=item.createTimeStr%></td>\r\n </tr>\r\n <% }) %>\r\n</script>\r\n\r\n\r\n";
=======
    module.exports="<script type=\"text/template\" id=\"list\">\n <% _.each( content, function(item){ %>\n <tr>\n <td><a data-id=\"<%=item.id%>\" class=\"attachement\"><%=item.attachmentName%><a></td>\n <td><%=item.attachmentSizeStr%></td>\n <td><%=item.remark%></td>\n <td><%=item.createTimeStr%></td>\n </tr>\n <% }) %>\n</script>\n\n\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});