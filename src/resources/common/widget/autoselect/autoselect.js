define(function (require, exports, module) {

    require('./jquery-ui');
    //require('./jquery.combo.select');

    /*
     *@ Select 插件
     */
    var AutoSelect = MClass(M.Center).include({

        events: {},

        elements: {},

        init: function () {
            AutoSelect.__super__.init.apply(this, arguments);
            var me = this;
        },

        resetSelect: function ($select, callback) {

            var me = this;

            var listObjet = [];

            $select.on('blur', function () {
                var tempName = $(this).val(),
                    flag = false;
                listObjet.length > 0 && listObjet.forEach(function (item) {
                    if(typeof(item)=='string' && item==tempName){
                        flag = true;
                        return false;
                    }
                    else if (item.name == tempName) {
                        $select.attr({
                            'data-id': item.id,
                            'data-agentId': item.agentId
                        });
                        flag = true;
                        return false;
                    }
                })
                if (flag) {
                    return false;
                }
                $select.val('');
                $(this).attr({
                    'data-id': '-1',
                    'data-agentId': '-1'
                });
            });

            $select.on('input', function () {

                var $this = $(this);
                debugger
                if (me.attrs.data) {
                    $select.autocomplete({
                        source: me.attrs.data
                    });
                    listObjet=me.attrs.data;
                }
                else {
                    util.api({
                        'url': '~/op/api/s/activity/getcompanys',
                        'data': {
                            'companyName': $this.val(),
                            'companyType': $this.attr('data-type') || 0,
                            'pageIndex': 0,
                            'pageSize': 10
                        },
                        'success': function (data) {
                            console.warn(data);
                            if (data.success) {
                                var availableTags = [];
                                listObjet = data.value.model.content;
                                data.value.model.content.forEach(function (item) {
                                    availableTags.push(item.name);
                                });
                                $select.autocomplete({
                                    source: availableTags
                                });
                            }
                        }
                    })
                }

            });
            callback && callback();
        }

    });

    module.exports = AutoSelect;
});

