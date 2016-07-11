<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>运营平台-支持人员</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <link rel="shortcut icon" href="//www.fxiaoke.com/favicon.ico" type="image/x-icon"/>
    <!-- build:css resources/assets/style/main.css -->
    <link rel="stylesheet" type="text/css" href="resources/assets/style/main.css"/>
    <!-- endbuild -->
</head>
<body>

<!--头部区域-->
<header id="header">
    <h1 class="header-logo"><img src="resources/assets/images/fxlogo.png" alt=""/></h1>

    <div class="header-person">
        <span id="accountname"></span>

        <div class="person-loginout">
            <a href="#page/changepwd">修改密码</a>
            <a href="/logout?from=/op">退出</a>
        </div>
    </div>
    <div class="header-policy">
        <a href="javascript:;">政策规则</a>
    </div>
    <nav>
        <ul class="nav-main clearfix">

            <li data-permissions="M008001">
                <a class="nav-branch">查询</a>
                <ul class="nav-sub">
                    <li data-permissions="M008002"><a href="#qry/cmp">综合查询</a></li>
                    <li data-permissions="M008004"><a href="#qry/partner">合作伙伴</a></li>
                    <li data-permissions="M008003"><a href="#qry/exp">演示帐号</a></li>
                    <!--<li data-modulecode="QueryOpS"><a href="#qry/cyc">查一查</a></li>-->
                    <li data-permissions="M008006"><a href="#index/agentexport">代理商员工导出</a></li>
                </ul>
            </li>
            <li data-permissions="M008007">
                <a href="#order/orderlist">订单</a>
            </li>

            <li data-permissions="M008008">
                <a class="nav-branch">企业</a>
                <ul class="nav-sub">
                    <li data-permissions="M008009"><a href="#ent/lst">企业</a></li>
                    <li data-permissions="M008010"><a href="#ent/ind">自注册</a></li>
                </ul>
            </li>

            <!--
            <li data-modulecode="EnterpriseDayActivityOpS">
                <a href="#index/dayactive">企业日活跃</a>
            </li>
            -->

            <li data-permissions="M008011">
                <a class="nav-branch">活跃度</a>
                <ul class="nav-sub">
                    <!-- <li data-modulecode="RealTimeActivityOpS">
                         <a href="#index/lst">实时</a>
                     </li>
                     <li data-modulecode="MonthReportOpS">
                         <a href="#index/rpt">月度报告</a>
                     </li>-->
                    <li data-permissions="M008012">
                        <a href="#index/lst2">实时2</a>
                    </li>
                    <li data-permissions="M008013">
                        <a href="#index/rpt2">月度报告2</a>
                    </li>
                    <!--<li data-modulecode="PayedLifeCycleOpS">
                        <a href="#index/paid">付费生命周期</a>
                    </li>-->
                    <li data-permissions="M008015">
                        <a href="#index/personactive">个人活跃汇总</a>
                    </li>
                    <li data-permissions="M008016">
                        <a href="#index/activeanalyze">阶段活跃团队分析</a>
                    </li>
                    <li data-permissions="M008017">
                        <a href="#index/detail">企业日活跃详情报表</a>
                    </li>
                    <li data-permissions="M008018">
                        <a href="#index/lstreport">企业日活跃汇总报表</a>
                    </li>
                    <li data-permissions="M008019">
                        <a href="#index/monthanalyze">月季度团队数据分析</a>
                    </li>
                    <li data-modulecode="MonthActivityAll">
                        <a href="#index/seasonactive">月度季度总数据分析</a>
                    </li>
                </ul>
            </li>

            <li data-permissions="M008022">
                <a class="nav-branch">代理商</a>
                <ul class="nav-sub">
                    <li data-modulecode="AgentOpS"><a href="#agt/lst">代理商列表</a></li>
                    <li data-permissions="M008024"><a href="#agt/export">招商信息导出</a></li>
                </ul>
            </li>
            <!--<li>
                <a href="#pdt/lst">产品</a>
            </li>-->
            <li data-permissions="M008025">
                <a class="nav-branch">客户</a>
                <ul class="nav-sub">
                    <li data-permissions="M008026"><a href="#eme/lst">客户</a></li>
                    <!--热线查询单独菜单-->
                    <li data-permissions="M008027"><a href="#eme/clientlst">热线查询</a></li>
                    <li data-permissions="M008028"><a href="#eme/joinlimit">账号加入上限</a></li>
                    <li data-permissions="M008029"><a href="#eme/loginlimit">账号注册上限</a></li>
                </ul>
            </li>
            <li data-permissions="M008030">
                <a href="#page/approvallist">我的审批</a>
                <ul class="nav-sub">
                    <li data-permissions="M008031"><a href="#page/approvallist">订单审批</a></li>
                    <li data-permissions="M008032"><a href="#order/invoiceapplyagentlist">发票审批</a></li>
                </ul>
            </li>
            <li data-permissions="M008033">
                <a href="#page/watchent">企业监察</a>
            </li>
        </ul>
    </nav>
</header>
<!---->

<!--内容区域-->
<div id="con"></div>
<!---->

<!--Gloabal-->
<div class="g-loading"></div>
<div class="g-toast"></div>
<div class="g-confirm">
    <h3></h3>

    <div class="con"></div>
    <span class="btn"></span>
    <span class="close">×</span>
    <span class="arrow"></span>
</div>

<!--Preview 预览图片-->
<div class="g-preview">
    <div class="preview-close">×</div>
    <div class="preview-img">
        <img src="" alt="">
    </div>
</div>

<!---->
<input id="key" type="hidden" value="${token}"/>

<!--Tip 提示-->
<script type="text/template" id="g-tip">
    <div class="g-tip"><p></p></div>
</script>

<script type="text/javascript">
    var IBSS = {};
    IBSS.BASE_PATH = location.pathname.slice(0, location.pathname.lastIndexOf('/')) + '/resources';   //静态资源路径
    IBSS.API_PATH = '/op/api/s';       //api路径
    IBSS.IS_DEVELOP = true;
    // IBSS.VERSION ='4.7.' + (new Date()).getTime();
    IBSS.VERSION = '1.1';
</script>

<!--build:common resources/common/scripts/common.js-->
<script type="text/javascript" src="resources/common/scripts/lib/jquery-2.1.3.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/underscore-1.7.0.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/backbone-1.1.2.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/seajs-2.3.0.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/seajs-css.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/seajs-preload.js"></script>
<script type="text/javascript" src="resources/common/scripts/util.js"></script>
<script type="text/javascript" src="resources/common/scripts/widget.js"></script>
<script type="text/javascript" src="resources/common/widget/calendar/jquery.datetimepicker.js"></script>
<!--endbuild-->
<script type="text/javascript" src="resources/common/scripts/lib/angular.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/angular-messages.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/angular-filter.js"></script>
<script type="text/javascript" src="resources/common/widget/my97datepicker/wdatepicker.js"></script>
<!--build:app resources/assets/scripts/main.js-->
<script type="text/javascript" src="resources/assets/scripts/config.js"></script>
<script type="text/javascript" src="resources/assets/scripts/app.js"></script>
<!--endbuild-->

<script type="text/javascript">
    seajs.use(['common/app'], function (app) {
        app.run();
    });
</script>
<!--<script src="http://rap.firstshare.cn/rap.plugin.js?projectId=57"></script>-->
</body>
</html>
