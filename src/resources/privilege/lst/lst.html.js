define(function(require, exports, module) {
    module.exports="<div class=\"p-list p-ent-lst\" js=\"true\">\r\n <div id=\"privilege\">\r\n <div class=\"head\">\r\n <label>优惠方案名称\r\n <input type=\"text\" class=\"name\" placeholder=\"请输入方案名称\">\r\n </label>\r\n <label><span>创建时间</span>\r\n <input type=\"text\" id=\"OpenSTime\" placeholder=\"开始时间\">———\r\n <input type=\"text\" id=\"OpenETime\" placeholder=\"结束时间\">\r\n </label>\r\n <label>\r\n <span>状态</span>\r\n <select name=\"\" class=\"status\">\r\n <option value=\"\">全部</option>\r\n <option value=\"1\">启用</option>\r\n <option value=\"0\">停用</option>\r\n </select>\r\n </label>\r\n <button type=\"button\" class=\"search\">查询</button>\r\n <button type=\"button\" class=\"new\">新建优惠方案</button>\r\n </div>\r\n <div id=\"listContainer\">\r\n </div>\r\n </div>\r\n <div class=\"list-pager\">\r\n </div>\r\n <div class=\"m-slider\" style=\"z-index:100;width:680px;display:block;right:-680px;\">\r\n <div class=\"slider-header\">\r\n <span class=\"header-close\">x</span>\r\n <p class=\"header-title\">优惠方案</p>\r\n </div>\r\n <div class=\"slider-body\">\r\n <hr></hr>\r\n <form id=\"form\">\r\n <p>\r\n <label for=\"\">\r\n <span>优惠方案名称<span style=\"color:red;margin-left:50px\">*</span></span>\r\n <input type=\"text\" placeholder=\"最多20个字\" style=\"width:340px\" id=\"chpPlanName\" required maxlength=\"20\">\r\n </label>\r\n </p>\r\n <hr></hr>\r\n <p>\r\n <label for=\"\">\r\n <span><b>优惠产品</b><span style=\"color:red;margin-right:50px;\">*</span></span>\r\n <span>至少选择一个产品</span>\r\n </label>\r\n </p>\r\n <ul style=\"display: inline-block;\">\r\n <li><span style=\"margin-right:65px;\">产品名称</span><span>赠送时长</span></li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"4\" name=\"checkBox\"></input><span class=\"cliName\" style=\"margin-right:60px\">PK助手 </span>\r\n <input type=\"text\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>天</li>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"5\" name=\"checkBox\"></input><span class=\"cliName\">会议助手</span>\r\n <input type=\"text\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>天</li>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"12\" name=\"checkBox\"></input><span class=\"cliName\" style=\"margin-right:35px;\">自定义助手</span>\r\n <input type=\"text\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>天</li>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"15\" name=\"checkBox\"></input><span class=\"cliName\">考试助手</span>\r\n <input type=\"text\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>天</li>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"14\" name=\"checkBox\"></input><span class=\"cliName\">战报助手</span>\r\n <input type=\"text\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>天</li>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"7\" name=\"checkBox\"></input><span class=\"cliName\">工资助手</span>\r\n <input type=\"text\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>天</li>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"17\" name=\"checkBox\"></input><span class=\"cliName\">项目管理</span>\r\n <input type=\"text\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>天</li>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"18\" name=\"checkBox\"></input><span class=\"cliName\">存储空间</span> 赠送空间量(G)\r\n <input type=\"text\" id=\"space\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>\r\n </li>\r\n <li>\r\n <input type=\"checkbox\" data-id=\"8\" name=\"checkBox\"></input><span class=\"cliName\">名片扫描</span>\r\n <input type=\"radio\" name=\"alterative\" id=\"count\"></input> <span>赠送数量(张)</span>\r\n <input style=\"margin-right:40px\" id=\"numberCount\" oninput=\"this.value=this.value.replace(/\\D/g, '')\"></input>\r\n <input type=\"radio\" id=\"noLimit\" name=\"alterative\"></input><span>不限</span>\r\n </li>\r\n </ul>\r\n <hr></hr>\r\n <label for=\"\" style=\"margin-top:10px;display: inline-block;margin-bottom:20px\">优惠介绍</label> <b style=\"color:red;margin-left:50px;\">*</b>\r\n <div style=\"text-align: center\">\r\n <textarea id=\"content\" required maxlength=\"100\">最多100字</textarea>\r\n <button type=\"button\" class=\"submit\">提交</button>\r\n <button type=\"button\" class=\"cancel\">取消</button>\r\n </div>\r\n </form>\r\n </div>\r\n </div>\r\n</div>\r\n<script type=\"text/template\" id=\"planList\">\r\n <table style=\"border-top:none\" id=\"list\">\r\n <thead>\r\n <tr>\r\n <th>优惠方案名称</th>\r\n <th>创建时间</th>\r\n <th>状态</th>\r\n <th>操作</th>\r\n </tr>\r\n </thead>\r\n <tbody>\r\n <% _.each(model.content,function(item,index){%>\r\n <tr data-id=<%=item.id%>>\r\n <td>\r\n <%=item.name%>\r\n </td>\r\n <td>\r\n <%=item.createTime%>\r\n </td>\r\n <td>\r\n <%=(!item.status?\"停用\":\"启用\")%>\r\n </td>\r\n <td>\r\n <a href=\"javascript:void(0)\" class=\"delete\" data-name=<%=item.id%>>删除</a>\r\n <a href=\"javascript:void(0)\" class=\"view\" data-name=<%=item.id%>>查看</a>\r\n <a href=\"javascript:void(0)\" class=\"disable\" data-name=<%=item.id%>><%=(!item.status?\"启用\":\"停用\")%></a>\r\n </td>\r\n </tr>\r\n <%})%>\r\n </tbody>\r\n </table>\r\n</script>\r\n";
});