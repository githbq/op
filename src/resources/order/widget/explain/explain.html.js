define(function(require, exports, module) {
    module.exports="<div style=\"border:1px solid #ff0000; padding: 20px;\">\n\t<div class=\"explain-title\" style=\"color:#ff0000;\">\n\t\t<p>特批单情况:</p>\n\t\t<ul>\n\t\t\t<li>1.服务费低于标准价格</li>\n\t\t\t<li>2.折扣低于8折</li>\n\t\t\t<li>3.特殊条款</li>\n\t\t\t<li>4.分期付款</li>\n\t\t\t<li>5.赠送/试用</li>\n\t\t</ul>\n\t\t<p> 以上情况需在纷享平台上提特殊审批，方可进行以下操作</p>\n\t</div>\n\t<div class=\"approval-box\">\n\t\t<label for=\"\" class=\"edit-url\">\n\t\t\t<span>特批链接 <b class=\"check-edit\" style=\"color:#ff0000;\">*</b> </span>\n\t\t\t<input type=\"text\" ce-model=\"approvedUrl\" class=\"required-basic edit-flag\" placeholder=\"http://\" style=\"width:370px\">\n\t\t</label>\n\t\t<label for=\"\" class=\"show-url\">\n\t\t\t<span>特批链接 <b class=\"check-edit\" style=\"color:#ff0000;\">*</b> </span>\n\t\t\t<a href=\"\" target=\"_blank\" ce-model=\"approvedUrl\" class=\"approval-url\" ></a>\n\t\t</label>\n\t</div>\n</div>";
});