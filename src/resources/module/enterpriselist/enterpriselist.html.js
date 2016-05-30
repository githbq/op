define(function(require, exports, module) {
    module.exports="<div class=\"m-list m-ent-lst u-tablelist\">\n <div class=\"list-main\">\n <div class=\"list-header\">\n <div class=\"header-opts\">\n\n <button class=\"u-btn-blue auth\">授权</button>\n <button class=\"deauth\">取消授权</button>\n <button class=\"export-file\">导出企业试用应用列表</button>\n </div>\n <h3>\n 企业列表\n </h3>\n </div>\n <div class=\"list-bar\">\n <div class=\"list-bar-btns\">\n <button id=\"btnSearch\" class=\"btn-blue\">查询</button>\n </div>\n <div class=\"list-bar-input\">\n <label>\n <span>企业名称</span>\n <input id=\"eiName\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"en\"/>\n </label>\n <label>\n <span>企业帐号</span>\n <input id=\"eiAccount\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"ea\"/>\n </label>\n\t\t\t\t<label>\n\t\t\t\t\t<span>创建人姓名</span>\n\t\t\t\t\t<input id=\"creatorName\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"creatorName\" maxlength=20/>\n\t\t\t\t</label>\n <label>\n <span>开通时间</span>\n <input type=\"text\" id=\"OpenSTime\"> ---- <input type=\"text\" id=\"OpenETime\">\n </label>\n <label>\n <span>企业状态</span>\n <select ce-model=\"enterpriseStatus\">\n <option value=\"\">全部</option>\n <option value=\"1\">待开通</option>\n <option value=\"2\">已开通</option>\n <option value=\"3\">已作废</option>\n <option value=\"4\">已停用</option>\n <option value=\"5\">已删除</option>\n </select>\n </label>\n\t\t\t\t<label>\n\t\t\t\t\t<span>关联自注册</span>\n\t\t\t\t\t<select ce-model=\"isLinkRegister\">\n\t\t\t\t\t\t<option value=\"\">全部</option>\n\t\t\t\t\t\t<option value=\"1\">是</option>\n\t\t\t\t\t\t<option value=\"0\">否</option>\n\t\t\t\t\t</select>\n\t\t\t\t</label>\n <label>\n <span>来源</span>\n <select id=\"eiSource\" ce-model=\"source\">\n <option value=\"\">全部</option>\n </select>\n </label>\n <label>\n <span>行业</span>\n <select id=\"eiIndustry\" ce-model=\"industry\">\n <option value=\"\">全部</option>\n </select>\n </label>\n <label>\n <span>省市</span>\n <select id=\"eiProvince\" ce-model=\"province\">\n <option value=\"\">全部</option>\n </select>\n </label>\n <label>\n <span>城市</span>\n <input id=\"eiCity\" class=\"g-ipt ipt-s\" type=\"text\" ce-model=\"city\"/>\n </label>\n \n <label>\n <span>联系电话</span>\n <input id=\"eiMobile\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"tel\"/>\n </label>\n \n <!--新添筛选项-->\n <label>\n <span>应用类型</span>\n <select name=\"hasProduct\" ce-model=\"hasProduct\">\n <option value=\"\">全部</option>\n <!--<option value=\"\">CRM</option>-->\n\t\t\t\t\t\t<option value=\"1\">CRM</option>\n <option value=\"4\">pk助手</option>\n <option value=\"7\">工资助手</option>\n <option value=\"5\">会议助手</option>\n <option value=\"12\">自定义助手</option>\n <option value=\"3\">培训服务费</option>\n </select>\n </label>\n <label>\n <span>优惠码</span>\n <input type=\"text\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" maxlength=8 ce-model=\"vendorId\" >\n </label>\n <label>\n <span>是否赠送办公版</span>\n <select ce-model=\"isPresent\">\n <option value=\"\">全部</option>\n <option value=\"1\">是</option>\n <option value=\"0\">否</option>\n </select>\n </label>\n <label>\n <span>是否付费</span>\n <select ce-model=\"isPay\">\n <option value=\"\">全部</option>\n <option value=\"true\">是</option>\n <option value=\"false\">否</option>\n </select>\n </label>\n </div>\n </div>\n <div class=\"list-content\">\n <table>\n <thead>\n <tr>\n <th></th>\n <th style=\"width:20px;\"><input type=\"checkbox\" class=\"selectall\"></th>\n <th style=\"width:120px;\">企业名称</th>\n <th style=\"width:130px;\">帐号</th>\n\t\t\t\t\t<th style=\"width:130px;\">所属代理商</th>\n\t\t\t\t\t<th style=\"width:60px;\">是否付费</th>\n\t\t\t\t\t<th style=\"width:90px;\">关联自注册</th>\n\t\t\t\t\t<th style=\"width:130px;\">负责销售(创建人)</th>\n <th style=\"width:120px;\">开通日期</th>\n <th style=\"width:100px;\">企业状态</th>\n\t\t\t\t\t<th style=\"width:150px;\">CRM信息可见授权</th>\n <th style=\"width:110px;\">手机设备授权</th>\n <th style=\"\">操作</th>\n <th></th>\n </tr>\n </thead>\n <tbody ce-collection=\"list\">\n <td></td>\n <td><input type=\"checkbox\" class=\"selectitem\" value=\"<%=item.enterprise.enterpriseAccount%>\"></td>\n <td><%=item.enterprise.enterpriseName%></td>\n <td><%=item.enterprise.enterpriseAccount%></td>\n\t\t\t\t\t<td> <%=item.agent ? item.agent.name:''%> </td>\n\t\t\t\t\t<td> <%=item.enterprise.isPayed ? '是':'否'%></td>\n\t\t\t\t\t<td> <%=item.isLinkRegister ? '是':'否'%></td>\n\t\t\t\t\t<td> <%=item.creator ?item.creator.name:'否'%> </td>\n <td><%=item.createtimestr%></td>\n <td><%=item.runstatusstr%></td>\n <td><%=item.crmvisible%></td>\n <td><%=item.authStr%></td>\n <td data-status=\"<%=item.enterprise.runStatus%>\">\n <a class=\"info-detail\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\">查看</a>\n\n <% if(item.canIncrease){ %>\n <a class=\"info-zengbangong\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\">增购办公版</a>\n <a class=\"info-zengyingxiao\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\">增购营销版</a>\n <% } %>\n \n <% if(item.canRenew){ %>\n <a class=\"info-renewbangong\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\">续费办公版</a>\n <a class=\"info-renewyingxiao\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\">续费营销版</a>\n <% } %>\n\t\t\t\t\t\t<%if(item.canEditPartner == 1||item.canEditPartner == \"1\"){%>\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t<a class=\"info-custom\" data-enterpriseId=\"<%=item.enterprise.enterpriseID%>\">联合跟进人</a>&nbsp;&nbsp;\n\t\t\t\t\t\t<%}else{%>\n\t\t\t\t\t\t\t<a style=\"color:#ccc;\" >联合跟进人</a>&nbsp;&nbsp;\n\t\t\t\t\t\t<%}%>\n\t\t\t\t\t\t\n </td>\n <td></td>\n </tbody>\n </table>\n </div>\n </div>\n <div class=\"list-pager\">\n \n </div>\n</div>\n";
});