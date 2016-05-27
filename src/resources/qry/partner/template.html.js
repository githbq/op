define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"trPartner\">\r\n <% _.each(content,function( value ,index ){ %>\r\n <tr>\r\n <td></td>\r\n <td><%=value.company%></td>\r\n <td><%=value.name%></td>\r\n <td><%=value.mobile%></td>\r\n <td><%=value.post%></td>\r\n <td><%=value.product%></td>\r\n <td><%=value.intention%></td>\r\n <td><%=value.displayCreateTime%></td>\r\n <td></td>\r\n </tr>\r\n <% }) %>\r\n</script>\r\n";
=======
    module.exports="<script type=\"text/template\" id=\"trPartner\">\n <% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><%=value.company%></td>\n <td><%=value.contactName%></td>\n <td><%=value.contactMobile%></td>\n <td><%=value.contactTitle%></td>\n <td><%=value.coopProduct%></td>\n <td><%=value.coopIntention%></td>\n <td><%=value.displayCreateTime%></td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});