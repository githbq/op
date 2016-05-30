define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"list\">\n <% _.each( content, function(item){ %>\n <tr>\n <td><a data-id=\"<%=item.id%>\" class=\"attachement\"><%=item.attachmentName%><a></td>\n <td><%=item.attachmentSizeStr%></td>\n <td><%=item.remark%></td>\n <td><%=item.createTimeStr%></td>\n </tr>\n <% }) %>\n</script>\n\n\n";
});