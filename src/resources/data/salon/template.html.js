define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"trSalon\">\n <% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><%=value.name%></td>\n <td><%=value.mobile%></td>\n <td><%=value.title%></td>\n <td><%=value.company%></td>\n <td><%=value.displayCreateTime%></td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n";
});