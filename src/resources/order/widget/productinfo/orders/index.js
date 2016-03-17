define(function (require, exports, module) {

        exports.setCommonData = function (controller, terminalDataItems, tableDataItems, formDataItems, type, responseData) {
            type = type.toString();
            controller(terminalDataItems, 'keyword', function (n) {
                if ($.inArray(type, ['1', '2', '3', '4']) >= 0) {
                    n.value = '新购';
                }
                else if ($.inArray(type, ['5', '6', '7', '8']) >= 0) {
                    n.value = '增购';
                }
                else if ($.inArray(type, ['9', '10', '11', '12']) >= 0) {
                    n.value = '续费';
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
                    dataDic['contract'] = JSON.stringify(contract || {});
                    dataDic['contractCopy'] = JSON.stringify(contract || {});

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
                    dataDic['companyGatePicture'] = JSON.stringify(enterpriseExtend || {});
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
                $(subOrders).each(function (i, n) {
                    if (n.subOrder && n.subOrder.productId && n.subOrder.productId != 10 && n.subOrder.productId != 11) {//10为绑定百川  11为绑定报数系统
                        checkids.push(n.subOrder.productId);
                        var subOrder = n.subOrder;
                        for (var j in subOrder) {
                            if (subOrder.hasOwnProperty(j)) {
                                setValue(dataDic, j + '_input_' + subOrder.productId, subOrder[j]);
                                setValue(dataDic, j + '_' + subOrder.productId, subOrder[j]);
                            }
                        }
                        if (subOrder.productId == '1') {//选中CRM
                            controller(terminalDataItems, 'useCRM', function (item) {
                                item.value = true;
                            });
                        }
                        if (subOrder.productId == '2' || subOrder.productId == '3') {//选中销客终端
                            controller(terminalDataItems, 'useFX', function (item) {
                                item.value = true;
                            });
                        }

                        if (subOrder['startTime_readonly'] === true && dataDic['startTime_' + subOrder.productId]) {
                            dataDic['startTime_' + subOrder.productId].readonly = true;
                        }
                        if (subOrder['endTime_readonly'] === true && dataDic['endTime_' + subOrder.productId]) {
                            dataDic['endTime_' + subOrder.productId].readonly = true;
                        }
                        if (subOrder.currPayAmount !== undefined && subOrder.currPayAmount !== null) {
                            controller(formDataItems, 'currPayAmount_' + subOrder.productId, function (item) {
                                item.value = subOrder.currPayAmount.toString();
                            });
                        }
                        if (n.productExtends) {//有拓展属性
                            $(n.productExtends).each(function (index, kv) {
                                switch (kv.key) {
                                    case 'buytype':
                                    {
                                        controller(terminalDataItems, 'type_' + subOrder.productId, function (item) {
                                        });
                                        setValue(dataDic, 'type_' + subOrder.productId, kv.value, function (item) {
                                            item.on('setFieldValue', function ($ele, value, data) {
                                                data.__editChange = false;
                                            })
                                        });
                                    }
                                        ;
                                        break;
                                }
                            })

                        }
                    }
                });
                dataDic['check'].value = checkids;
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
                contractFileName: contractData.contractFileName,
                contractCopy: contractCopyData.contractCopy,
                contractCopyFileName: contractCopyData.contractCopyFileName
            };
            //门头照片
            var companyGatePictureData = $.parseJSON(formInfoData.companyGatePicture || '{}');
            var useBusinessCart = terminalInfo.o_getFieldData('businesscard').visible && terminalInfo.o_getFieldValue('useCRM') ? 1 : 0;//名片可见 CRM已勾选
            data.enterpriseExtend = {
                companyGatePicture: companyGatePictureData.companyGatePicture,
                companyGatePictureFileName: companyGatePictureData.companyGatePictureFileName,
                companyGateKeyword: formInfoData.companyGateKeyword,
                companyGateRemark: formInfoData.companyGateRemark,
                useBusinessCard: useBusinessCart,
                businessCardPrise: useBusinessCart ? terminalInfo.o_getFieldValue('purchaseAmount_8') : 0
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
            controller(formDataItems, 'contractNo', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'contractPrice', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'payStatus_select', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'payDate', function (n) {
                n.readonly = isReadonly;
            });
            controller(formDataItems, 'currPayAmount', function (n) {
                n.readonly = isReadonly;
            });
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
            var terminalInfoData = terminalInfo.o_getValues();
            var tableInfoData = tableInfo.o_getValues();
            var formInfoData = formInfo.o_getValues();
            //suborders //////////////////////////////////////////
            var ids = tableInfoData.check.split(',');
            if (terminalInfo.o_getFieldData('businesscard').visible && terminalInfo.o_getFieldValue('useCRM')) {
                ids.push('8');
            }
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
                            purchaseCount: fromData['purchaseCount_' + n] || 1,
                            purchaseAmount: fromData['purchaseAmount_' + n] || 0,
                            startTime: fromData['startTime_' + n] || new Date().getTime(),
                            endTime: fromData['endTime_' + n] || new Date().getTime(),
                            productAmount: fromData['productAmount_' + n] || 0,
                            discount: fromData['discount_' + n] || 0,
                            currPayAmount: fromData['currPayAmount_' + n] || 0
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
                                                purchaseCount: 1,
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
                        if (controler.o_data_getField('type_' + n).is(':visible')) {
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









