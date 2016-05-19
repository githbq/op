define(function(require, exports, module) {
    module.exports="<script type=\"text/template\" id=\"trEme\">\n <% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><%=value.mobileoremail%></td>\n <td><%=value.limit%></td>\n <td><%=value.usedcount%></td>\n <td>\n <em class=\"accountdetail\" data-mobile=\"<%=value.mobileoremail%>\" data-limit=\"<%=value.limit%>\" data-usedcount=\"<%=value.usedcount%>\" data-permissions=\"F008114\">查看</em>\n\t\t</td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n\n\n<script type=\"text/template\" id=\"accountDetail\">\n <div class=\"m-accountdetail u-tablelist\">\n\t\t<div class=\"list-bar\">\n\t\t\t\n\t\t\t<div class=\"list-bar-input\">\n\t\t\t\t<label>\n\t\t\t\t\t<span>账号</span>\n\t\t\t\t\t<input name=\"mobile\" class=\"g-ipt ipt-s mobile\" type=\"text\" ce-model=\"mobile\" disabled=disabled style=\"width:102px;\"/>\n\t\t\t\t</label>\n\t\t\t\t<label>\n\t\t\t\t\t<span>可注册企业上限</span>\n\t\t\t\t\t<input name=\"limit\" class=\"g-ipt ipt-s limit\" type=\"text\" ce-model=\"limit\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=4/>\n\t\t\t\t</label>\n\t\t\t\t<label>\n\t\t\t\t\t<span>已用量</span>\n\t\t\t\t\t<input name=\"usedcount\" class=\"g-ipt ipt-s usedcount\" type=\"text\" ce-model=\"usedcount\" disabled=disabled/>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<p style=\"text-align:right;\"><button id=\"saveLimit\" class=\"btn-blue\" data-permissions=\"F008001 F008002 F008128 F008116\">保存</button></p>\n\t\t</div>\n\t\t<h3 style=\"padding:10px 0px; font-size:16px; font-weight:bold; color:#666;background:#f8f8f8;\">操作日志</h3>\n\t\t <div class=\"list-content\">\n\t\t\t<table class=\"operating-log\">\n\t\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th></th>\n\t\t\t\t\t<th style=\"width: 180px;\">操作日志</th>\n\t\t\t\t\t<th style=\"width: 100px;\">操作人</th>\n\t\t\t\t\t<th style=\"\">时间</th>\n\t\t\t\t\t<th></th>\n\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\t\t<div class=\"list-pager operating-list-pager\" style=\"border:none;\">\n\t\t</div>\n\t\t<h3 style=\"font-size:16px; font-weight:bold; color:#666;background:#f8f8f8;\">拦截日志</h3>\n\t\t <div class=\"list-content\">\n\t\t\t<table class=\"stop-log\">\n\t\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th></th>\n\t\t\t\t\t<th style=\"width: 120px;\">时间</th>\n\t\t\t\t\t<th style=\"width: 100px;\">账号</th>\n\t\t\t\t\t<th style=\"\">拦截信息</th>\n\t\t\t\t\t<th></th>\n\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\t\t<div class=\"list-pager stop-list-pager\" style=\"border:none;\">\n\t\t</div>\n </div>\n</script>\n<script type=\"text/template\" id=\"trloglist\">\n\t<% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><%=value.remark %></td>\n <td><%=value.creatorName%></td>\n <td><%=value.createTimeStr%></td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n<script type=\"text/template\" id=\"trstoplist\">\n\t<% _.each(content,function( value ,index ){ %>\n <tr>\n <td></td>\n <td><%=value.intercepttimeStr %></td>\n <td><%=value.mobile%></td>\n <td><%=value.description%></td>\n <td></td>\n </tr>\n <% }) %>\n</script>\n\n";
});