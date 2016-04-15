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
            controller(dataItems, 'invoiceStatus-input', function (item) {
                item.readonly = true;
            });
            controller(dataItems, 'invoiceDate-input', function (item) {
                item.readonly = true;
            });
            controller(dataItems, 'invoiceCompany-input', function (item) {
                item.readonly = true;
            });
            controller(dataItems, 'invoiceNo-input', function (item) {
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
                controller(dataItems, 'contract', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                    }
                });
                controller(dataItems, 'contract-a', function (item) {
                    item.attr = {href: '/op/api/file/previewimage?filePath=' + item.value};
                });
                controller(dataItems, 'contractCopy', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                    }
                });
                controller(dataItems, 'contractCopy-a', function (item) {
                    item.attr = {href: '/op/api/file/previewimage?filePath=' + item.value};
                });

            }
            if (responseData.payInfo) {
                foreachSetValue(responseData.payInfo, controller, dataItems);
            }
            if (responseData.invoice) {
                foreachSetValue(responseData.invoice, controller, dataItems);
                controller(dataItems, 'businessLicense', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                    }
                });
                controller(dataItems, 'businessLicense-a', function (item) {
                    item.attr = {href: '/op/api/file/previewimage?filePath=' + item.value};
                });
                controller(dataItems, 'taxpayerQualificationFileName', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                    }
                });
                controller(dataItems, 'taxpayerQualificationFileName-a', function (item) {
                    item.attr = {href: '/op/api/file/previewimage?filePath=' + item.value};
                });
            }
        }
        ;

    }
)
;









