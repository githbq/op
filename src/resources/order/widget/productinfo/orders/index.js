define(function (require, exports, module) {

        exports.setCommonData = function (controller, terminalDataItems, tableDataItems, formDataItems, type, responseData) {
            debugger
            type = type.toString();
            controller(terminalDataItems, 'keyword', function (n) {
                if ($.inArray(type, ['1', '2', '3', '4']) >= 0) {
                    n.value = '新购';
                }
                else if ($.inArray(type, ['5', '6', '7', '8']) >= 0) {
                    n.value = '增购';
                }
                else if ($.inArray(type, ['9', '10', '11', '12']) >= 0) {
                    n.value = '增购';
                }
            });
            controller(terminalDataItems, 'isedit', function (item) {
                if (responseData) {
                    item.value = responseData.edit;
                }
            });
            controller(terminalDataItems, 'allreadonly', function (item) {
                item.allreadonly = false;
            });
            var bigArr = terminalDataItems.concat(tableDataItems).concat(formDataItems);
            if (responseData) {
                var dataDic = toNameDictionary(bigArr);
                var order, contract, enterpriseExtend, subOrders;
                if (responseData.data) {
                    order = responseData.data.order;
                    contract = responseData.data.contract;
                    enterpriseExtend = responseData.data.enterpriseExtend;
                    subOrders = responseData.data.subOrders || [];
                }
                if (order) {
                    setObjValue(order, bigArr);
                    setValue(dataDic, 'payStatus_select', order.payStatus || 1, function (n) {
                        n.on('setFieldValue', function ($ele, value, data) {
                            data.__editChange = false;
                        });
                    });
                }
                dataDic['enterpriseId'] && ( dataDic['enterpriseId'].value = responseData.enterpriseId);
                if (contract) {
                    dataDic['contract'].value = JSON.stringify(contract || {});
                    dataDic['contractCopy'].value = JSON.stringify(contract || {});

                    controller(formDataItems, 'sealName', function (item) {
                        item.value = contract.sealName;
                    });

                    //
                    //$a.attr('href', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
                    //$img.attr('src', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
                    //
                    if (contract.contractFileName) {
                        controller(formDataItems, 'contract-image', function (item) {
                            item.visible = true;
                            item.attr = {src: '/op/api/file/previewimage?filePath=' + contract.contract};
                            item.on('setValue', function ($ele, data) {
                                $ele.parent('a').attr('href', '/op/api/file/previewimage?filePath=' + contract.contract);
                            })
                        });
                    }
                    if (contract.contractCopyFileName) {
                        controller(formDataItems, 'contractCopy-image', function (item) {
                            item.visible = true;
                            item.attr = {src: '/op/api/file/previewimage?filePath=' + contract.contractCopy};
                            item.on('setValue', function ($ele, data) {
                                $ele.parent('a').attr('href', '/op/api/file/previewimage?filePath=' + contract.contractCopy);
                            });
                        });
                    }
                }
                if (enterpriseExtend) {
                    dataDic['companyGatePicture'].value = JSON.stringify(enterpriseExtend || {});
                    if (enterpriseExtend.companyGatePictureFileName) {
                        controller(formDataItems, 'companyGatePicture-image', function (item) {
                            item.visible = true;
                            item.attr = {src: '/op/api/file/previewimage?filePath=' + enterpriseExtend.companyGatePicture};
                            item.on('setValue', function ($ele, data) {
                                $ele.parent('a').attr('href', '/op/api/file/previewimage?filePath=' + enterpriseExtend.companyGatePicture);
                            })
                        });
                    }
                    controller(formDataItems, 'companyGateKeyword', function (item) {
                        item.value = enterpriseExtend.companyGateKeyword;
                    });
                    controller(formDataItems, 'companyGateRemark', function (item) {
                        item.value = enterpriseExtend.companyGateRemark;
                    });
                }
                var checkids = [];
                if (dataDic['check'] && dataDic['check'].value) {
                    if ($.isArray(dataDic['check'].value)) {
                        checkids = checkids.concat(dataDic['check'].value);
                    } else {
                        checkids = dataDic['check'].value.split(',');
                    }
                }
                var useCRM = false;
                var useFX = false;
                $(subOrders).each(function (i, n) {
                    if (n.subOrder && n.subOrder.productId && n.subOrder.productId != 10 && n.subOrder.productId != 11) {//10为绑定百川  11为绑定报数系统
                        if (n.subOrder.enabled !== false) {
                            checkids.push(n.subOrder.productId);
                        }
                        var subOrder = n.subOrder;
                        for (var j in subOrder) {
                            if (subOrder.hasOwnProperty(j)) {
                                setValue(dataDic, j + '_input_' + subOrder.productId, subOrder[j]);
                                setValue(dataDic, j + '_' + subOrder.productId, subOrder[j]);
                            }
                        }
                        var items = tableDataItems;
                        if ($.inArray(n.subOrder.productId.toString(), ['1', '2', '3', '8']) >= 0) {
                            items = terminalDataItems;
                        }
                        if (subOrder.productId == '1') {//选中CRM
                            useCRM = true;
                        }
                        if (subOrder.productId == '2' || subOrder.productId == '3') {//选中逍客终端
                            useFX = true;
                        }

                        if (subOrder['startTime_readonly'] === true && dataDic['startTime_' + subOrder.productId]) {
                            dataDic['startTime_' + subOrder.productId].readonly = true;
                            dataDic['startTime_' + subOrder.productId].__force = true;
                        }
                        if (subOrder['startTime_max'] !== undefined) {
                            dataDic['startTime_' + subOrder.productId].maxDate = subOrder['startTime_max'];
                        }
                        if (subOrder['startTime_min'] !== undefined) {
                            dataDic['startTime_' + subOrder.productId].minDate = subOrder['startTime_min'];
                        }
                        if (subOrder['endTime_max'] !== undefined) {
                            dataDic['endTime_' + subOrder.productId].maxDate = subOrder['endTime_max'];
                        }
                        if (subOrder['endTime_min'] !== undefined) {
                            dataDic['endTime_' + subOrder.productId].minDate = subOrder['endTime_min'];
                        }
                        if (subOrder['endTime_readonly'] === true && dataDic['endTime_' + subOrder.productId]) {
                            dataDic['endTime_' + subOrder.productId].readonly = true;
                            dataDic['endTime_' + subOrder.productId].__force = true;
                        }
                        if (subOrder.currPayAmount !== undefined && subOrder.currPayAmount !== null) {
                            controller(formDataItems, 'currPayAmount_' + subOrder.productId, function (item) {
                                item.value = subOrder.currPayAmount.toString();
                            });
                        }
                        if (n.productExtends) {//有拓展属性
                            $(n.productExtends).each(function (index, kv) {
                                switch (kv.productKey) {
                                    case 'buytype':
                                    {
                                        controller(items, 'type_' + subOrder.productId, function (item) {
                                            item.__editChange = false;
                                            item.value = kv.productValue;
                                        });
                                    }
                                        ;
                                        break;
                                }
                            })

                        }
                    }
                });
                //使用逍客终端 使用CRM 选中效果
                controller(terminalDataItems, 'useCRM', function (item) {
                    if (item.visible !== false) {
                        item.value = useCRM;
                    }
                });
                controller(terminalDataItems, 'useFX', function (item) {
                    if (item.visible !== false) {
                        item.value = useFX;
                    }
                });
                controller(tableDataItems, 'check', function (item) {
                    item.value = checkids;
                });
                $(bigArr).each(function (i, n) {
                    if (n.attr) {
                        (!n.attr.maxlength) && (n.attr.maxlength = 50);
                    } else {
                        n.attr = {maxlength: 50};
                    }
                });

                if (responseData.readonly === true) {

                    controller(terminalDataItems, 'allreadonly', function (item) {
                        item.allreadonly = true;
                    });
                    $(terminalDataItems).each(function (i, n) {
                        if (n.name.toLowerCase().indexOf('wrapper') < 0 && n.name.toLowerCase().indexOf('image') < 0) {//包裹者不设
                            n.readonly = true;
                        }
                    })
                    ;
                    $(tableDataItems).each(function (i, n) {
                        if (n.name.toLowerCase().indexOf('wrapper') < 0 && n.name.toLowerCase().indexOf('image') < 0) {//包裹者不设
                            n.readonly = true;
                        }
                    });
                    $(formDataItems).each(function (i, n) {
                        if (n.name.toLowerCase().indexOf('wrapper') < 0 && n.name.toLowerCase().indexOf('image') < 0) {//包裹者不设
                            n.readonly = true;
                        }
                    });
                }
                if (responseData && responseData.payInfoReadonly !== undefined) {//支付信息只读
                    exports.setPayInfoReadonly(controller, terminalDataItems, tableDataItems, formDataItems, responseData.payInfoReadonly);
                }

            }


        }
        ;

        //设置增购逻辑
        exports.setAddOrderLogic = function (controller, terminalDataItems, tableDataItems, formDataItems, type, responseData) {
            controller(tableDataItems, 'tablelist', function (n) {
                n.visible = true;
            });
            controller(tableDataItems, 'check', function (n) { 
                n.on('setFieldValue', function ($ele, value, data, me) {
                    var isreadonly = me.__refs.terminalInfo.o_getFieldData('allreadonly').allreadonly === true;
                    if (responseData && responseData.data && responseData.data.subOrders) {
                        var ids = [];
                        if(responseData.refuse){//被驳回前 要隐藏掉相关的子产品
                            me.$('input[type=checkbox][data-name=check]').each(function(i,n){
                                if(!$(n).is(':checked')){
                                    $(n).parents('tr').hide();
                                }
                            });
                        }
                        $(responseData.data.subOrders).each(function (j, m) {
                            var checkbox = me.$('input[type=checkbox][data-name=check][value=' + m.subOrder.productId + ']');
                            if (checkbox.length > 0 && !isreadonly && !responseData.refuse) {//如果存在此纪录 则隐藏 且取消勾选
                                checkbox.prop('checked', false).attr('checked', false);
                                checkbox.parents('tr').attr('hidetr', 'hidetr').hide();
                            } else {
                                ids.push(m.subOrder.productId);
                            }
                        });
                        //一个也没有就隐藏
                        if (me.$('.tableinfo tbody tr:not([hidetr])').length == 0) {
                            me.o_setValue({name: 'tablelist', visible: false});
                        }
                        if (isreadonly) {
                            me.o_setValue({name: 'check', value: ids}, true);
                        }
                    }
                });
            });
        };

        function setValue(dataDic, key, value, callback) {
            if (dataDic && dataDic[key] !== undefined) {
                dataDic[key].value = value;
                dataDic[key] && callback && callback(dataDic[key]);
            }
        }

        function setObjValue(formObj, bigArr, func) {
            if (formObj) {
                for (var i in formObj) {
                    if (formObj.hasOwnProperty(i)) {

                        var find = _.findWhere(bigArr, {name: i});
                        if (find) {
                            find.value = formObj[i];
                        }
                    }
                }
            }
        }

        function toNameDictionary(arr) {
            var obj = {};
            $(arr).each(function (i, n) {
                obj[n.name] = n;
            })
            return obj;
        }

        exports.setOtherData = function (terminalInfo, tableInfo, formInfo, data) {
            debugger
            var terminalInfoData = terminalInfo.o_getValues();
            var tableInfoData = tableInfo.o_getValues();
            var formInfoData = formInfo.o_getValues();
            var contractData = $.parseJSON(formInfoData.contract || '{}');
            var contractCopyData = $.parseJSON(formInfoData.contractCopy || '{}');
            data.contract = {
                contractNo: formInfoData.contractNo,
                contractPrice: formInfoData.contractPrice,
                sealName: formInfoData.sealName,
                contract: contractData.contract,
                contractFileName: (contractData.contractFileName || '').substr(-20, 20),
                contractCopy: contractCopyData.contractCopy,
                contractCopyFileName: (contractCopyData.contractCopyFileName || '').substr(-20, 20)
            };
            //门头照片
            var companyGatePictureData = $.parseJSON(formInfoData.companyGatePicture || '{}');
            var useBusinessCart = terminalInfo.o_getFieldData('kunban').visible && $.inArray('8',terminalInfo.o_getFieldValue('kunban').split(','))>=0 && terminalInfo.o_getFieldValue('useCRM') ? 1 : 0;//名片可见 CRM已勾选
            data.enterpriseExtend = {
                companyGatePicture: companyGatePictureData.companyGatePicture,
                companyGatePictureFileName: (companyGatePictureData.companyGatePictureFileName || '').substr(-20, 20),
                companyGateKeyword: formInfoData.companyGateKeyword,
                companyGateRemark: formInfoData.companyGateRemark,
                useBusinessCard: useBusinessCart
                //名片没这个了
                //: useBusinessCart ? terminalInfo.o_getFieldValue('purchaseAmount_8') : 0
            };
            //订单主信息
            data.order = {
                payStatus: formInfoData.payStatus,
                currPayAmount: formInfoData.currPayAmount,
                payDate: formInfoData.payDate,
                receiptsAccount: formInfoData.receiptsAccount,
                payerName: formInfoData.payerName,
                contractNo: formInfoData.contractNo,
                amount: formInfoData.contractPrice,
                productAmount: formInfoData.productAmount
            };

        };

        exports.setGZHelper = function (controller, terminalDataItems, tableDataItems, formDataItems) {
            controller(tableDataItems, 'type_7', function (n) {
                n.visible = false;
            });
            controller(tableDataItems, 'startTime_7', function (n) {
                n.readonly = true;
            });
            controller(tableDataItems, 'endTime_7', function (n) {
                n.readonly = true;
            });
            controller(tableDataItems, 'purchaseAmount_7', function (n) {
                n.readonly = true;
                n.value = 0;
            });
            controller(tableDataItems, 'productAmount_7', function (n) {
                n.value = 0;
            });

        };
        //没有表格
        exports.setNotable = function (controller, terminalDataItems, tableDataItems, formDataItems) {
            controller(tableDataItems, 'tablelist', function (n) {
                n.visible = false;
            });
            controller(tableDataItems, 'check', function (n) {
                n.value = false;
            });
        };
        //
        exports.setNoGZHelper = function (controller, terminalDataItems, tableDataItems, formDataItems) {
            controller(tableDataItems, 'check', function (n) {
                n.value = false;
            });
            controller(tableDataItems, 'startTime_7', function (n) {
                n.value = '';
            });
            controller(tableDataItems, 'endTime_7', function (n) {
                n.value = '';
            });
        };

        ///增购需要默认时间
        exports.setAddOrderTime = function (controller, terminalDataItems, tableDataItems, formDataItems) {
            controller(terminalDataItems, 'endTime_1', function (n) {
                n.readonly = true;
            });
            controller(terminalDataItems, 'startTime_1', function (n) {
                n.readonly = true;
            });
        };

        ///增购需要默认时间
        exports.setPayInfoReadonly = function (controller, terminalDataItems, tableDataItems, formDataItems, isReadonly) {
            //controller(formDataItems, 'contractNo', function (n) {
            //    n.readonly = isReadonly;
            //});
            //controller(formDataItems, 'contractPrice', function (n) {
            //    n.readonly = isReadonly;
            //});
            controller(formDataItems, 'payStatus_select', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'payDate', function (n) {
                n.readonly = isReadonly;
            });
            //controller(formDataItems, 'currPayAmount', function (n) {
            //    n.readonly = isReadonly;
            //});
            //////////////////////
            controller(formDataItems, 'currPayAmount_3', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_1', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_4', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_5', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_7', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_8', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_12', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_15', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount_14', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'receiptsAccount', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'payerName', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'sealName', function (n) {
                n.readonly = isReadonly;
            });
        };
        //转换输入值
        exports.setSuborders = function (terminalInfo, tableInfo, formInfo, data) {
            debugger
            var terminalInfoData = terminalInfo.o_getValues();
            var tableInfoData = tableInfo.o_getValues();
            var formInfoData = formInfo.o_getValues();
            //suborders //////////////////////////////////////////
            var ids = tableInfoData.check.split(',');
            if (terminalInfo.o_getFieldData('useCRMWrapper').visible && terminalInfo.o_getFieldValue('useCRM')) {
                ids.push('1');
            }
            if (terminalInfo.o_getFieldValue('useFX')) {
                ids.push('2');
                ids.push('3');
            }
            $(ids).each(function (i, n) {
                    if (!n) {
                        return;
                    }
                    if ($.inArray(n, ids) >= 0) {
                        var fromData = tableInfoData;
                        var controler = tableInfo;
                        if (n == '1' || n == '2' || n == '3' || n == '8') {
                            fromData = terminalInfoData;
                            controler = terminalInfo;
                        }

                        var subOrder = {
                            productId: n,
                            purchaseCount: fromData['purchaseCount_' + n] || 999999,
                            purchaseAmount: fromData['purchaseAmount_' + n] || 0,
                            startTime: fromData['startTime_' + n] || new Date().getTime(),
                            endTime: fromData['endTime_' + n] || new Date().getTime(),
                            productAmount: fromData['productAmount_' + n] || 0,
                            discount: fromData['discount_' + n] || 0,
                            currPayAmount: formInfoData['currPayAmount_' + n] || 0
                        };
                        //if (n == '3') {
                        //    subOrder.startTime = fromData['startTime_2'];
                        //    subOrder.endTime = fromData['endTime_2'];
                        //}
                        var productExtends = [];
                        if (n == '1') {
                            if (terminalInfo.o_getFieldValue('kunbang') && terminalInfo.o_data_getField({name: 'kunbang'}).is(':visible')) {
                                var binds = (terminalInfo.o_getFieldValue('kunbang') || '').split(',');
                                $(binds).each(function (i, b) {
                                    if (b) {
                                        data.subOrders.push({
                                            subOrder: {
                                                productId: b,
                                                purchaseCount: 999999,
                                                purchaseAmount: 0,
                                                startTime: fromData['startTime_1'],
                                                endTime: fromData['endTime_1'],
                                                productAmount: 0,
                                                discount: 0,
                                                currPayAmount: 0
                                            },
                                            productExtends: []
                                        });
                                    }
                                })
                            }
                        }
                        if (controler.o_data_getField({name: 'type_' + n}).is(':visible')) {
                            var value = controler.o_getFieldValue('type_' + n);
                            productExtends.push({productKey: 'buytype', productValue: value});
                        }
                        data.subOrders.push({
                            subOrder: subOrder,
                            productExtends: productExtends
                        });
                    }
                }
            );
        }
    }
)
;

// productKey :bind   绑定百川1   绑定报数系统2   两个都选的话  值为   1,2  以逗号分割
// productKey :buytype   购买方式   1试用  2 赠送  3折扣  4正常









