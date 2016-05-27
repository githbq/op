define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<div class=\"m-invoicedetail-wrapper\">\r\n <form class=\"m-invoiceapplydetail\">\r\n <h4>订单信息</h4>\r\n <section>\r\n <p>\r\n <span class=\"title\">订单号:</span>\r\n <span data-name=\"orderId\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">企业账号:</span>\r\n <span data-name=\"enterpriseAccount\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">企业名称:</span>\r\n <span data-name=\"enterpriseName\"></span>\r\n </p>\r\n </section>\r\n <h4>合同信息</h4>\r\n <section>\r\n <p>\r\n <span class=\"title\">合同号:</span>\r\n <span data-name=\"contractNo\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同总金额:</span>\r\n <span data-name=\"contractAmount\"></span>元\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同图片:</span>\r\n <a href=\"#\" data-name=\"contract-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"contract\">\r\n </a>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同副本照片:</span>\r\n <a href=\"#\" data-name=\"contractCopy-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"contractCopy\">\r\n </a>\r\n </p>\r\n \r\n <p>\r\n <span class=\"title\">付款单位/个人名称:</span>\r\n <span data-name=\"payerName\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同章名称:</span>\r\n <span data-name=\"sealName\"></span>\r\n </p>\r\n </section>\r\n <h4>付款信息</h4>\r\n <section>\r\n <p>\r\n <span class=\"title\">当前付费状态:</span>\r\n <span data-name=\"payStatus\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">到款金额(财务确认到款):</span>\r\n <span data-name=\"auditedAmount\"></span>元\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">已收金额(财务审核中):</span>\r\n <span data-name=\"auditAmount\"></span>元\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">打款日期:</span>\r\n <span datecontrol data-name=\"payDate\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">收款账户:</span>\r\n <span data-name=\"receiptsAccount\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">实际到款日期:</span>\r\n <span data-name=\"receivedPayDate\" datecontrol></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">付款单位/个人名称:</span>\r\n <span data-name=\"payerName\"></span>\r\n </p>\r\n </section>\r\n <h4>发票信息</h4>\r\n <section data-name=\"invoiceType-1\" data-config=\"{'visible':false}\">\r\n <p>\r\n <span class=\"title\">发票抬头:</span>\r\n <span data-name=\"invoiceHead\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票类型:</span>\r\n <span data-name=\"invoiceType\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票金额:</span>\r\n <span data-name=\"amount\"></span>元\r\n </p>\r\n <p class=\"field\">\r\n <span class=\"title\">审批链接:</span>\r\n <a data-name=\"approvalUrl\" target=\"blank\"></a>\r\n </p>\r\n <p>\r\n <span class=\"title\">发票性质:</span>\r\n <span data-name=\"invoiceProp\"></span>\r\n </p>\r\n </section>\r\n <section data-name=\"invoiceType-2\" data-config=\"{'visible':false}\">\r\n <p>\r\n <span class=\"title\">税务登记证正本/副本或三证合一的营业执照:</span>\r\n <a href=\"#\" data-name=\"businessLicense-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"businessLicense\">\r\n </a>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">一般纳税人资质证书(或认定通知):</span>\r\n <a href=\"#\" data-name=\"taxpayerQualification-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"taxpayerQualification\">\r\n </a>\r\n </p>\r\n\r\n <p class=\"field\">\r\n <span class=\"title\">加盖财务章的开票信息 :</span>\r\n <a href=\"#\" data-name=\"stampimage-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"stampimage\">\r\n </a>\r\n </p>\r\n \r\n <p>\r\n <span class=\"title\">发票抬头:</span>\r\n <span data-name=\"invoiceHead\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票金额:</span>\r\n <span data-name=\"amount\"></span>元\r\n </p>\r\n\r\n <p class=\"field\">\r\n <span class=\"title\">审批链接:</span>\r\n <a data-name=\"approvalUrl\" target=\"blank\"></a>\r\n </p>\r\n <!--<p>-->\r\n <!--<span class=\"title\">公司名称</span>-->\r\n <!--<span data-name=\"invoiceCompany\"></span>-->\r\n <!--</p>-->\r\n\r\n <p>\r\n <span class=\"title\">纳税人识别号:</span>\r\n <span data-name=\"taxpayerIdentificationNo\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">开户行:</span>\r\n <span data-name=\"bankName\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">账号:</span>\r\n <span data-name=\"bankAccount\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票类型:</span>\r\n <span data-name=\"invoiceType\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票性质:</span>\r\n <span data-name=\"invoiceProp\"></span>\r\n </p>\r\n <p class=\"field\">\r\n <span class=\"title\">发票地址:</span>\r\n <span data-name=\"address\"></span>\r\n </p>\r\n <p class=\"field\">\r\n <span class=\"title\">发票电话:</span>\r\n <span data-name=\"phone\"></span>\r\n </p>\r\n </section>\r\n\r\n <h4>开具发票信息</h4>\r\n <section data-name=\"kaiju\">\r\n <p>\r\n <span class=\"title\">发票状态:</span>\r\n <select data-name=\"invoiceStatus\">\r\n <option value=\"1\">已开</option>\r\n <option value=\"2\">红字</option>\r\n <option value=\"3\">作废</option>\r\n </select>\r\n </p>\r\n <p>\r\n <span class=\"title\">开票日期:</span>\r\n <input type=\"text\" datecontrol data-name=\"invoiceDate\">\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票号码:</span>\r\n <input type=\"text\" data-name=\"invoiceNo\" maxlength=\"50\">\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">开具公司:</span>\r\n <select data-name=\"invoiceCompany\">\r\n <option value=\"1\">纷扬</option>\r\n <option value=\"2\">纷享</option>\r\n </select>\r\n </p>\r\n <p class=\"field\" style=\"border-top:1px solid black;padding-top:5px;margin-top:5px;\">\r\n <span class=\"title\">审批意见:</span>\r\n <textarea data-name=\"comment\" maxlength=\"50\"></textarea>\r\n </p>\r\n\r\n <p class=\"field\">\r\n <button class=\"btn-blue\" data-name=\"save\">保存</button>\r\n <button class=\"\" data-name=\"cancel\">取消</button>\r\n </p>\r\n <p class=\"field\">\r\n <button class=\"btn-blue\" data-name=\"agree\">同意</button>\r\n <button class=\"\" data-name=\"refuse\">驳回</button>\r\n </p>\r\n </section>\r\n <section data-name=\"commentWrapper\" data-config=\"{'visible':true}\">\r\n <h4>审批意见</h4>\r\n <table class=\"approval-table\">\r\n <thead>\r\n <th style=\"width:100px;\">操作人</th>\r\n <th style=\"width:130px;\">审批时间</th>\r\n <th style=\"width:100px;\">审批结果</th>\r\n <th style=\"width:180px;\">审批意见</th>\r\n <th></th>\r\n </thead>\r\n <tbody data-name=\"rejectReason\">\r\n\r\n </tbody>\r\n </table>\r\n </p>\r\n </section>\r\n </form>\r\n</div>\r\n";
=======
    module.exports="<div class=\"m-invoicedetail-wrapper\">\r\n <form class=\"m-invoiceapplydetail\">\r\n <h4>订单信息</h4>\r\n <section>\r\n <p>\r\n <span class=\"title\">订单号:</span>\r\n <span data-name=\"orderId\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">企业账号:</span>\r\n <span data-name=\"enterpriseAccount\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">企业名称:</span>\r\n <span data-name=\"enterpriseName\"></span>\r\n </p>\r\n </section>\r\n <h4>合同信息</h4>\r\n <section>\r\n <p>\r\n <span class=\"title\">合同号:</span>\r\n <span data-name=\"contractNo\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同总金额:</span>\r\n <span data-name=\"contractAmount\"></span>元\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同图片:</span>\r\n <a href=\"#\" data-name=\"contract-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"contract\">\r\n </a>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同副本照片:</span>\r\n <a href=\"#\" data-name=\"contractCopy-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"contractCopy\">\r\n </a>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">付款单位/个人名称:</span>\r\n <span data-name=\"payerName\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">合同章名称:</span>\r\n <span data-name=\"sealName\"></span>\r\n </p>\r\n </section>\r\n <h4>付款信息</h4>\r\n <section>\r\n <p>\r\n <span class=\"title\">当前付费状态:</span>\r\n <span data-name=\"payStatus\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">到款金额(财务确认到款):</span>\r\n <span data-name=\"auditedAmount\"></span>元\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">已收金额(财务审核中):</span>\r\n <span data-name=\"auditAmount\"></span>元\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">打款日期:</span>\r\n <span datecontrol data-name=\"payDate\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">收款账户:</span>\r\n <span data-name=\"receiptsAccount\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">实际到款日期:</span>\r\n <span data-name=\"receivedPayDate\" datecontrol></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">付款单位/个人名称:</span>\r\n <span data-name=\"payerName\"></span>\r\n </p>\r\n </section>\r\n <h4>发票信息</h4>\r\n <section data-name=\"invoiceType-1\" data-config=\"{'visible':false}\">\r\n <p>\r\n <span class=\"title\">发票抬头:</span>\r\n <span data-name=\"invoiceHead\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票类型:</span>\r\n <span data-name=\"invoiceType\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票金额:</span>\r\n <span data-name=\"amount\"></span>元\r\n </p>\r\n <p class=\"field\">\r\n <span class=\"title\">审批链接:</span>\r\n <a data-name=\"approvalUrl\" target=\"blank\"></a>\r\n </p>\r\n <p>\r\n <span class=\"title\">发票性质:</span>\r\n <span data-name=\"invoiceProp\"></span>\r\n </p>\r\n </section>\r\n <section data-name=\"invoiceType-2\" data-config=\"{'visible':false}\">\r\n <p>\r\n <span class=\"title\">税务登记证正本/副本或三证合一的营业执照:</span>\r\n <a href=\"#\" data-name=\"businessLicense-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"businessLicense\">\r\n </a>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">一般纳税人资质证书(或认定通知):</span>\r\n <a href=\"#\" data-name=\"taxpayerQualification-a\" target=\"_blank\">\r\n <img src=\"\" alt=\"\" data-name=\"taxpayerQualification\">\r\n </a>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票抬头:</span>\r\n <span data-name=\"invoiceHead\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票金额:</span>\r\n <span data-name=\"amount\"></span>元\r\n </p>\r\n\r\n <p class=\"field\">\r\n <span class=\"title\">审批链接:</span>\r\n <a data-name=\"approvalUrl\" target=\"blank\"></a>\r\n </p>\r\n <!--<p>-->\r\n <!--<span class=\"title\">公司名称</span>-->\r\n <!--<span data-name=\"invoiceCompany\"></span>-->\r\n <!--</p>-->\r\n\r\n <p>\r\n <span class=\"title\">纳税人识别号:</span>\r\n <span data-name=\"taxpayerIdentificationNo\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">开户行:</span>\r\n <span data-name=\"bankName\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">账号:</span>\r\n <span data-name=\"bankAccount\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票类型:</span>\r\n <span data-name=\"invoiceType\"></span>\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票性质:</span>\r\n <span data-name=\"invoiceProp\"></span>\r\n </p>\r\n </section>\r\n\r\n <h4>开具发票信息</h4>\r\n <section data-name=\"kaiju\">\r\n <p>\r\n <span class=\"title\">发票状态:</span>\r\n <select data-name=\"invoiceStatus\">\r\n <option value=\"0\">未开</option>\r\n <option value=\"1\">已开</option>\r\n </select>\r\n </p>\r\n <p>\r\n <span class=\"title\">开票日期:</span>\r\n <input type=\"text\" datecontrol data-name=\"invoiceDate\">\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">发票号码:</span>\r\n <input type=\"text\" data-name=\"invoiceNo\" maxlength=\"50\">\r\n </p>\r\n\r\n <p>\r\n <span class=\"title\">开具公司:</span>\r\n <select data-name=\"invoiceCompany\">\r\n <option value=\"1\">纷扬</option>\r\n <option value=\"2\">纷享</option>\r\n </select>\r\n </p>\r\n <p class=\"field\" style=\"border-top:1px solid black;padding-top:5px;margin-top:5px;\">\r\n <span class=\"title\">审批意见:</span>\r\n <textarea data-name=\"comment\" maxlength=\"50\"></textarea>\r\n </p>\r\n\r\n <p class=\"field\">\r\n <button class=\"btn-blue\" data-name=\"save\">保存</button>\r\n <button class=\"\" data-name=\"cancel\">取消</button>\r\n </p>\r\n <p class=\"field\">\r\n <button class=\"btn-blue\" data-name=\"agree\">同意</button>\r\n <button class=\"\" data-name=\"refuse\">驳回</button>\r\n </p>\r\n </section>\r\n <section data-name=\"commentWrapper\" data-config=\"{'visible':true}\">\r\n <h4>审批意见</h4>\r\n <table class=\"approval-table\">\r\n <thead>\r\n <th style=\"width:100px;\">操作人</th>\r\n <th style=\"width:130px;\">审批时间</th>\r\n <th style=\"width:100px;\">审批结果</th>\r\n <th style=\"width:180px;\">审批意见</th>\r\n <th></th>\r\n </thead>\r\n <tbody data-name=\"rejectReason\">\r\n\r\n </tbody>\r\n </table>\r\n </p>\r\n </section>\r\n </form>\r\n</div>\r\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});