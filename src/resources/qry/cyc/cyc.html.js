define(function(require, exports, module) {
    module.exports="<div class=\"p-list p-qry-cyc\" js=\"true\">\r\n\t <div class=\"m-list m-qry-cyc u-tablelist\">\r\n <div class=\"list-main\">\r\n <div class=\"list-header\">\r\n <h3>查一查使用次数统计列表</h3>\r\n </div>\r\n <div class=\"list-bar\">\r\n\t\t\t\t<!--<button id=\"btnDetail\" class=\"btn-blue\">消费明细</button>-->\r\n <div class=\"list-bar-btns\"><button id=\"btnSearch\" class=\"btn-blue\" data-permissions=\"F008099\">查询</button></div>\r\n <div class=\"list-bar-input\">\r\n <label><span>企业帐号</span>\r\n <input type=\"text\" id=\"eaccount\" class=\"g-ipt ipt-m\">\r\n </label>\r\n <label><span>企业名称</span>\r\n <input type=\"text\" id=\"ename\" class=\"g-ipt ipt-m\">\r\n </label>\r\n\t\t\t\t\t<label class=\"sp\">\r\n\t\t\t\t\t\t<label><span>使用次数</span>\r\n\t\t\t\t\t\t\t<input type=\"text\" id=\"usc\" class=\"g-ipt ipt-m\">\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t<label><span>-</span>\r\n\t\t\t\t\t\t\t<input type=\"text\" id=\"uec\" class=\"g-ipt ipt-m\">\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label><span>员工姓名</span>\r\n\t\t\t\t\t\t<input type=\"text\" id=\"eename\" class=\"g-ipt ipt-m\">\r\n\t\t\t\t\t</label>\r\n\t\t\t\t\t<label class=\"sp\">\r\n\t\t\t\t\t\t<label><span>使用时间</span>\r\n\t\t\t\t\t\t\t<input type=\"text\" id=\"ust\" class=\"g-ipt ipt-m\">\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t\t<label><span>-</span>\r\n\t\t\t\t\t\t\t<input type=\"text\" id=\"uet\" class=\"g-ipt ipt-m\">\r\n\t\t\t\t\t\t</label>\r\n\t\t\t\t\t</label>\r\n </div>\r\n </div>\r\n <div class=\"list-content\">\r\n\t\t\t\t<table>\r\n\t\t\t\t\t<thead>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t\t\t<th>序号</th>\r\n\t\t\t\t\t\t\t<th>企业</th>\r\n\t\t\t\t\t\t\t<th>帐号</th>\r\n\t\t\t\t\t\t\t<th>员工名</th>\r\n\t\t\t\t\t\t\t<th>点击总次数</th>\r\n\t\t\t\t\t\t\t<th>首次使用时间</th>\r\n\t\t\t\t\t\t\t<th>最后使用时间</th>\r\n\t\t\t\t\t\t\t<th></th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</thead>\r\n\t\t\t\t\t<tbody>\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t</tbody>\r\n\t\t\t\t</table>\r\n </div>\r\n </div>\r\n <div class=\"list-pager\"></div>\r\n </div>\r\n</div>\r\n";
});