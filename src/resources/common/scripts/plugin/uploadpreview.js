define(function (require, exports, module) {
    //图片本地即时预览插件
    jQuery.fn.extend({
        uploadPreview: function (opts) {
            var that = this,
                $file = $(this);
            opts = jQuery.extend({
                    img: null,//预览的图片标签
                    imgType: ["gif", "jpeg", "jpg", "png"],
                    Callback: function () {
                    },
                    errorCallback: function () {
                    }
                },
                opts || {});
            that.getObjectURL = function (file) {
                var url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file)
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file)
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file)
                }
                return url
            };
            $file.change(function () {
                var filePathArr =[];
                if (this.value) {
                    if (!RegExp("\.(" + opts.imgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                        //   alert("选择文件错误,图片类型必须是" + opts.imgType.join("，") + "中的一种");
                        this.value = "";
                        opts.errorCallback("选择文件错误,图片类型必须是" + opts.imgType.join("，") + "中的一种");
                        return false;
                    }
                    for (var i = 0; i < this.files.length; i++) {
                        filePathArr.push(that.getObjectURL(this.files[i]));
                    }
                    if (opts.img) {
                        $(opts.img).each(function (i, n) {
                            if (filePathArr.length > i) {
                                n.src = filePathArr[i];
                            }
                        });
                    }
                    opts.Callback && opts.Callback(filePathArr, that);
                }
            })
        }
    });
});