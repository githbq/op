define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"trPdtLst\">\r\n <% _.each(content,function( value ,index ){ %>\r\n <tr>\r\n <td></td>\r\n <td><%=value.name%></td>\r\n <td><%=value.deviceMaxCount%></td>\r\n <td><%=value.textMessageCount %></td>\r\n <td><%=value.textMessageMethod%></td>\r\n <td><%=value.storage%> (GB)</td>\r\n <td><%=value.freeStr%></td>\r\n <td><a class=\"entList\" data-id=\"<%=value.id%>\">企业</a> <a class=\"addEnt\" data-id=\"<%=value.id%>\">添加企业</a></td>\r\n <td></td>\r\n </tr>\r\n <% }) %>\r\n</script>\r\n";
=======
    module.exports="<script type=\"text/template\" id=\"trPdtLst\">\n <% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><%=value.name%></td>\n <td><%=value.deviceMaxCount%></td>\n <td><%=value.textMessageCount %></td>\n <td><%=value.textMessageMethod%></td>\n <td><%=value.storage%> (GB)</td>\n <td><%=value.freeStr%></td>\n <td><a class=\"entList\" data-id=\"<%=value.id%>\">企业</a> <a class=\"addEnt\" data-id=\"<%=value.id%>\">添加企业</a></td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});