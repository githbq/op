define(function(require, exports, module) {
    module.exports="<div class=\"p-agtlist p-list\" js=\"true\" cache=\"false\">\n\t<div class=\"u-tablelist m-agtlist\">\n\t\t<div class=\"list-main\">\n\t\t\t<div class=\"list-header\">\n\t\t\t\t<h3>代理商</h3>\n\t\t\t</div>\n\t\t\t<div class=\"list-bar\">\n\t\t\t\t<div class=\"list-bar-btns\">\n\t\t\t\t\t<button class=\"btn-blue btn-search\" data-permissions=\"F008124\">查询</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"list-bar-input\">\n\t\t\t\t\t<label for=\"\"> 优惠码 <input type=\"text\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" ce-model=\"promotionCode\" maxlength=8> </label>\n\t\t\t\t\t<label for=\"\"> 省或直辖市 <select name=\"\" class=\"select-city\" ce-model=\"city\"></select> </label>\n\t\t\t\t\t<label for=\"\"> 代理商名称 <input type=\"text\" ce-model=\"name\"> </label>\n\t\t\t\t\t<label for=\"\">\n\t\t\t\t\t\t状态\n\t\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"status\">\n\t\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t\t<option value=\"1\">已启用</option>\n\t\t\t\t\t\t\t<option value=\"0\">已停用</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"list-content\">\n\t\t\t\t<table>\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t\t<th>代理商名称</th>\n\t\t\t\t\t\t\t<th style=\"width:110px;\">优惠码</th>\n\t\t\t\t\t\t\t<th style=\"width:110px;\">省或直辖市</th>\n\t\t\t\t\t\t\t<th style=\"width:80px;\">状态</th>\n\t\t\t\t\t\t\t<th style=\"width:80px;\"></th>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<!-- -->\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"list-pager\">\n\t\t</div>\n\t</div>\n</div>\n\n";
});