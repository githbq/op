define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"trTpl\">\n <% _.each( content, function( item , index ){%>\n <tr>\n <td></td>\n <td><%=item.typeStr%></td>\n <td><%=item.creator.name%></td>\n <td><%=item.vendorName%></td>\n <td><%=item.remark%></td>\n <td><%=item.createTimeStr%></td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n\n";
});