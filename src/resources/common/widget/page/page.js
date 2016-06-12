var main = angular.module('list');

//分页组件 ??传递事件
main.directive('page',function(){
	return{
		restrict: 'E', //E element
        controller: function( $scope,$element ){

        	var omit="..."; //省略标识

            //获取总页数
            $scope.getFullPage = function(){
            	return Math.ceil( $scope.total / $scope.pagesize );
            };
            //上一页
            $scope.prevPage = function(e){
            	if ($scope.pagenumber <= 1) return;
            	$scope.pagenumber = $scope.pagenumber - 1;
            	$scope.refresh();
            	$scope.$emit('pagechange',$scope.pagenumber);
            };
            //下一页
            $scope.nextPage = function(e){
            	if ($scope.pagenumber >= $scope.getFullPage() ) return;
            	$scope.pagenumber = $scope.pagenumber + 1;
            	$scope.refresh();
            	$scope.$emit('pagechange',$scope.pagenumber);
            };
            //页数点击
            $scope.pageClick = function( e ){
            	var page = e.target.getAttribute('data-page');
            	if(page == omit) return;
            	$scope.pagenumber = page - 1;
            	$scope.refresh();
            	$scope.$emit('pagechange',$scope.pagenumber);
            };
            //重新计算数据模型
            $scope.refresh = function(){
            	var fullPage = $scope.getFullPage(),
            		pageNumber = $scope.pagenumber+1;

				//------------------------------------------------------------------------
	            // 计算数据模型
	            // 最多十一个格子 当页数大于十一个格子时 以省略符号显示压缩的页数
	            // 第一个格子和最后一个格子 显示首页 和 末页
	            // 第二个格子和倒数第二个格子 显示压缩的页数或具体的页数 优先从倒数第二个格子压缩
	            // 尽量以当前页数为中心向两边扩散
	            // -----------------------------------------------------------------------
	            var arr = [];
	            if (fullPage <= 11) {
	            	for(var i=0; i<fullPage; i++){
	            		arr.push(i+1);
	            	}
	            } else {

	                if (pageNumber <= 6) {

	                    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, fullPage]
	                } else if (pageNumber >= (fullPage - 5)) {

	                    arr = [1, 0, fullPage - 8, fullPage - 7, fullPage - 6, fullPage - 5, fullPage - 4, fullPage - 3, fullPage - 2, fullPage - 1, fullPage]
	                } else {

	                    arr = [1, 0, pageNumber - 3, pageNumber - 2, pageNumber - 1, pageNumber, pageNumber + 1, pageNumber + 2, pageNumber + 3, 0, fullPage]
	                }

	            }

	            var pages = [];
	            arr.forEach(function( item ){
	   				if( item == 0 ){
	   					pages.push({'class':'deactive','number':omit})
	   				}else if( item == pageNumber ){
	            		pages.push({'class':'active','number':item})
	            	}else{
	            		pages.push({'number':item})
	            	}
	            })
	            $scope.pages = pages;

	            //前一页 后一页 
	            $scope.frontpage = "";
				$scope.nextpage = "";
	            if ($scope.pagenumber <= 1 || $scope.total <= 0) {
	                $scope.frontpage = "disabled";
	            }
	            if ($scope.pagenumber >= fullPage || $scope.total <= 0) {
	                $scope.nextpage = "disabled";
	            }
            };

            $scope.refresh();
        },
        
        scope:{
            'pagesize': '@',         //获取每页条数
            'pagenumber': '=',       //页数
            'total': '@'             //总条数
        },

	    template:'<div class="m-page">' +

					'<span class="page-totalsize">' +
						'共 <b>{{total}}</b> 条&nbsp;&nbsp;' +
					'</span>'                       +

					'<section class="page-main">'   +
						'<span ng-click="prevPage($event)">'  +
						'<b ng-class="frontpage">&lt; 前页</b>'                  + 
						'</span>'                    +

						'<span class="page-span" ng-click="pageClick($event)" ng-repeat="page in pages"><b class="{{page.class}}" data-page="{{page.number}}">{{page.number}}</b></span>' +
						
						'<span ng-click="nextPage($event)">' +
						'<b ng-class="nextpage">后页 &gt;</b>' +
						'</span>' +
					'</section>' +

				'</div>',
		replace: true   //是否替换原始自定义标签
	}
});
