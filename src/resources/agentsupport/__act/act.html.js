define(function(require, exports, module) {
    module.exports="<div class=\"p-list p-act-lst\" js=\"true\" cache=\"false\">\n\t<div class=\"m-list m-act-lst u-list\">\n\t\t<div class=\"list-main\">\n\t\t\t<div class=\"list-header\">\n\t\t\t\t<h3>活跃度查询</h3>\n\t\t\t</div>\n\t\t\t<div class=\"list-bar\">\n\t\t\t\t<div class=\"list-bar-btns\">\n\t\t\t\t\t<button id=\"btnClear\">清空</button>\n\t\t\t\t\t<button id=\"btnReset\">重置</button>\n\t\t\t\t\t<button id=\"btnSearch\" class=\"btn-blue btn-search\">查询</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"list-bar-entry\">\n\t\t\t\t\t<label><span>行业</span>\n\t\t\t\t\t\t<select id=\"alIndustry\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label><span>产品模块</span>\n\t\t\t\t\t\t<select id=\"alPModule\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label><span>付费状态</span>\n\t\t\t\t\t\t<select id=\"alFStatus\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t\t<option value=\"true\">是</option>\n\t\t\t\t\t\t\t<option value=\"false\">否</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label><span>来源</span>\n\t\t\t\t\t\t<select id=\"alSource\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label class=\"sp\">\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>活跃时间</span>\n\t\t\t\t\t\t\t<input id=\"alAST\" type=\"text\" class=\"g-ipt ipt-l\" />\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>-</span>\n\t\t\t\t\t\t\t<input id=\"alAET\" type=\"text\" class=\"g-ipt ipt-l\" />\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label class=\"sp\">\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>开通时间</span>\n\t\t\t\t\t\t\t<input id=\"alCST\" type=\"text\" class=\"g-ipt ipt-l\" />\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>-</span>\n\t\t\t\t\t\t\t<input id=\"alCET\" type=\"text\" class=\"g-ipt ipt-l\" />\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</label>\n\t\t\t\t\t<br />\n\t\t\t\t\t<label><span>企业帐号或Id</span>\n\t\t\t\t\t\t<select id=\"alListType\">\n\t\t\t\t\t\t\t<option value=\"1\">帐号</option>\n\t\t\t\t\t\t\t<option value=\"2\">Id</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label><br />\n\t\t\t\t\t<textarea class=\"act-lst-tr\" id=\"alList\" /><br />\n\t\t\t\t\t<p class=\"tips\">提示：如果录入企业帐号或ID列表（任何空白字符包括换行符分隔）到上边的编辑框中，此处录入企业尽量不要过多，否则无法下载，如果遇到此种情况，可以分批下载。</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"list-content\">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>";
});