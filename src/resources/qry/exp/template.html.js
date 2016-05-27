define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<script type=\"text/template\" id=\"expCountResult\">\r\n <h3>查询结果</h3>\r\n <div id=\"console\">\r\n <p>查询开始时间: <span class=\"hl\"><%=value.dst%></span></p>\r\n <p>查询结束时间: <span class=\"hl\"><%=value.dct%></span></p>\r\n <p>共有符合条件的记录: <span class=\"hl\"><%=value.count%></span> 个</p>\r\n </div>\r\n <% if ( value.canGenerate ) { %>\r\n <p class=\"btns\"><button id=\"btnDownload\" class=\"btn-blue\">下载报告</button></p>\r\n <% } %>\r\n</script>";
=======
    module.exports="<script type=\"text/template\" id=\"expCountResult\">\n <h3>查询结果</h3>\n <div id=\"console\">\n <p>查询开始时间: <span class=\"hl\"><%=value.dst%></span></p>\n <p>查询结束时间: <span class=\"hl\"><%=value.dct%></span></p>\n <p>共有符合条件的记录: <span class=\"hl\"><%=value.count%></span> 个</p>\n </div>\n <% if ( value.canGenerate ) { %>\n <p class=\"btns\"><button id=\"btnDownload\" class=\"btn-blue\">下载报告</button></p>\n <% } %>\n</script>";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});