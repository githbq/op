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

        exports.setKaijuReadonly = function () {
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

        }
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
                    if(!contract){
                        item.visible=false;
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
                    if(contractCopy){
                        item.visible=false;
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
            }
        }
        ;

    }
)
;









