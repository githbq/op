<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>运营平台-财务人员</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <link rel="shortcut icon" href="//www.fxiaoke.com/favicon.ico" type="image/x-icon" />

    <link rel="stylesheet" type="text/css" href="resources/assets/style/main.css"/>

</head>
<body>

<!--头部区域-->
<header id="header">
    <h1 class="header-logo"><img src="resources/assets/images/fxlogo.png" alt="" /></h1>
    <div class="header-person">
        <div id="accountDept" title=""><span id="accountname"></span></div>
        <div class="person-loginout">
            <!--<a href="#page/changepwd">修改密码</a>-->
			<a href="javascript:void(0)" class="modify-phone" >修改手机号</a>
            <a href="/logout?from=/op">退出</a>
        </div>
    </div>
    <div class="header-policy">
        <a href="javascript:;">政策规则</a>
    </div>
    <nav>
        <ul class="nav-main clearfix">
            <li data-permissions="M010003">
                <a href="#page/approvallist/finance">我的审批</a>
                <ul class="nav-sub">
                    <li data-permissions="M010001">
                        <a href="#page/approvallist/finance">订单审批</a>
                    </li>
                    <li data-permissions="M010004">
                        <a href="#order/invoiceapplyfinancelist">发票审批</a>
                    </li>
                </ul>
            </li>
            <li data-permissions="M010002">
                <a href="#order/payaccount">银行账户管理</a>
            </li>
            <li data-permissions="M010005">
                <a href="#rcv/lst">到款数据</a>
            </li>
            <li data-permissions="M010009">
                <a href="#rcv/stc">到款统计</a>
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
<input id="key" type="hidden" value="${token}" /></div>

<!--Tip 提示-->
<script type="text/template" id="g-tip">
    <div class="g-tip"><p></p></div>
</script>

<script type = "text/javascript">
    var IBSS = {};
    IBSS.BASE_PATH = location.pathname.slice( 0,location.pathname.lastIndexOf('/') ) + '/resources';   //静态资源路径
    IBSS.API_PATH = '/op/api/f';       //api路径
    IBSS.IS_DEVELOP = true;
    // IBSS.VERSION ='4.7.' + (new Date()).getTime();
    IBSS.VERSION ='1.1';
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
    seajs.use(['common/app'], function( app ) {
        app.run();
    });
</script>

</body>
</html>


