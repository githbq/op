define(function(require, exports, module) {
    module.exports="<div >\r\n <div class=\"forminfo\">\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">合同号：</span>\r\n <span ce-model=\"contractNo\"></span>\r\n </label>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">合同总金额(元)：</span>\r\n <span ce-model=\"amount\"></span>\r\n </label>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">到款金额（财务确认到款)(元)：</span>\r\n <span ce-model=\"auditedAmount\"></span>\r\n </label>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">已收金额（财务审核中）(元):</span>\r\n <span ce-model=\"auditAmount\"></span>\r\n </label>\r\n </div>\r\n </div>\r\n </div>\r\n\t\t <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">代理商已收金额(元)：</span>\r\n <span ce-model=\"agentCurrPayAmount\" ></span>\r\n </label>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">未收金额：</span>\r\n <span ce-model=\"noChargeAmount\"></span>\r\n </label>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">当前状态：</span>\r\n <select ce-model=\"payStatus\" disabled=\"disabled\">\r\n <option value=\"1\">付清</option>\r\n <option value=\"2\">分期</option>\r\n <option value=\"3\">未付</option>\r\n </select>\r\n </label>\r\n </div>\r\n </div>\r\n </div>\r\n <br/>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">本次付费状态</span>\r\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\r\n </label>\r\n <select data-name=\"\" class=\"payStatus-select edit-flag \">\r\n <option value=\"1\">补齐尾款</option>\r\n <option value=\"2\">分期</option>\r\n </select>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"stage-box\" style=\"border:1px #ccc solid;display: none;\">\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label style=\"width:250px;\">\r\n <span class=\"label\">本期每项应用金额（元）</span>\r\n </label>\r\n </div>\r\n </div>\r\n <div class=\"app-box\">\r\n\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">本次到款金额(元)</span>\r\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\r\n </label>\r\n <input data-name=\"currPayAmount\" ce-model=\"currPayAmount\" data-type=\"number\" type=\"text\" class=\"\" name=\"\" disabled=\"disabled\"/>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">打款日期</span>\r\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\r\n </label>\r\n <input data-name=\"payDate\" ce-model=\"payDate\" type=\"text\" class=\"required-basic payDate edit-flag\" name=\"\"/>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">收款账户</span>\r\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\r\n </label>\r\n <input data-name=\"receiptsAccount\" ce-model=\"receiptsAccount\" type=\"text\" class=\"ipt-l bankno required-basic edit-flag\" name=\"\"/>\r\n <span>请输入银行卡号码进行查询</span>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">付款单位/个人名称</span>\r\n <b class=\"check-edit\" style=\"color: #ff0000\">*</b>\r\n </label>\r\n <input data-name=\"payerName\" ce-model=\"payerName\" type=\"text\" class=\"ipt-l required-basic edit-flag\" name=\"\"/>\r\n </div>\r\n </div>\r\n </div>\r\n <!--<div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">合同章名称</span>\r\n <span class=\"red\">*</span>\r\n </label>\r\n <input data-name=\"sealName\" type=\"text\" class=\"ipt-l\" name=\"\"/>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">合同照片</span>\r\n <span class=\"red\">*</span>\r\n </label>\r\n <input type=\"hidden\" data-name=\"contract\"/>\r\n <input data-name=\"contract_file\" type=\"file\" class=\"\" name=\"\" accept=\"image/gif,image/jpeg,image/png\"/>\r\n <span class=\"supporttype\">(支持png、jpg、gif)</span>\r\n </div>\r\n <div class=\"field\">\r\n <img class=\"product-image\" data-name=\"contract-image\" />\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">合同副本照片</span>\r\n </label>\r\n <input type=\"hidden\" data-name=\"contractCopy\"/>\r\n <input data-name=\"contractCopy_file\" type=\"file\" class=\"\" name=\"\" accept=\"image/gif,image/jpeg,image/png\"/>\r\n <span class=\"supporttype\">(支持png、jpg、gif)</span>\r\n </div>\r\n <div class=\"field\">\r\n <img class=\"product-image\" data-name=\"contractCopy-image\" />\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">门头照片</span>\r\n </label>\r\n <input type=\"hidden\" data-name=\"companyGatePicture\"/>\r\n <input data-name=\"companyGatePicture_file\" type=\"file\" class=\"\" name=\"\" accept=\"image/gif,image/jpeg,image/png\"/>\r\n <span class=\"supporttype\">(支持png、jpg、gif)</span>\r\n </div>\r\n <div class=\"field\">\r\n <img class=\"product-image\" data-name=\"companyGatePicture-image\" />\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">门头照片关键词</span>\r\n </label>\r\n <input data-name=\"companyGateKeyword\" type=\"text\" class=\"ipt-l\" name=\"\"/>\r\n </div>\r\n </div>\r\n </div>\r\n <div class=\"field_row\">\r\n <div class=\"field_row_head\">\r\n </div>\r\n <div class=\"field_wrapper\">\r\n <div class=\"field\">\r\n <label>\r\n <span class=\"label\">门头照片备注</span>\r\n </label>\r\n <input data-name=\"companyGateRemark\" type=\"text\" class=\"ipt-l\" name=\"\"/>\r\n </div>\r\n </div>\r\n </div>-->\r\n </div>\r\n</div>";
});