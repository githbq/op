define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"script/template\" id=\"tracesend\">\r\n\t<div class=\"m-enttracesend\">\r\n\t\t<section class=\"send-data\">\r\n\t\t\t<p>\r\n\t\t\t\t<textarea placeholder=\"备注\" class=\"remark\"></textarea>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\"><span>图片</span><input type=\"file\" class=\"inputimg\" multiple=\"multiple\"></label>\r\n\t\t\t</p>\r\n\t\t\t<p class=\"imgdata\">\r\n\t\t\t\t\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\"><span>附件</span><input type=\"file\" class=\"inputfile\" multiple=\"multiple\"></label>\r\n\t\t\t</p>\r\n\t\t\t<p class=\"filedata\">\r\n\t\t\t\t\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t\t<label for=\"\"><span>时间</span><input type=\"text\" class=\"datetime\"></label>\r\n\t\t\t</p>\r\n\t\t</section>\r\n\t\t<section class=\"send-action\">\r\n\t\t\t<button class=\"send-btn\" data-permissions=\"F009083\">添加记录</button>\r\n\t\t</section>\r\n\t</div>\r\n</script>\r\n\r\n<script type=\"script/template\" id=\"tracesec\">\r\n\t<% _.each(content, function(item){ %>\r\n\t\t<section class=\"trace-sec\">\r\n\t\t\t<p class=\"sec-time\"><%=item.traceDateStr%> <%=item.enterpriseName%></p>\r\n\t\t\t<p class=\"sec-content\">\r\n\t\t\t\t<%=item.remark%>\r\n\t\t\t</p>\r\n\t\t\t<p class=\"sec-imgs\">\r\n\t\t\t\t<% _.each(item.imageList,function(img){ %>\r\n\t\t\t\t\t<a href=\"/op/api/enterprise/previewfile?path=<%=img.attachmentPath%>\" target=\"_blank\"> <img src=\"/op/api/enterprise/downloadfile?path=<%=img.attachmentPath%>\"> </a>\r\n\t\t\t\t<% }) %>\r\n\t\t\t</p>\r\n\t\t\t<p class=\"sec-attachs\">\r\n\t\t\t\t<% _.each(item.fileList,function(file){%>\r\n\t\t\t\t\t<span><%=file.attachmentName%> <b data-id=\"<%=file.id%>\" class=\"downloadfile\">下载</b></span><br>\r\n\t\t\t\t<% }) %>\r\n\t\t\t</p>\r\n\t\t</section>\r\n\t<% }) %>\r\n</script>\r\n\r\n";
=======
    module.exports="<script type=\"script/template\" id=\"tracesend\">\n\t<div class=\"m-enttracesend\">\n\t\t<section class=\"send-data\">\n\t\t\t<p>\n\t\t\t\t<textarea placeholder=\"备注\" class=\"remark\"></textarea>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\"><span>图片</span><input type=\"file\" class=\"inputimg\" multiple=\"multiple\"></label>\n\t\t\t</p>\n\t\t\t<p class=\"imgdata\">\n\t\t\t\t\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\"><span>附件</span><input type=\"file\" class=\"inputfile\" multiple=\"multiple\"></label>\n\t\t\t</p>\n\t\t\t<p class=\"filedata\">\n\t\t\t\t\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<label for=\"\"><span>时间</span><input type=\"text\" class=\"datetime\"></label>\n\t\t\t</p>\n\t\t</section>\n\t\t<section class=\"send-action\">\n\t\t\t<button class=\"send-btn\" data-permissions=\"F009083\">添加记录</button>\n\t\t</section>\n\t</div>\n</script>\n\n<script type=\"script/template\" id=\"tracesec\">\n\t<% _.each(content, function(item){ %>\n\t\t<section class=\"trace-sec\">\n\t\t\t<p class=\"sec-time\"><%=item.traceDateStr%> <%=item.enterpriseName%></p>\n\t\t\t<p class=\"sec-content\">\n\t\t\t\t<%=item.remark%>\n\t\t\t</p>\n\t\t\t<p class=\"sec-imgs\">\n\t\t\t\t<% _.each(item.imageList,function(img){ %>\n\t\t\t\t\t<a href=\"/op/api/enterprise/previewfile?path=<%=img.attachmentPath%>\" target=\"_blank\"> <img src=\"/op/api/enterprise/downloadfile?path=<%=img.attachmentPath%>\"> </a>\n\t\t\t\t<% }) %>\n\t\t\t</p>\n\t\t\t<p class=\"sec-attachs\">\n\t\t\t\t<% _.each(item.fileList,function(file){%>\n\t\t\t\t\t<span><%=file.attachmentName%> <b data-id=\"<%=file.id%>\" class=\"downloadfile\">下载</b></span><br>\n\t\t\t\t<% }) %>\n\t\t\t</p>\n\t\t</section>\n\t<% }) %>\n</script>\n\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});