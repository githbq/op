define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"reqlist\">\r\n <% _.each(content,function(item){ %>\r\n <tr>\r\n <td></td>\r\n <td><%=item.enterpriseFilingName%></td>\r\n <td><%=item.requestStatusStr%></td>\r\n <td><%=item.createTimeStr%></td>\r\n <td><%=item.filingStatusStr%></td>\r\n <td><a data-id=\"<%=item.id%>\" class=\"requestdetail\" data-permissions=\"F009049\">查看</a></td>\r\n <td></td>\r\n </tr>\r\n <% }) %>\r\n</script>\r\n";
=======
    module.exports="<script type=\"text/template\" id=\"reqlist\">\n <% _.each(content,function(item){ %>\n <tr>\n <td></td>\n <td><%=item.enterpriseFilingName%></td>\n <td><%=item.requestStatusStr%></td>\n <td><%=item.createTimeStr%></td>\n <td><%=item.filingStatusStr%></td>\n <td><a data-id=\"<%=item.id%>\" class=\"requestdetail\" data-permissions=\"F009049\">查看</a></td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});