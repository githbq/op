define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"trPartner\">\r\n <% _.each(content,function( value ,index ){ %>\r\n <tr>\r\n <td></td>\r\n <td><%=value.company%></td>\r\n <td><%=value.name%></td>\r\n <td><%=value.mobile%></td>\r\n <td><%=value.post%></td>\r\n <td><%=value.product%></td>\r\n <td><%=value.intention%></td>\r\n <td><%=value.displayCreateTime%></td>\r\n <td></td>\r\n </tr>\r\n <% }) %>\r\n</script>\r\n";
});