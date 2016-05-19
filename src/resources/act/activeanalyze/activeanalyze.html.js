define(function(require, exports, module) {
    module.exports="<div class=\"p-list p-act-lst\" js=\"true\" cache=\"false\">\r\n\t<div class=\"m-list m-active-analyze u-tablelist\">\r\n\t\t<div class=\"list-main\">\r\n\t\t\t<div class=\"list-header\">\r\n\t\t\t\t<h3>\r\n\t\t\t\t阶段活跃分析\r\n\t\t\t\t<div class=\"header-opts\">\r\n\t\t\t\t\t\r\n\t\t\t\t\t<!--<button id=\"btnRyhysExel\" class=\" btn-exel\">人员活跃企业数EXECL</button>-->\r\n\t\t\t\t</div>\r\n\t\t\t\t</h3>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"list-bar\">\r\n\t\t\t\t<div class=\"list-bar-btns\" style=\"width:200px;\">\r\n\t\t\t\t\t<button id=\"btnSearch\" class=\"btn-blue btn-search\" data-permissions=\"F009078\">查询</button>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"list-bar-input active-list\">\r\n\t\t\t\t\t\r\n\t\t\t\t\t<label><span>企业账号</span>\r\n\t\t\t\t\t\t<input ce-model=\"account\" type=\"text\" class=\"g-ipt ipt-m account\" onchange=\"this.value=this.value.replace(/(^\\s*)|(\\s*$)/g,'').toLowerCase( )\"/>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label><span>销售人员</span>\r\n\t\t\t\t\t\t<input ce-model=\"name\" type=\"text\" class=\"g-ipt ipt-m sellName\" onchange=\"this.value=this.value.replace(/(^\\s*)|(\\s*$)/g,'')\"/>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t\r\n\t\t\t\t\t<label class=\"sp\" >\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>开通时间</span>\r\n\t\t\t\t\t\t\t<input ce-model=\"appTimeStart\" type=\"text\" class=\"g-ipt ipt-l app-time-start\" onkeyup='this.value=\"\"'/>\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t<label>\r\n\t\t\t\t\t\t\t<span>-</span>\r\n\t\t\t\t\t\t\t<input ce-model=\"appTimeEnd\" type=\"text\" class=\"g-ipt ipt-l app-time-end\" onkeyup='this.value=\"\"'/>\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t\t<span>阶段活跃</span>\r\n\t\t\t\t\t\t<select name=\"\" class=\"period\" ce-model=\"period\" >\r\n\t\t\t\t\t\t\t<option value=\"1\">第一阶段</option>\r\n\t\t\t\t\t\t\t<option value=\"2\">第二阶段</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label><span>达到活跃天数</span>\r\n\t\t\t\t\t\t<input ce-model=\"activityCount\" type=\"text\" class=\"g-ipt ipt-m activityCount\" onchange=\"this.value=this.value.replace(/\\D/g,'')\"/>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<br />\r\n\t\t\t\t\t\r\n\t\t\t\t\t<!--<label style=\"display:none;\"><span>企业帐号或Id</span>\r\n\t\t\t\t\t\t<select id=\"alListType\">\r\n\t\t\t\t\t\t\t<option value=\"1\">帐号</option>\r\n\t\t\t\t\t\t\t<option value=\"2\">Id</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</label><br />\r\n\t\t\t\t\t<textarea class=\"act-lst-tr\" id=\"alList\" style=\"display:none;\"/><br />\r\n\t\t\t\t\t<p class=\"tips\" style=\"display:none;\">提示：如果录入企业帐号或ID列表（任何空白字符包括换行符分隔）到上边的编辑框中，此处录入企业尽量不要过多，否则无法下载，如果遇到此种情况，可以分批下载。</p>-->\r\n\t\t\t\t</div>\r\n\t\t\t\t\r\n\t\t\t</div>\r\n\t\t\t<div class=\"list-content\">\r\n\t\t\t\t<table>\r\n\t\t\t\t\t<thead>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t\t\t<th style=\"\">销售员工</th>\r\n\t\t\t\t\t\t\t<th style=\"min-width:160px\">企业名称</th>\r\n\t\t\t\t\t\t\t<th style=\"width:100px;\">开通时间</th>\r\n\t\t\t\t\t\t\t<th style=\"width:200px;\">平均开通数</th>\r\n\t\t\t\t\t\t\t<th style=\"width:100px;\">阶段活跃天数</th>\r\n\t\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</thead>\r\n\t\t\t\t\t<tbody>\r\n\t\t\t\t\t\t<!-- -->\r\n\t\t\t\t\t</tbody>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"list-pager\">\r\n\t\t\t\t\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";
});