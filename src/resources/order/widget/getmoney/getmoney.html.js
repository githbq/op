define(function(require, exports, module) {
    module.exports="<div >\n <div class=\"forminfo\">\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">合同号：</span>\n <span ce-model=\"contractNo\"></span>\n </label>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">合同总金额(元)：</span>\n <span ce-model=\"amount\"></span>\n </label>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">到款金额（财务确认到款)(元)：</span>\n <span ce-model=\"auditedAmount\"></span>\n </label>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">已收金额（财务审核中）(元):</span>\n <span ce-model=\"auditAmount\"></span>\n </label>\n </div>\n </div>\n </div>\n\t\t <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">代理商已收金额(元)：</span>\n <span ce-model=\"agentCurrPayAmount\" ></span>\n </label>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">未收金额：</span>\n <span ce-model=\"noChargeAmount\"></span>\n </label>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">当前状态：</span>\n <select ce-model=\"payStatus\" disabled=\"disabled\">\n <option value=\"1\">付清</option>\n <option value=\"2\">分期</option>\n <option value=\"3\">未付</option>\n </select>\n </label>\n </div>\n </div>\n </div>\n <br/>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label>\n <span class=\"label\">本次付费状态</span>\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\n </label>\n <select data-name=\"\" class=\"payStatus-select edit-flag \">\n <option value=\"1\">补齐尾款</option>\n <option value=\"2\">分期</option>\n </select>\n </div>\n </div>\n </div>\n <div class=\"stage-box\" style=\"border:1px #ccc solid;display: none;\">\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label style=\"width:250px;\">\n <span class=\"label\">本期每项应用金额（元）</span>\n </label>\n </div>\n </div>\n <div class=\"app-box\">\n\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label>\n <span class=\"label\">本次到款金额(元)</span>\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\n </label>\n <input data-name=\"currPayAmount\" ce-model=\"currPayAmount\" data-type=\"number\" type=\"text\" class=\"\" name=\"\" disabled=\"disabled\"/>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label>\n <span class=\"label\">打款日期</span>\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\n </label>\n <input data-name=\"payDate\" ce-model=\"payDate\" type=\"text\" class=\"required-basic payDate edit-flag\" name=\"\"/>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n\n <div class=\"field\">\n <label>\n <span class=\"label\">收款账户</span>\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\n </label>\n <input data-name=\"receiptsAccount\" ce-model=\"receiptsAccount\" type=\"text\" class=\"ipt-l bankno required-basic edit-flag\" name=\"\"/>\n <span>请输入银行卡号码进行查询</span>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label>\n <span class=\"label\">付款单位/个人名称</span>\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\n </label>\n <input data-name=\"payerName\" ce-model=\"payerName\" type=\"text\" class=\"ipt-l required-basic edit-flag\" name=\"\"/>\n </div>\n </div>\n </div>\n <!--<div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n\n <div class=\"field\">\n <label>\n <span class=\"label\">合同章名称</span>\n <span class=\"red\">*</span>\n </label>\n <input data-name=\"sealName\" type=\"text\" class=\"ipt-l\" name=\"\"/>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label>\n <span class=\"label\">合同照片</span>\n <span class=\"red\">*</span>\n </label>\n <input type=\"hidden\" data-name=\"contract\"/>\n <input data-name=\"contract_file\" type=\"file\" class=\"\" name=\"\" accept=\"image/gif,image/jpeg,image/png\"/>\n <span class=\"supporttype\">(支持png、jpg、gif)</span>\n </div>\n <div class=\"field\">\n <img class=\"product-image\" data-name=\"contract-image\" />\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n\n <div class=\"field\">\n <label>\n <span class=\"label\">合同副本照片</span>\n </label>\n <input type=\"hidden\" data-name=\"contractCopy\"/>\n <input data-name=\"contractCopy_file\" type=\"file\" class=\"\" name=\"\" accept=\"image/gif,image/jpeg,image/png\"/>\n <span class=\"supporttype\">(支持png、jpg、gif)</span>\n </div>\n <div class=\"field\">\n <img class=\"product-image\" data-name=\"contractCopy-image\" />\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n\n <div class=\"field\">\n <label>\n <span class=\"label\">门头照片</span>\n </label>\n <input type=\"hidden\" data-name=\"companyGatePicture\"/>\n <input data-name=\"companyGatePicture_file\" type=\"file\" class=\"\" name=\"\" accept=\"image/gif,image/jpeg,image/png\"/>\n <span class=\"supporttype\">(支持png、jpg、gif)</span>\n </div>\n <div class=\"field\">\n <img class=\"product-image\" data-name=\"companyGatePicture-image\" />\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n\n <div class=\"field\">\n <label>\n <span class=\"label\">门头照片关键词</span>\n </label>\n <input data-name=\"companyGateKeyword\" type=\"text\" class=\"ipt-l\" name=\"\"/>\n </div>\n </div>\n </div>\n <div class=\"field_row\">\n <div class=\"field_row_head\">\n </div>\n <div class=\"field_wrapper\">\n <div class=\"field\">\n <label>\n <span class=\"label\">门头照片备注</span>\n </label>\n <input data-name=\"companyGateRemark\" type=\"text\" class=\"ipt-l\" name=\"\"/>\n </div>\n </div>\n </div>-->\n </div>\n</div>";
});