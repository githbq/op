<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>运营平台-代理商用户</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <link rel="shortcut icon" href="//www.fxiaoke.com/favicon.ico" type="image/x-icon" />
    <!-- build:css resources/assets/style/main.css -->
    <link rel="stylesheet" type="text/css" href="resources/assets/style/main.css"/>
    <!-- endbuild -->
</head>
<body>

<!--头部区域-->
<header id="header">
    <h1 class="header-logo"><img src="resources/assets/images/fxlogo.png" alt="" /></h1>
    <div class="header-person">
        <span id="accountname"></span>
        <div class="person-loginout">
            <a href="#page/changepwd" data-permissions="F009079">修改密码</a>
            <a href="#page/setleader">设置上级</a>
            <a href="#page/setuser">用户列表</a>
            <a href="#agentsupport/backquestion" data-permissions="F009080">反馈</a>
            <a href="/logout?from=/op/a" data-permissions="F009081">退出</a>
        </div>
    </div>
    <nav>
        <ul class="nav-main clearfix">

            <li data-modulecode="EnterpriseFIlingOpA EnterpriseFIlingOpenOpA EnterpriseFIlingOpenRequestOpA">
                <a href="#agentsupport/entprisefiling">备案企业</a>
                <ul class="nav-sub">
                    <li data-modulecode="EnterpriseFIlingOpA"><a href="#agentsupport/entprisefiling">备案企业列表</a></li>
                    <li data-modulecode="EnterpriseFIlingOpenOpA"><a href="#agentsupport/entpriseopen">已公开列表</a></li>
                    <li data-modulecode="EnterpriseFIlingOpenRequestOpA"><a href="#agentsupport/entprisereq">公开企业申请列表</a></li>
                </ul>
            </li>
            <li>
                <a href="#order/orderlist">订单</a>
            </li>
           <li data-modulecode="EnterpriseOpA"><a href="#agentsupport/entpriselist">企业</a></li>
            <li data-modulecode="DayActivityDetailOpA DayActivityAllOpA SelfActivityAllOpA PeriodActivityAnalysisOpA PeriodActivityTeamAnalysisOpA MonthActivityTeamAnalysisOpA MonthActivityAllAnalysisOpA">
                <a href="#index/detail">活跃度</a>
                <ul class="nav-sub">
                    <li data-modulecode="DayActivityDetailOpA"><a href="#index/detail">企业日活跃详情报表 </a></li>
                    <li data-modulecode="DayActivityAllOpA"><a href="#index/lstreport">企业日活跃汇总报表</a></li>
                    <li data-modulecode="SelfActivityAllOpA"><a href="#index/personactive">个人活跃汇总</a></li>
                    <li data-modulecode="PeriodActivityAnalysisOpA"><a href="#act/activeanalyze">阶段活跃分析</a></li>
                    <li data-modulecode="PeriodActivityTeamAnalysisOpA">
                        <a href="#pagecommon/activeanalyze">阶段活跃团队分析</a>
                    </li>
                    <li data-modulecode="MonthActivityTeamAnalysisOpA">
                        <a href="#pagecommon/monthanalyze">月季度团队数据分析</a>
                    </li>
                    <li data-modulecode="MonthActivityAllAnalysisOpA">
                        <a href="#pagecommon/seasonactive">月度季度总数据分析</a>
                    </li>
                </ul>
            </li>
            <li data-modulecode="ApprovalOpA">
                <a href="#agentsupport/renewlist">我的审批</a>
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

<script type = "text/javascript">
    var IBSS = {};
        IBSS.BASE_PATH = location.pathname.slice( 0,location.pathname.lastIndexOf('/') ) + '/resources';   //静态资源路径
        IBSS.API_PATH = '/op/api/a';       //api路径
        IBSS.IS_DEVELOP = true;
        // IBSS.VERSION ='4.7.' + (new Date()).getTime();
        IBSS.VERSION ='5.1.2.20160219';
</script>

<!--build:common resources/common/scripts/common.js-->
<script type="text/javascript" src="resources/common/scripts/lib/jquery-2.1.3.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/underscore-1.7.0.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/backbone-1.1.2.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/seajs-2.3.0.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/seajs-css.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/seajs-text.js"></script>
<script type="text/javascript" src="resources/common/scripts/lib/seajs-preload.js"></script>
<script type="text/javascript" src="resources/common/scripts/util.js"></script>
<script type="text/javascript" src="resources/common/scripts/widget.js"></script>
<script type="text/javascript" src="resources/common/widget/calendar/jquery.datetimepicker.js"></script>
<!--endbuild-->

<!--build:app resources/assets/scripts/app.js-->
<script type="text/javascript" src="resources/assets/scripts/config.js"></script>
<script type="text/javascript" src="resources/assets/scripts/app.js"></script>
<!--endbuild-->

<script type="text/javascript">
    seajs.use(['common/app'], function( app ) {
        app.run( true );
    });
</script>
</body>
</html>

