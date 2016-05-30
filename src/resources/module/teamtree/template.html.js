define(function(require, exports, module) {
    module.exports="<ul>\n<% _.each(content,function(item){ %>\n\t<li data-id=\"<%=item.id%>\"><p><%=item.name%><span class=\"select\" data-id=\"<%=item.id%>\">选择</span></p></li>\n<% }) %>\n</ul>\n";
});