define(function(require, exports, module) {
    module.exports="<div class=\"p-userlist p-list\" js=\"true\">\n\t<div class=\"u-tablelist m-userlist\">\n\t\t<div class=\"list-main\">\n\t\t\t<div class=\"list-header\">\n\t\t\t\t<h3>代理商用户列表</h3>\n\t\t\t</div>\n\t\t\t<div class=\"list-bar\">\n\t\t\t\t<div class=\"list-bar-btns\">\n\t\t\t\t\t<button class=\"btn-blue btn-search\">查询</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"list-bar-input\">\n\t\t\t\t\t<label for=\"\"> 优惠码 <input type=\"text\" ce-model=\"promotionCode\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=8> </label>\n\t\t\t\t\t<label for=\"\"> 代理商名称 <input type=\"text\" class=\"select-options\" ce-model=\"agentName\"></select> </label>\n\t\t\t\t\t<label for=\"\">\n\t\t\t\t\t\t角色\n\t\t\t\t\t\t<select name=\"\" id=\"\" ce-model=\"role\">\n\t\t\t\t\t\t\t<option value=\"\">请选择</option>\n\t\t\t\t\t\t\t<option value=\"0\">代理商销售用户</option>\n\t\t\t\t\t\t\t<!--<option value=\"1\">代理商增值用户</option>-->\n\t\t\t\t\t\t\t<option value=\"2\">代理商内部管理员</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</label>\n\t\t\t\t\t<label for=\"\"> 代理商用户姓名 <input type=\"text\" class=\"select-options\" ce-model=\"name\"></select> </label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"list-content\">\n\t\t\t\t<table>\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t\t<th>姓名</th>\n\t\t\t\t\t\t\t<th>角色</th>\n\t\t\t\t\t\t\t<th style=\"\">职位</th>\n\t\t\t\t\t\t\t<th style=\"\">手机</th>\n\t\t\t\t\t\t\t<th style=\"\">邮箱</th>\n\t\t\t\t\t\t\t<th style=\"\">训练营</th>\n\t\t\t\t\t\t\t<th>审核状态</th>\n\t\t\t\t\t\t\t<th>操作</th>\n\t\t\t\t\t\t\t<th></th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<!-- -->\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"list-pager\">\n\t\t</div>\n\t</div>\n</div>\n\n";
});