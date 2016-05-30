define(function(require, exports, module) {
    module.exports="<div class=\"m-express\">\n\n\t<h4 style=\"padding-top:0px;\">收件人信息</h4>\n\t<section class=\"content\">\n\t\t<p><span class=\"title\">发票收件人地址</span> <span class=\"value\" ce-model=\"receiverAddress\"></span></p>\n\t\t<p><span class=\"title\">发票收件人姓名</span> <span class=\"value\" ce-model=\"receiverName\"></span></p>\n\t\t<p><span class=\"title\">发票收件人电话</span> <span class=\"value\" ce-model=\"receiverPhone\"></span></p>\n\t\t<p><span class=\"title\">发票号码</span> <span class=\"value\" ce-model=\"invoiceNo\"></span></p>\n\t\t<p><span class=\"title\">开票日期</span> <span class=\"value\" ce-model=\"invoiceDateStr\"></span></p>\n\t</section>\n\n\t<h4>快递信息</h4>\n\n\t<p>\n\t\t<span class=\"title\">快递状态 <b class=\"nsr\">*</b></span>\n\t\t<select ce-model=\"expressStatus\">\n\t\t\t<option value=\"0\">未寄</option>\n\t\t\t<option value=\"1\">已寄</option>\n\t\t\t<option value=\"2\">自取</option>\n\t\t</select>\n\t</p>\n\t<p>\n\t\t<span class=\"title\">快递公司 <b class=\"nsr\">*</b></span>\n\t\t<input type=\"text\" ce-model=\"expressName\" maxlength=50>\n\t</p>\n\t<p>\n\t\t<span class=\"title\">快递单号 <b class=\"nsr\">*</b></span>\n\t\t<input type=\"text\" ce-model=\"expressNo\" maxlength=\"50\">\n\t</p>\n\t<p class=\"express-action\" data-state=\"finance\">\n\t\t<button type=\"button\" class=\"submit u-btn-blue\">提交</button>\n\t</p>\n</div>\n\n";
});