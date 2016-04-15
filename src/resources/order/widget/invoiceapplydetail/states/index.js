define(function (require, exports, module) {
        function foreachSetValue(obj, controller, dataItems) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    controller(dataItems, i, function (item) {
                        item.value = obj[i];
                    });
                }
            }
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
                controller(dataItems, 'businessLicenseFileName', function (item) {
                    if (item.value) {
                        item.attr = {src: '/op/api/file/previewimage?filePath=' + item.value};
                    }
                });
                controller(dataItems, 'businessLicenseFileName-a', function (item) {
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









