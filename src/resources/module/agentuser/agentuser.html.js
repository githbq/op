define(function(require, exports, module) {
<<<<<<< HEAD
    module.exports="<div class=\"m-userinfo\">\r\n\t<div class=\"userinfo-content\">\r\n\t\t<div class=\"Reaseon-info\" style=\"display:none;\">\r\n\t\t\t<h4>驳回原因：</h4>\r\n\t\t\t<P class=\"rejectReaseon\" style=\"color:#ff0000; padding-left:15px;\"></P>\r\n\t\t</div>\r\n\t\t<h4>基本信息</h4>\r\n\r\n\t\t<p> <label><span>登录账号<b class=\"i-important\">*</b> </span> <input type=\"text\" disabled ce-model=\"username\" class=\"info-username\"></label> </p>\r\n\t\t<p> <label><span>角 色 <b class=\"i-important\">*</b> </span> \r\n\t\t\t<select ce-model=\"role\" class=\"roleselect\"> \r\n\t\t\t\t<option value=\"0\" selected=\"selected\">销售用户</option>\r\n\t\t\t\t<!--<option value=\"1\">增值用户</option>--> \r\n\t\t\t\t<option value=\"2\" class=\"state superselect\">代理商内部管理员</option> \r\n\t\t\t</select> </label> \r\n\t\t</p>\r\n\t\t<p> <label><span>姓 名 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"name\"></label> </p>\r\n\t\t<p> <label><span>身份证号<b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"idcard\"></label> </p>\r\n\t\t<p> <label><span>入职日期<b class=\"i-important\">*</b></span> <input type=\"text\" class=\"intime\"></label> </p>\r\n\t\t<p> <label><span>职 位 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"post\"></label> </p>\r\n\t\t<p> <label><span>训练营 </span> <input type=\"text\" ce-model=\"camp\"></label> </p>\r\n\t\t<h4>联系信息</h4>\r\n\t\t<p> <label><span>工作邮箱 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"email\"></label></p>\r\n\t\t<p> <label><span>手 机 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"mobile\"></label></p>\r\n\t\t<p> <label><span>办公电话</span> <input type=\"text\" ce-model=\"phone\"></label></p>\r\n\t\t\r\n\t\t<p class=\"state state-agenteditactive state-agenteditdeactive state-channel state-channeldetect state-detail state-editself\"> \r\n\t\t\t<label>\r\n\t\t\t\t<span>身份证正面照片</span> \r\n\t\t\t\t<a class=\"frontImga\" href=\"\" target=\"_blank\"><img src=\"\" id=\"frontImgInfo\"></a>\r\n\t\t\t\t<a class=\"frontImgnone\">未上传</a>\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p class=\"state state-agentadd state-agenteditactive state-agenteditdeactive state-editself\">\r\n\t\t\t<label> \r\n\t\t\t\t<span>上传身份证正面照片 <b class=\"i-important\">*</b></span> \r\n\t\t\t\t<input type=\"file\" id=\"frontImg\">\r\n\t\t\t</label> \r\n\t\t</p>\r\n\t\t<p class=\"state state-agenteditactive state-agenteditdeactive state-channel state-channeldetect state-detail state-editself\"> \r\n\t\t\t<label>\r\n\t\t\t\t<span>身份证反面照片</span> \r\n\t\t\t\t<a class=\"backImga\" href=\"\" target=\"_blank\"><img src=\"\" id=\"backImgInfo\"></a>\r\n\t\t\t\t<a class=\"backImgnone\">未上传</a>\r\n\t\t\t</label>\r\n\t\t</p>\r\n\t\t<p class=\"state state-agentadd state-agenteditactive state-agenteditdeactive state-editself\">\r\n\t\t\t<label> \r\n\t\t\t\t<span>上传身份证反面照片 <b class=\"i-important\">*</b></span> \r\n\t\t\t\t<input type=\"file\" id=\"backImg\">\r\n\t\t\t</label> \r\n\t\t</p>\r\n\t\t<p class=\"state content-active\" style=\"display:none;\"> \r\n\t\t\t<label><span>启 用</span> <input type=\"checkbox\" ce-model=\"active\"></label>\r\n\t\t</p>\r\n\t\t<p class=\"state state-channel\"> \r\n\t\t\t<label>\r\n\t\t\t\t<span>备案企业数量限制</span> \r\n\t\t\t\t<input type=\"text\" class=\"state-channel\" ce-model=\"enterpriseFilingCount\" maxlength=8>\r\n\t\t\t</label>\r\n\t\t</p>\r\n\r\n\t</div>\r\n\t<div class=\"userinfo-action\">\r\n\r\n\t\t<div style=\"margin:5px;\" class=\"state state-channeldetect\">\r\n\t\t\t<label for=\"\">\r\n\t\t\t\t<span>审批意见</span>\r\n\t\t\t</label>\r\n\t\t\t\t<textarea name=\"\" ce-model=\"rejectReaseon\" style=\"width:382px;\"></textarea>\r\n\t\t\t\r\n </div>\r\n\t\t<!--<button class=\"user-reset\">重置</button>-->\r\n\t\t<!--新增-->\r\n\t\t<button class=\"user-sure btn-blue state state-agentadd\">提交</button>\r\n\t\t<!--修改-->\r\n\t\t<button class=\"user-editactive btn-blue state state-agenteditactive state-agenteditdeactive state-editself\">确定修改</button>\r\n\t\t<!--<button class=\"user-editdeactive btn-blue state state-agenteditdeactive state-editself\">申请启用</button>-->\r\n\t\t<!--渠道修改备案企业数量-->\r\n\t\t<button class=\"user-change btn-blue state state-channel\" data-permissions=\"F010008 F011008\">修改</button>\r\n\t\t\r\n\t\t<button class=\"u-btn-blue state state-channeldetect detect-agree\">审核通过</button>\r\n\t\t<button class=\"u-btn-red state state-channeldetect detect-abort\">驳回</button>\r\n\t\t<button class=\"user-cancel\">取消</button>\r\n\t</div>\r\n</div>\r\n\r\n";
=======
    module.exports="<div class=\"m-userinfo\">\n\t<div class=\"userinfo-content\">\n\t\t<div class=\"Reaseon-info\" style=\"display:none;\">\n\t\t\t<h4>驳回原因：</h4>\n\t\t\t<P class=\"rejectReaseon\" style=\"color:#ff0000; padding-left:15px;\"></P>\n\t\t</div>\n\t\t<h4>基本信息</h4>\n\n\t\t<p> <label><span>登录账号<b class=\"i-important\">*</b> </span> <input type=\"text\" disabled ce-model=\"username\" class=\"info-username\"></label> </p>\n\t\t<p> <label><span>角 色 <b class=\"i-important\">*</b> </span> \n\t\t\t<select ce-model=\"role\" class=\"roleselect\"> \n\t\t\t\t<option value=\"0\" selected=\"selected\">销售用户</option>\n\t\t\t\t<!--<option value=\"1\">增值用户</option>--> \n\t\t\t\t<option value=\"2\" class=\"state superselect\">代理商内部管理员</option> \n\t\t\t</select> </label> \n\t\t</p>\n\t\t<p> <label><span>姓 名 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"name\"></label> </p>\n\t\t<p> <label><span>身份证号<b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"idcard\"></label> </p>\n\t\t<p> <label><span>入职日期<b class=\"i-important\">*</b></span> <input type=\"text\" class=\"intime\"></label> </p>\n\t\t<p> <label><span>职 位 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"post\"></label> </p>\n\t\t<p> <label><span>训练营 </span> <input type=\"text\" ce-model=\"camp\"></label> </p>\n\t\t<h4>联系信息</h4>\n\t\t<p> <label><span>工作邮箱 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"email\"></label></p>\n\t\t<p> <label><span>手 机 <b class=\"i-important\">*</b></span> <input type=\"text\" ce-model=\"mobile\"></label></p>\n\t\t<p> <label><span>办公电话</span> <input type=\"text\" ce-model=\"phone\"></label></p>\n\t\t\n\t\t<p class=\"state state-agenteditactive state-agenteditdeactive state-channel state-channeldetect state-detail state-editself\"> \n\t\t\t<label>\n\t\t\t\t<span>身份证正面照片</span> \n\t\t\t\t<a class=\"frontImga\" href=\"\" target=\"_blank\"><img src=\"\" id=\"frontImgInfo\"></a>\n\t\t\t\t<a class=\"frontImgnone\">未上传</a>\n\t\t\t</label>\n\t\t</p>\n\t\t<p class=\"state state-agentadd state-agenteditactive state-agenteditdeactive state-editself\">\n\t\t\t<label> \n\t\t\t\t<span>上传身份证正面照片 <b class=\"i-important\">*</b></span> \n\t\t\t\t<input type=\"file\" id=\"frontImg\">\n\t\t\t</label> \n\t\t</p>\n\t\t<p class=\"state state-agenteditactive state-agenteditdeactive state-channel state-channeldetect state-detail state-editself\"> \n\t\t\t<label>\n\t\t\t\t<span>身份证反面照片</span> \n\t\t\t\t<a class=\"backImga\" href=\"\" target=\"_blank\"><img src=\"\" id=\"backImgInfo\"></a>\n\t\t\t\t<a class=\"backImgnone\">未上传</a>\n\t\t\t</label>\n\t\t</p>\n\t\t<p class=\"state state-agentadd state-agenteditactive state-agenteditdeactive state-editself\">\n\t\t\t<label> \n\t\t\t\t<span>上传身份证反面照片 <b class=\"i-important\">*</b></span> \n\t\t\t\t<input type=\"file\" id=\"backImg\">\n\t\t\t</label> \n\t\t</p>\n\t\t<p class=\"state content-active\" style=\"display:none;\"> \n\t\t\t<label><span>启 用</span> <input type=\"checkbox\" ce-model=\"active\"></label>\n\t\t</p>\n\t\t<p class=\"state state-channel\"> \n\t\t\t<label>\n\t\t\t\t<span>备案企业数量限制</span> \n\t\t\t\t<input type=\"text\" class=\"state-channel\" ce-model=\"enterpriseFilingCount\" maxlength=8>\n\t\t\t</label>\n\t\t</p>\n\n\t</div>\n\t<div class=\"userinfo-action\">\n\n\t\t<div style=\"margin:5px;\" class=\"state state-channeldetect\">\n\t\t\t<label for=\"\">\n\t\t\t\t<span>审批意见</span>\n\t\t\t</label>\n\t\t\t\t<textarea name=\"\" ce-model=\"rejectReaseon\" style=\"width:382px;\"></textarea>\n\t\t\t\n </div>\n\t\t<!--<button class=\"user-reset\">重置</button>-->\n\t\t<!--新增-->\n\t\t<button class=\"user-sure btn-blue state state-agentadd\">提交</button>\n\t\t<!--修改-->\n\t\t<button class=\"user-editactive btn-blue state state-agenteditactive state-agenteditdeactive state-editself\">确定修改</button>\n\t\t<!--<button class=\"user-editdeactive btn-blue state state-agenteditdeactive state-editself\">申请启用</button>-->\n\t\t<!--渠道修改备案企业数量-->\n\t\t<button class=\"user-change btn-blue state state-channel\" data-permissions=\"F010008 F011008\">修改</button>\n\t\t\n\t\t<button class=\"u-btn-blue state state-channeldetect detect-agree\">审核通过</button>\n\t\t<button class=\"u-btn-red state state-channeldetect detect-abort\">驳回</button>\n\t\t<button class=\"user-cancel\">取消</button>\n\t</div>\n</div>\n\n";
>>>>>>> 37ae7d84528f89f6a5724e2a8e383ff4007c5630
});