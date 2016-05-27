define(function(require, exports, module) {
    module.exports="<div class=\"m-enterprisedetail\">\n\n\t<div class=\"dtl sectiona\">\n\t\n\t\t<section>\n\t\t\t<h4>基本信息</h4>\n\t\t\t<p>\n\t\t\t\t<label><span>企业名称</span><input id=\"bName\" class=\"g-ipt ipt-l \" type=\"text\" disabled=\"disabled\"></label>\n\t\t\t\t<label><span>企业账号</span><input id=\"bAccount\" disabled=\"disabled\" class=\"g-ipt ipt-l\" type=\"text\" disabled=\"disabled\"></label>\n\t\t\t\t<label class=\"hw\"><span>来 源</span><select id=\"tSource\" class=\"sa-source \" disabled=\"disabled\"></select></label>\n\t\t\t\t<label><span>代理商名称</span><input id=\"sAgentName\" disabled=\"disabled\" class=\"g-ipt ipt-l\" type=\"text\"></label>\n\t\t\t</p>\n\t\t</section>\n\t</div>\n\t<div class=\"dtl\">\n\t\t\n\t\t<!--资料审核-->\n\t\t<section class=\"accordian collapse commonsection\" data-target=\"verification\" id=\"verification\" >\n\t\t\t<h4><span class=\"arraw\"></span>资料审核</h4>\n\t\t\t<div class=\"content\">\n\n\t\t\t\t<h5>营业执照</h5>\n\t\t\t\t<p>\n\t\t\t\t\t<a href=\"\" id=\"yingyezhizhaoinfo\" target=\"_blank\"><img src=\"\" style=\"width:350px; height:200px;\"></a>\n\t\t\t\t\t<span id=\"yingyezhizhaonone\" style=\"display:none; color:#0000ff; margin-left:20px;\">未上传</span>\n\t\t\t\t</p>\n\t\t\t\t<h5>合同</h5>\n\t\t\t\t<p>\n\t\t\t\t\t<a id=\"hetonginfo\" style=\"display:none;\" target=\"_blank\" href=\"\">\n\t\t\t\t\t\t<!-- -->\n\t\t\t\t\t</a>\n\t\t\t\t\t<span id=\"hetongnone\" style=\"display:none; color:#0000ff; margin-left:20px;\">未上传</span>\n\t\t\t\t</p>\n\t\t\t\t<h5>合同副本</h5>\n\t\t\t\t<p>\n\t\t\t\t\t<a id=\"hetongfbinfo\" style=\"display:none\" target=\"_blank\" href=\"\">\n\t\t\t\t\t\t<!-- -->\n\t\t\t\t\t</a>\n\t\t\t\t\t<span id=\"hetongfbnone\" style=\"display:none; color:#0000ff; margin-left:20px;\">未上传</span>\n\t\t\t\t</p>\n\t\t\t\t<h5>门头信息</h5>\n\t\t\t\t<p>\n\t\t\t\t\t<a href=\"\" id=\"mentouinfo\" target=\"_blank\"><img src=\"\" style=\"width:350px; height:200px;\"></a>\n\t\t\t\t\t<span id=\"mentounone\" style=\" display:none; color:#0000ff; margin-left:20px;\">未上传</span>\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<label for=\"\">\n\t\t\t\t\t\t<span>门头照片关键字</span>\n\t\t\t\t\t\t<input type=\"text\" id=\"companyGateKeyword\" disabled=\"disabled\">\n\t\t\t\t\t</label>\n\t\t\t\t\t<label for=\"\">\n\t\t\t\t\t\t<span>门头照片备注</span>\n\t\t\t\t\t\t<input type=\"text\" id=\"companyGateRemark\" disabled=\"disabled\">\n\t\t\t\t\t</label>\n\t\t\t\t</p>\n\t\t\t\t<p id=\"shenheresult\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<span>审核结果</span><input type=\"text\" disabled=\"disabled\" ce-model=\"checkresult\">\n\t\t\t\t\t</label>\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<span>操作人</span><input type=\"text\" ce-model=\"informationCheckName\" disabled=\"disabled\">\n\t\t\t\t\t</label>\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<span>操作时间</span><input type=\"text\" ce-model=\"informationCheckTimeStr\" disabled=\"disabled\">\n\t\t\t\t\t</label>\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<span>审核意见</span>\n\t\t\t\t\t\t<textarea class=\"approvalinfo\"></textarea>\n\t\t\t\t\t</label>\n\t\t\t\t</p>\n\t\t\t\t<p class=\"off btns\">\n\t\t\t\t\t<button class=\"u-btn-blue verificationaction-on\">审核通过</button>\n\t\t\t\t\t<button class=\"u-btn-red verificationaction-off\">审核驳回</button>\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</section>\n\n\t\t<!--电话回访-->\n\t\t<section class=\"accordian collapse commonsection off\" data-target=\"callback\" id=\"phonecallback\">\n\t\t\t<h4><span class=\"arraw\"></span>电话回访</h4>\n\t\t\t<div class=\"content\">\n\t\t\t\t<div class=\"content-result\">\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>电话回访状态</span>\n\t\t\t\t\t\t\t<select id=\"phonecallbackselect\" ce-model=\"returnVisitCheck\">\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>作弊情况</span>\n\t\t\t\t\t\t\t<select id=\"cheatstatus\" ce-model=\"cheatType\">\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>操作人</span>\n\t\t\t\t\t\t\t<input type=\"text\" disabled=\"disabled\" ce-model=\"returnVisitCheckName\">\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<span>操作时间</span>\n\t\t\t\t\t\t\t<input type=\"text\" disabled=\"disabled\" ce-model=\"returnVisitCheckTimeStr\">\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class=\"huifangresult\">\n\t\t\t\t\t\t<span>回访结果</span>\n\t\t\t\t\t\t<b ce-model=\"returnVisitCheckStr\"></b>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class=\"btns\">\n\t\t\t\t\t\t<button class=\"callback-actionon u-btn-blue\">保存</button>\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"content-list tb\">\n\t\t\t\t\t<table>\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>姓名</th>\n\t\t\t\t\t\t\t\t<th>是否是管理员</th>\n\t\t\t\t\t\t\t\t<th>电话</th>\n\t\t\t\t\t\t\t\t<th>操作</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</section>\n\n\t\t<!--风险详情-->\n\t\t<section class=\"accordian collapse commonsection off\" data-target=\"riskInfo\" id=\"riskInfo\">\n\t\t\t<h4><span class=\"arraw\"></span>风险详情</h4>\n\t\t\t<div class=\"content\">\n\t\t\t\t<div class=\"content-list tb\">\n\t\t\t\t\t<table>\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>日期</th>\n\t\t\t\t\t\t\t\t<th>规则1</th>\n\t\t\t\t\t\t\t\t<th>规则2</th>\n\t\t\t\t\t\t\t\t<th>规则3</th>\n\t\t\t\t\t\t\t\t<th>规则4</th>\n\t\t\t\t\t\t\t\t<th>规则5</th>\n\t\t\t\t\t\t\t\t<th>规则6</th>\n\t\t\t\t\t\t\t\t<th>警告1</th>\n\t\t\t\t\t\t\t\t<th>警告2</th>\n\t\t\t\t\t\t\t\t<th>警告3</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t\t<div class=\"pager\"></div>\n\t\t\t\t\t<p>防作弊规则：<br/><span class=\"cheat-rule\"></span></p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</section>\n\t</div>\n</div>\n\n\n";
});