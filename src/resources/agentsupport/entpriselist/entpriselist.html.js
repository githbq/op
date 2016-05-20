define(function(require, exports, module) {
    module.exports="<div class=\"p-vendorEntList p-list\" js=\"true\">\r\n <div class=\"m-list m-ent-lst u-tablelist\">\r\n <div class=\"list-main\">\r\n <div class=\"list-header\">\r\n <h3>\r\n 企业列表\r\n </h3>\r\n </div>\r\n <div class=\"list-bar\">\r\n <div class=\"list-bar-btns\">\r\n <button id=\"btnSearch\" class=\"btn-blue\">查询</button>\r\n </div>\r\n <div class=\"list-bar-input\">\r\n <label>\r\n <span>企业名称</span>\r\n <input id=\"eiName\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"en\"/>\r\n </label>\r\n <label>\r\n <span>企业帐号</span>\r\n <input id=\"eiAccount\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"ea\" onchange=\"this.value=this.value.replace(/(^\\s*)|(\\s*$)/g,'').toLowerCase( )\"/>\r\n </label>\r\n\t\t\t\t\t<label>\r\n <span>创建人姓名</span>\r\n <input id=\"creatorName\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"creatorName\" maxlength=20/>\r\n </label>\r\n <label>\r\n <span>开通时间</span>\r\n <input type=\"text\" id=\"OpenSTime\"> ---- <input type=\"text\" id=\"OpenETime\">\r\n </label>\r\n <label>\r\n <span>企业状态</span>\r\n <select ce-model=\"enterpriseStatus\">\r\n <option value=\"\">全部</option>\r\n <option value=\"1\">待开通</option>\r\n <option value=\"2\">已开通</option>\r\n <option value=\"3\">已作废</option>\r\n <option value=\"4\">已停用</option>\r\n <option value=\"5\">已删除</option>\r\n </select>\r\n </label>\r\n\t\t\t\t\t<label>\r\n <span>关联自注册</span>\r\n <select ce-model=\"isLinkRegister\">\r\n <option value=\"\">全部</option>\r\n <option value=\"1\">是</option>\r\n <option value=\"0\">否</option>\r\n </select>\r\n </label>\r\n <label>\r\n <span>来源</span>\r\n <select id=\"eiSource\" ce-model=\"source\">\r\n <option value=\"\">全部</option>\r\n </select>\r\n </label>\r\n <label>\r\n <span>行业</span>\r\n <select id=\"eiIndustry\" ce-model=\"industry\">\r\n <option value=\"\">全部</option>\r\n </select>\r\n </label>\r\n <label>\r\n <span>省市</span>\r\n <select id=\"eiProvince\" ce-model=\"province\">\r\n <option value=\"\">全部</option>\r\n </select>\r\n </label>\r\n <label>\r\n <span>城市</span>\r\n <input id=\"eiCity\" class=\"g-ipt ipt-s\" type=\"text\" ce-model=\"city\"/>\r\n </label>\r\n \r\n <label>\r\n <span>联系电话</span>\r\n <input id=\"eiMobile\" class=\"g-ipt ipt-m\" type=\"text\" ce-model=\"tel\"/>\r\n </label>\r\n\r\n <!--新添筛选项-->\r\n <label>\r\n <span>应用类型</span>\r\n <select name=\"hasProduct\" ce-model=\"hasProduct\">\r\n <option value=\"\">全部</option>\r\n <!--<option value=\"\">CRM</option>-->\r\n\t\t\t\t\t\t\t<option value=\"1\">CRM</option>\r\n <option value=\"4\">pk助手</option>\r\n <option value=\"7\">工资助手</option>\r\n <option value=\"5\">会议助手</option>\r\n <option value=\"12\">自定义助手</option>\r\n <option value=\"3\">培训服务费</option>\r\n </select>\r\n </label>\r\n <label>\r\n <span>优惠码</span>\r\n <input type=\"text\" onchange=\"this.value=this.value.replace(/\\D/g,'')\" ce-model=\"vendorId\" maxlength=8>\r\n </label>\r\n <label>\r\n <span>是否赠送办公版</span>\r\n <select ce-model=\"isPresent\">\r\n <option value=\"\">全部</option>\r\n <option value=\"1\">是</option>\r\n <option value=\"0\">否</option>\r\n </select>\r\n </label>\r\n <label>\r\n <span>是否付费</span>\r\n <select ce-model=\"isPay\">\r\n <option value=\"\">全部</option>\r\n <option value=\"true\">是</option>\r\n <option value=\"false\">否</option>\r\n </select>\r\n </label>\r\n </div>\r\n </div>\r\n <div class=\"list-content\">\r\n <table>\r\n <thead>\r\n <tr>\r\n <th></th>\r\n <th style=\"width:120px;\">企业名称</th>\r\n <th style=\"width:130px;\">帐号</th>\r\n\t\t\t\t\t\t<th style=\"width:130px;\">所属代理商</th>\r\n\t\t\t\t\t\t<th style=\"width:60px;\">是否付费</th>\r\n\t\t\t\t\t\t<th style=\"width:90px;\">关联自注册</th>\r\n\t\t\t\t\t\t<th style=\"width:130px;\">负责销售(创建人)</th>\r\n <th style=\"width:120px;\">开通日期</th>\r\n <th style=\"width:100px;\">企业状态</th>\r\n <th style=\"width:150px;\">CRM信息可见授权</th>\r\n <th style=\"width:110px;\">手机设备授权</th>\r\n <th style=\"width:400px;\">操作</th>\r\n <th></th>\r\n </tr>\r\n </thead>\r\n <tbody ce-collection=\"list\">\r\n <td></td>\r\n <td><%=item.enterprise.enterpriseName%></td>\r\n <td><%=item.enterprise.enterpriseAccount%></td>\r\n\t\t\t\t\t\t<td> <%=item.agent ? item.agent.name:''%> </td>\r\n\t\t\t\t\t\t<td> <%=item.enterprise.isPayed ? '是':'否'%></td>\r\n\t\t\t\t\t\t<td> <%=item.isLinkRegister ? '是':'否'%></td>\r\n\t\t\t\t\t\t<td> <%=item.creator ? item.creator.name:'否'%> </td>\r\n <td><%=item.createtimestr%></td>\r\n <td><%=item.runstatusstr%></td>\r\n <td><%=item.crmvisible%></td>\r\n <td><%=item.authStr%></td>\r\n <td>\r\n\r\n <a class=\"info-detail\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-status=\"<%=item.enterprise.runStatus%>\">查看</a>\r\n \r\n <a class=\"info-trace\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-status=\"<%=item.enterprise.runStatus%>\">跟踪记录</a>\r\n \r\n <%if(\"2\" == item.enterprise.runStatus){%>\r\n <a data-permissions=\"F009001\" data-id=\"<%=item.enterprise.enterpriseID%>\" class=\"info-enterpriseAssign\">&nbsp;分配</a>\r\n <%}%>\r\n\r\n <% if(item.canIncrease){ %>\r\n <a class=\"info-zengbangong\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\" data-status=\"<%=item.enterprise.runStatus%>\">增购办公版</a>\r\n <a class=\"info-zengyingxiao\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\" data-status=\"<%=item.enterprise.runStatus%>\">增购营销版</a>\r\n <% } %>\r\n\r\n <% if(item.canRenew){ %>\r\n <a class=\"info-renewbangong\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\" data-status=\"<%=item.enterprise.runStatus%>\">续费办公版</a>\r\n <a class=\"info-renewyingxiao\" data-id=\"<%=item.enterprise.enterpriseID%>\" data-account=\"<%=item.enterprise.enterpriseAccount%>\" data-status=\"<%=item.enterprise.runStatus%>\">续费营销版</a>\r\n <% } %>\r\n\t\t\t\t\t\t\t<%if(item.canEditPartner == 1||item.canEditPartner == \"1\"){%>\r\n\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t<a class=\"info-custom\" data-enterpriseId=\"<%=item.enterprise.enterpriseID%>\">联合跟进人</a>&nbsp;&nbsp;\r\n\t\t\t\t\t\t\t<%}else{%>\r\n\t\t\t\t\t\t\t\t<a style=\"color:#ccc;\" >联合跟进人</a>&nbsp;&nbsp;\r\n\t\t\t\t\t\t\t<%}%>\r\n\t\t\t\t\t\t\t \r\n </td>\r\n </td>\r\n <td></td>\r\n </tbody>\r\n </table>\r\n </div>\r\n </div>\r\n <div class=\"list-pager\">\r\n \r\n </div>\r\n </div>\r\n</div>\r\n";
});