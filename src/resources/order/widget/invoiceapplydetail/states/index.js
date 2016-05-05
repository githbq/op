define(function (require, exports, module) {
        var enums = {};
        enums.invoiceProp = {'1': '到款开票', '2': '预开发票'};
        enums.invoiceType = {'1': '普通增值税发票', '2': '增值税专用发票'};
        enums.payStatus = {'1': '全额', '2': '分期', '3': '未付'};
        function foreachSetValue(obj, controller, dataItems) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    controller(dataItems, i, function (item) {
                        if (enums[i]) {
                            item.id = obj[i];
                            item.value = enums[i][obj[i]];
                        } else {
                            item.value = obj[i];
                        }
                    });
                }
            }

        }

        function getRejectReason(rejectReason) {
            var opinionObj = {'support': '小助手开通', 'support2': '小助手确认', 'finance': '财务', 'sup': '小助手'};
            var personStr = "support,support2,finance,sup";
            var strDom = '';
            var optionsList = rejectReason ? rejectReason.split('<+>') : [];
            for (var i = 0; i < optionsList.length; i++) {
                var tempAry = optionsList[i].split('<->');
                if (personStr.indexOf(tempAry[0]) > -1) {
                    tempAry[0] = opinionObj[tempAry[0]];
                }
                tempAry[2] = (tempAry[2] == 'true') ? '同意' : '驳回';
                strDom += '<tr><td>' + tempAry[0] + '</td><td>' + tempAry[1] + '</td><td>' + tempAry[2] + '</td><td>' + tempAry[3] + '</td><td></td></tr>'
            }
            return strDom;
        }

        exports.setKaijuReadonly = function (dataItems, controller, responseData, type) {
            controller(dataItems, 'invoiceStatus', function (item) {
                item.readonly = true;
            });
            controller(dataItems, 'invoiceDate', function (item) {
                item.readonly = true;
            });
            controller(dataItems, 'invoiceCompany', function (item) {
                item.readonly = true;
            });
            controller(dataItems, 'invoiceNo', function (item) {
                item.readonly = true;
            });
            controller(dataItems, 'comment', function (item) {
                item.visible = false;
            });
            controller(dataItems, 'save', function (item) {
                item.visible = false;
            });
        };
        exports.setCommonData = function (dataItems, controller, responseData, type) {
            if (!responseData) {
                return;
            }
            controller(dataItems, 'invoiceId', function (item) {
                item.value = responseData.invoiceId;
            });
            controller(dataItems, 'processInstanceId', function (item) {
                item.value = responseData.processInstanceId;
            });
            if (responseData.order) {
                foreachSetValue(responseData.order, controller, dataItems);
            }
            if (responseData.contract) {
                foreachSetValue(responseData.contract, controller, dataItems);
                var contract = '';
                controller(dataItems, 'contract', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                        contract = item.attr.src;
                    }
                });

                controller(dataItems, 'contract-a', function (item) {
                    if (!contract) {
                        item.visible = false;
                    }
                    item.attr = {href: contract};

                });
                var contractCopy = '';
                controller(dataItems, 'contractCopy', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                        contractCopy = item.attr.src;
                    }
                });
                controller(dataItems, 'contractCopy-a', function (item) {
                    if (!contractCopy) {
                        item.visible = false;
                    }
                    item.attr = {href: contractCopy};
                });

            }
            if (responseData.payInfo) {
                foreachSetValue(responseData.payInfo, controller, dataItems);
            }
            if (responseData.invoice) {
                foreachSetValue(responseData.invoice, controller, dataItems);
                var businessLicense = '';
                controller(dataItems, 'approvalUrl', function (item) {
                    debugger
                    if (responseData.invoice.approvalUrl) {
						if(responseData.invoice.approvalUrl.indexOf('http://')>-1){
							item.value = responseData.invoice.approvalUrl;
						}else{
							item.value = 'http://'+responseData.invoice.approvalUrl;
						}
                        //item.value = responseData.invoice.approvalUrl;
                        item.attr = {href: item.value};
                    }else{
                        item.visible=false;
                    }
                });
                controller(dataItems, 'businessLicense', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                        businessLicense = item.attr.src;
                    }
                });
                controller(dataItems, 'businessLicense-a', function (item) {
                    if (!businessLicense) {
                        item.visible = false;
                    }
                    item.attr = {href: businessLicense};
                });
                var taxpayerQualification = '';
                controller(dataItems, 'taxpayerQualification', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                        taxpayerQualification = item.attr.src;
                    }
                });
                controller(dataItems, 'taxpayerQualification-a', function (item) {
                    if (!taxpayerQualification) {
                        item.visible = false;
                    }
                    item.attr = {href: taxpayerQualification};
                });


                controller(dataItems, 'rejectReason', function (item) {
                    item.value = getRejectReason(responseData.invoice.rejectReason);
                });


            }
        }
        ;

    }
)
;









