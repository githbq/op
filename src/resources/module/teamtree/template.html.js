define(function(require, exports, module) {
    module.exports="<ul>\r\n<% _.each(content,function(item){ %>\r\n\t<li data-id=\"<%=item.id%>\"><p><%=item.name%><span class=\"select\" data-id=\"<%=item.id%>\">选择</span></p></li>\r\n<% }) %>\r\n</ul>\r\n";
});