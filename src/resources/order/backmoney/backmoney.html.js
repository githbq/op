define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<div class=\"order-content\" js=\"true\" style=\"z-index:100\">\r\n\r\n\t<div class=\"content-box\" style=\"clear:both;\">\r\n\t\t<div class=\"m-addenterprise \" style=\"width:1200px;\">\r\n\t\t\t<h4 style=\"font-weight: bold; font-size: 18px; padding-top: 8px; padding-bottom: 8px;\">企业信息</h4>\r\n\t\t\t<p style=\"line-height:40px;\">订单号： <span class=\"order-id\"></span></p>\r\n\t\t\t<div class=\"common--basic\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div class=\"common-product productinfo\"></div>\r\n\t\t\t<div class=\"common--invioce productinfo\"></div>\r\n\t\t\t<div class=\"common--meoney productinfo\"></div>\r\n\t\t</div>\r\n\t\t<div class=\"state-process\" >\r\n\t\t\t<hr/>\r\n\t\t\t<p class=\"receivedPayDate\" style=\"display: none;\">\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>实际退款时间 :</span>\r\n\t\t\t\t\t<span class=\"receivedPayDate-text\"></span>\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<h4 style=\"font-weight: bold; font-size: 18px; padding-top: 8px; padding-bottom: 8px;\">审批意见</h4>\r\n\t\t\t<table >\r\n\t\t\t<tr><th>审批人</th><th>审批时间</th><th>审批结果</th><th>审批意见</th></tr>\r\n\t\t\t<tbody class=\"last-options\">\r\n\t\t\t \r\n\t\t\t</tbody>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t<div class=\"state state-refuse \">\r\n\t\t\t<hr/>\r\n\t\t\t<p class=\"approval-action\">\r\n\t\t\t\t<button class=\" u-btn-blue action-submit\">保存提交</button>\r\n\t\t\t\t<button class=\" u-btn-blue action-save\">保存</button>\r\n\t\t\t</p>\r\n\t\t</div>\r\n\t\t<div class=\"state state-newFirst \">\r\n\t\t\t\r\n\t\t\t<button class=\"common-add btn-blue\">提交</button>\r\n\t\t\t<button class=\"action-cancel\">取消</button>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"approval-action state state-wait\">\r\n\t\t\t<hr/>\r\n\t\t\t<p class=\"currentTask-finance\" style=\"display: none;\">\r\n\t\t\t\t<label for=\"\">\r\n\t\t\t\t\t<span>实际退款时间 </span>\r\n\t\t\t\t\t<input type=\"text\" class=\"money-time\">\r\n\t\t\t\t</label>\r\n\t\t\t</p>\r\n\t\t\t<p>\r\n\t\t\t<h3 style=\"font-size:18px;\">审批意见</h3>\r\n\t\t\t<textarea ce-model=\"comment\" cols=\"60\" rows=\"5\" maxlength=100 style=\" margin:10px;esize: none;word-wrap: break-word;outline: none; border: 1px solid #d9d9d9;-webkit-border-radius: 3px; -moz-border-radius: 3px;border-radius: 3px;\"></textarea>\r\n\t\t\t</p>\r\n\t\t\t<p class=\"actions\">\r\n\t\t\t\t<button class=\"u-btn-blue action-agree\"> 同意 </button>\r\n\t\t\t\t<button class=\"u-btn-red action-reject\"> 驳回 </button>\r\n\t\t\t</p>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>";
=======
    module.exports="<div class=\"order-content\" js=\"true\" style=\"z-index:100\">\n\n\t<div class=\"content-box\" style=\"clear:both;\">\n\t\t<div class=\"m-addenterprise \" style=\"width:1200px;\">\n\t\t\t<h4 style=\"font-weight: bold; font-size: 18px; padding-top: 8px; padding-bottom: 8px;\">企业信息</h4>\n\t\t\t<p style=\"line-height:40px;\">订单号： <span class=\"order-id\"></span></p>\n\t\t\t<div class=\"common--basic\"></div>\n\t\t\t<hr/>\n\t\t\t<div class=\"common-product productinfo\"></div>\n\t\t\t<div class=\"common--invioce productinfo\"></div>\n\t\t\t<div class=\"common--meoney productinfo\"></div>\n\t\t</div>\n\t\t<div class=\"state-process\" >\n\t\t\t<hr/>\n\t\t\t<p class=\"receivedPayDate\" style=\"display: none;\">\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>实际退款时间 :</span>\n\t\t\t\t\t<span class=\"receivedPayDate-text\"></span>\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<h4 style=\"font-weight: bold; font-size: 18px; padding-top: 8px; padding-bottom: 8px;\">审批意见</h4>\n\t\t\t<table >\n\t\t\t<tr><th>审批人</th><th>审批时间</th><th>审批结果</th><th>审批意见</th></tr>\n\t\t\t<tbody class=\"last-options\">\n\t\t\t \n\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\t\t<div class=\"state state-refuse \">\n\t\t\t<hr/>\n\t\t\t<p class=\"approval-action\">\n\t\t\t\t<button class=\" u-btn-blue action-submit\">保存提交</button>\n\t\t\t\t<button class=\" u-btn-blue action-save\">保存</button>\n\t\t\t</p>\n\t\t</div>\n\t\t<div class=\"state state-newFirst \">\n\t\t\t\n\t\t\t<button class=\"common-add btn-blue\">提交</button>\n\t\t\t<button class=\"action-cancel\">取消</button>\n\t\t</div>\n\n\t\t<div class=\"approval-action state state-wait\">\n\t\t\t<hr/>\n\t\t\t<p class=\"currentTask-finance\" style=\"display: none;\">\n\t\t\t\t<label for=\"\">\n\t\t\t\t\t<span>实际退款时间 </span>\n\t\t\t\t\t<input type=\"text\" class=\"money-time\">\n\t\t\t\t</label>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t<h3 style=\"font-size:18px;\">审批意见</h3>\n\t\t\t<textarea ce-model=\"comment\" cols=\"60\" rows=\"5\" maxlength=100 style=\" margin:10px;esize: none;word-wrap: break-word;outline: none; border: 1px solid #d9d9d9;-webkit-border-radius: 3px; -moz-border-radius: 3px;border-radius: 3px;\"></textarea>\n\t\t\t</p>\n\t\t\t<p class=\"actions\">\n\t\t\t\t<button class=\"u-btn-blue action-agree\"> 同意 </button>\n\t\t\t\t<button class=\"u-btn-red action-reject\"> 驳回 </button>\n\t\t\t</p>\n\t\t</div>\n\t</div>\n\n</div>";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});