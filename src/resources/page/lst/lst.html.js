define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<div class=\"p-list p-act-lst\" js=\"true\" cache=\"false\">\r\n\t<div class=\"m-list m-act-lst u-list u-tablelist\">\r\n\t\t<div class=\"list-main\">\r\n\t\t\t<div class=\"list-header\">\r\n\t\t\t\t<h3>\r\n\t\t\t\t企业日活跃\r\n\t\t\t\t<div class=\"header-opts\">\r\n\t\t\t\t\t\r\n\t\t\t\t\t<!--<button id=\"btnRyhysExel\" class=\" btn-exel\">人员活跃企业数EXECL</button>-->\r\n\t\t\t\t</div>\r\n\t\t\t\t</h3>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"list-bar\" style=\"padding:0 25px;\">\r\n\t\t\t\t\r\n\t\t\t\t<div class=\"list-bar-entry active-list\">\r\n\t\t\t\t\t<!--<label style=\"display:none;\"><span>行业</span>\r\n\t\t\t\t\t\t<select id=\"alIndustry\">\r\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label style=\"display:none;\"><span>产品模块</span>\r\n\t\t\t\t\t\t<select id=\"alPModule\">\r\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</label style=\"display:none;\">\r\n\t\t\t\t\t<label style=\"display:none;\"><span>优惠码</span>\r\n\t\t\t\t\t\t<input id=\"alCode\" type=\"text\" class=\"g-ipt ipt-m\" />\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label style=\"display:none;\"><span>付费状态</span>\r\n\t\t\t\t\t\t<select id=\"alFStatus\">\r\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\r\n\t\t\t\t\t\t\t<option value=\"true\">是</option>\r\n\t\t\t\t\t\t\t<option value=\"false\">否</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</label >\r\n\t\t\t\t\t<label style=\"display:none;\"><span>来源</span>\r\n\t\t\t\t\t\t<select id=\"alSource\">\r\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</label >\r\n\t\t\t\t\t<label class=\"sp\" style=\"display:none;\">\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>活跃时间</span>\r\n\t\t\t\t\t\t\t<input id=\"alAST\" type=\"text\" class=\"g-ipt ipt-l\" />\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>-</span>\r\n\t\t\t\t\t\t\t<input id=\"alAET\" type=\"text\" class=\"g-ipt ipt-l\" />\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t</label>-->\r\n\t\t\t\t\t<label><span>企业账号</span>\r\n\t\t\t\t\t\t<input id=\"enterpriseAccount\" type=\"text\" class=\"g-ipt ipt-m enterpriseAccount\" />\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label><span>销售人员</span>\r\n\t\t\t\t\t\t<input id=\"alCode\" type=\"text\" class=\"g-ipt ipt-m alName\" />\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label class=\"sp\">\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>开通时间</span>\r\n\t\t\t\t\t\t\t<input id=\"alCST\" type=\"text\" class=\"g-ipt ipt-l\" onkeyup='this.value=\"\"'/>\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>-</span>\r\n\t\t\t\t\t\t\t<input id=\"alCET\" type=\"text\" class=\"g-ipt ipt-l\" onkeyup='this.value=\"\"'/>\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label class=\"sp\" >\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>活跃日期</span>\r\n\t\t\t\t\t\t\t<input id=\"alAST\" type=\"text\" class=\"g-ipt ipt-l start-active\" onkeyup='this.value=\"\"'/>\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>-</span>\r\n\t\t\t\t\t\t\t<input id=\"alAET\" type=\"text\" class=\"g-ipt ipt-l end-active\" onkeyup='this.value=\"\"'/>\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<br />\r\n\t\t\t\t\t<p class=\"fn-list\">\r\n\t\t\t\t\t\t<button id=\"btnDownExel\" class=\"btn-blue btn-exel\">日活列表导出</button>\r\n\t\t\t\t\t\t<button id=\"btnQyrhyExel\" class=\"btn-blue btn-exel\">日活详情导出</button>\r\n\t\t\t\t\t</p>\r\n\t\t\t\t\t<!--<label style=\"display:none;\"><span>企业帐号或Id</span>\r\n\t\t\t\t\t\t<select id=\"alListType\">\r\n\t\t\t\t\t\t\t<option value=\"1\">帐号</option>\r\n\t\t\t\t\t\t\t<option value=\"2\">Id</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</label><br />\r\n\t\t\t\t\t<textarea class=\"act-lst-tr\" id=\"alList\" style=\"display:none;\"/><br />\r\n\t\t\t\t\t<p class=\"tips\" style=\"display:none;\">提示：如果录入企业帐号或ID列表（任何空白字符包括换行符分隔）到上边的编辑框中，此处录入企业尽量不要过多，否则无法下载，如果遇到此种情况，可以分批下载。</p>-->\r\n\t\t\t\t</div>\r\n\t\t\t\t<!--<div class=\"list-bar-btns list-btn-exel\">\r\n\t\t\t\t\t<!--<button id=\"btnClear\">清空</button>\r\n\t\t\t\t\t<button id=\"btnReset\">重置</button>-->\r\n\t\t\t\t\t<!--<button id=\"btnSearch\" class=\"btn-blue btn-search\">查询</button>\r\n\t\t\t\t</div>-->\r\n\t\t\t</div>\r\n\t\t\t<div class=\"list-content\">\r\n\t\t\t\t<!--<table class=\"width-ad\">\r\n\t\t\t\t\t<thead >\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t\t\t<th style=\"width:160px;\">销售人员</th>\r\n\t\t\t\t\t\t\t<th style=\"width:110px;\">客户名称</th>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t<th style=\"width:220px;\">企业账号</th>\r\n\t\t\t\t\t\t\t<th >开通时间</th>\r\n\t\t\t\t\t\t\t<th>版本</th>\r\n\t\t\t\t\t\t\t<th style=\"width:168px;\">开通人数</th>\r\n\t\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</thead>\r\n\t\t\t\t\t<tbody>\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t</tbody>\r\n\t\t\t\t</table>-->\r\n\t\t\t</div>\r\n\t\t\t<!--<div class=\"list-pager\">\r\n\t\t\t\t\r\n\t\t\t</div>-->\r\n\t\t\t<div class=\"list-exel\">\r\n\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";
=======
    module.exports="<div class=\"p-list p-act-lst\" js=\"true\" cache=\"false\">\n\t<div class=\"m-list m-act-lst u-list u-tablelist\">\n\t\t<div class=\"list-main\">\n\t\t\t<div class=\"list-header\">\n\t\t\t\t<h3>\n\t\t\t\t企业日活跃\n\t\t\t\t<div class=\"header-opts\">\n\t\t\t\t\t\n\t\t\t\t\t<!--<button id=\"btnRyhysExel\" class=\" btn-exel\">人员活跃企业数EXECL</button>-->\n\t\t\t\t</div>\n\t\t\t\t</h3>\n\t\t\t</div>\n\t\t\t<div class=\"list-bar\" style=\"padding:0 25px;\">\n\t\t\t\t\n\t\t\t\t<div class=\"list-bar-entry active-list\">\n\t\t\t\t\t<!--<label style=\"display:none;\"><span>行业</span>\n\t\t\t\t\t\t<select id=\"alIndustry\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label style=\"display:none;\"><span>产品模块</span>\n\t\t\t\t\t\t<select id=\"alPModule\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label style=\"display:none;\">\n\t\t\t\t\t<label style=\"display:none;\"><span>优惠码</span>\n\t\t\t\t\t\t<input id=\"alCode\" type=\"text\" class=\"g-ipt ipt-m\" />\n\t\t\t\t\t</label>\n\t\t\t\t\t<label style=\"display:none;\"><span>付费状态</span>\n\t\t\t\t\t\t<select id=\"alFStatus\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t\t<option value=\"true\">是</option>\n\t\t\t\t\t\t\t<option value=\"false\">否</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label >\n\t\t\t\t\t<label style=\"display:none;\"><span>来源</span>\n\t\t\t\t\t\t<select id=\"alSource\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label >\n\t\t\t\t\t<label class=\"sp\" style=\"display:none;\">\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>活跃时间</span>\n\t\t\t\t\t\t\t<input id=\"alAST\" type=\"text\" class=\"g-ipt ipt-l\" />\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>-</span>\n\t\t\t\t\t\t\t<input id=\"alAET\" type=\"text\" class=\"g-ipt ipt-l\" />\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</label>-->\n\t\t\t\t\t<label><span>企业账号</span>\n\t\t\t\t\t\t<input id=\"enterpriseAccount\" type=\"text\" class=\"g-ipt ipt-m enterpriseAccount\" />\n\t\t\t\t\t</label>\n\t\t\t\t\t<label><span>销售人员</span>\n\t\t\t\t\t\t<input id=\"alCode\" type=\"text\" class=\"g-ipt ipt-m alName\" />\n\t\t\t\t\t</label>\n\t\t\t\t\t<label class=\"sp\">\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>开通时间</span>\n\t\t\t\t\t\t\t<input id=\"alCST\" type=\"text\" class=\"g-ipt ipt-l\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>-</span>\n\t\t\t\t\t\t\t<input id=\"alCET\" type=\"text\" class=\"g-ipt ipt-l\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label class=\"sp\" >\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>活跃日期</span>\n\t\t\t\t\t\t\t<input id=\"alAST\" type=\"text\" class=\"g-ipt ipt-l start-active\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>-</span>\n\t\t\t\t\t\t\t<input id=\"alAET\" type=\"text\" class=\"g-ipt ipt-l end-active\" onkeyup='this.value=\"\"'/>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</label>\n\t\t\t\t\t<br />\n\t\t\t\t\t<p class=\"fn-list\">\n\t\t\t\t\t\t<button id=\"btnDownExel\" class=\"btn-blue btn-exel\">日活列表导出</button>\n\t\t\t\t\t\t<button id=\"btnQyrhyExel\" class=\"btn-blue btn-exel\">日活详情导出</button>\n\t\t\t\t\t</p>\n\t\t\t\t\t<!--<label style=\"display:none;\"><span>企业帐号或Id</span>\n\t\t\t\t\t\t<select id=\"alListType\">\n\t\t\t\t\t\t\t<option value=\"1\">帐号</option>\n\t\t\t\t\t\t\t<option value=\"2\">Id</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label><br />\n\t\t\t\t\t<textarea class=\"act-lst-tr\" id=\"alList\" style=\"display:none;\"/><br />\n\t\t\t\t\t<p class=\"tips\" style=\"display:none;\">提示：如果录入企业帐号或ID列表（任何空白字符包括换行符分隔）到上边的编辑框中，此处录入企业尽量不要过多，否则无法下载，如果遇到此种情况，可以分批下载。</p>-->\n\t\t\t\t</div>\n\t\t\t\t<!--<div class=\"list-bar-btns list-btn-exel\">\n\t\t\t\t\t<!--<button id=\"btnClear\">清空</button>\n\t\t\t\t\t<button id=\"btnReset\">重置</button>-->\n\t\t\t\t\t<!--<button id=\"btnSearch\" class=\"btn-blue btn-search\">查询</button>\n\t\t\t\t</div>-->\n\t\t\t</div>\n\t\t\t<div class=\"list-content\">\n\t\t\t\t<!--<table class=\"width-ad\">\n\t\t\t\t\t<thead >\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t\t<th style=\"width:160px;\">销售人员</th>\n\t\t\t\t\t\t\t<th style=\"width:110px;\">客户名称</th>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<th style=\"width:220px;\">企业账号</th>\n\t\t\t\t\t\t\t<th >开通时间</th>\n\t\t\t\t\t\t\t<th>版本</th>\n\t\t\t\t\t\t\t<th style=\"width:168px;\">开通人数</th>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>-->\n\t\t\t</div>\n\t\t\t<!--<div class=\"list-pager\">\n\t\t\t\t\n\t\t\t</div>-->\n\t\t\t<div class=\"list-exel\">\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});