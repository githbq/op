define(function(require, exports, module) {
    module.exports="<div class=\"p-list p-qry-partner\" js=\"true\">\n <div class=\"m-list m-qry-partner u-tablelist\">\n <div class=\"list-main\">\n <div class=\"list-header\">\n <h3>合作伙伴报名<span class=\"header-opts\"><a id=\"btnExport\" class=\"opt-export\" data-permissions=\"F008080\">导出EXCEL</a></span></h3>\n </div>\n <div class=\"list-bar\">\n <div class=\"list-bar-btns\"><button id=\"btnSearch\" class=\"btn-blue\" data-permissions=\"F008079\">查询</button></div>\n <div class=\"list-bar-input\"><label><span>姓 名</span><input id=\"dsName\" type=\"text\" class=\"g-ipt ipt-m\" /></label><label><span>电 话</span><input id=\"dsMobile\" type=\"text\" class=\"g-ipt ipt-m\" /></label><label class=\"sp\"><label><span>报名时间</span><input id=\"dsStartTime\" type=\"text\" class=\"g-ipt ipt-l\" /></label><label><span>-</span><input id=\"dsEndTime\" type=\"text\" class=\"g-ipt ipt-l\" /></label></label><label><span>职 位</span><input id=\"dsTitle\" type=\"text\" class=\"g-ipt ipt-m\" /></label><label><span>公 司</span><input id=\"dsCompany\" type=\"text\" class=\"g-ipt ipt-l\" /></label><label><span>产 品</span><input id=\"dsProduct\" type=\"text\" class=\"g-ipt ipt-l\" /></label><label><span>意 向</span><input id=\"dsIntention\" type=\"text\" class=\"g-ipt ipt-l\" /></label></div>\n </div>\n <div class=\"list-content\">\n <table>\n <thead>\n <tr>\n <th></th>\n <th style=\"width: 200px;\">公 司</th>\n <th style=\"width: 100px;\">姓 名</th>\n <th style=\"width: 100px;\">电 话</th>\n <th style=\"width: 100px;\">职 位</th>\n <th style=\"width: 100px;\">合作产品</th>\n <th>合作意向</th>\n <th style=\"width: 140px;\">申请时间</th>\n <th></th>\n </tr>\n </thead>\n <tbody></tbody>\n </table>\n </div>\n </div>\n <div class=\"list-pager\"></div>\n </div>\n</div>";
});