define(function (require, exports, module) {
///
///多列长容器式瀑布流布局算法
///
    //$mainContainer:主容器
    //$elements:要实现此布局一组jquery元素
    //colWrapperStr:列容器要将对应一列的元素用此容器包裹起来 需要字符串 因为不能用已存在的DOM
    //offset:计算时间隙的补偿
    function multiColumnWaterfallLayout($mainContainer,$elements,colWrapperStr,offset) {
        if($elements.length==0){return;}
        var fullWidth = $mainContainer.outerWidth();
        var offset =offset==undefined?2:offset;
        var elementWidth = $elements.first().outerWidth();
        var colCount = Math.floor(fullWidth /(elementWidth+offset));
        var rowArr = setRowArr($elements);
        var colArr=setColArr(rowArr);
         wraperToContainer(colArr);//包裹
//将产品按一行一行的 装进二维数组
        function setRowArr($elements) {
            var rowArr = [];
            for (var i = 0; i < $elements.length; i++) {
                var $elem = $elements[i];
                if (i % colCount == 0) {
                    rowArr[rowArr.length] = rowArr[rowArr.length] || [];
                }
                rowArr[rowArr.length-1].push($elem);
            }
            return rowArr;
        }

//将产品按一列一列的装进二维数组
        function setColArr(rowArr) {
            var colArr = [];
            for (var i = 0; i < rowArr.length; i++) {
                var row = rowArr[i];
                for (var j = 0; j < row.length; j++) {
                    var col = colArr[j] = colArr[j] ||[];
                    col.push(row[j]);
                }
            }
            return colArr;
        }
        //将列数组上的元素包裹起来
        function wraperToContainer(colArr){
            for (var i = 0; i < colArr.length; i++) {
                var col=colArr[i];
                $(col).wrapAll($(colWrapperStr).width(elementWidth+offset))
            }
        }
    };
    module.exports=multiColumnWaterfallLayout;
});