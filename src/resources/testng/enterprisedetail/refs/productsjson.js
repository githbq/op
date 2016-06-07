define(function (require, exports, module) {
    module.exports = [{
        "attr": [
            {
                "name": "productId",
                "value": 1
            }
        ],
        "ajaxLogic": {
            "ajaxList": [
                {
                    "id": "getQuotaTime",
                    "url": "getQuotaTime",
                    "params": [
                        {
                            "dataType": "global",
                            "name": "enterpriseAccount",
                            "asName": "enterpriseAccount"
                        },
                        {
                            "dataType": "attr",
                            "name": "productId",
                            "asName": "productId"
                        }
                    ],
                    "response": {
                        "events": [
                            {
                                "name": "",
                                "type": "value",
                                "value": 1,
                                "groupName": ""
                            },
                            {
                                "name": "",
                                "type": "action",
                                "value": "blur",
                                "groupName": ""
                            }
                        ],
                        "return": [
                            {
                                "name": "startTime",
                                "toName": "endTime",
                                "groupName": "main_5"
                            }
                        ]
                    }
                }
            ]
        },
        "groups": [
            {
                "name": "buyType",
                "type": "attr",
                "border": false,
                "fields": [
                    {
                        "name": "buyType",
                        "type": "radio",
                        "value": 2,
                        "items": [
                            {
                                "text": "增数量以及时长",
                                "value": 1
                            },
                            {
                                "text": "仅增数量",
                                "value": 2
                            },
                            {
                                "text": "近增时长",
                                "value": 3
                            }
                        ]
                    }
                ],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "key",
                            "valueCompare": {
                                "name": "isNewBuy",
                                "value": 0
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "main_1",
                "type": "main",
                "border": false,
                "fields": [
                    {
                        "name": "purchaseCount",
                        "value": "",
                        "text": "本次CRM用户数",
                        "type": "input",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "startTime",
                        "value": "",
                        "text": "开始时间",
                        "type": "inputTime",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "endTime",
                        "value": "",
                        "text": "结束时间",
                        "type": "inputTime",
                        "required": true,
                        "readonly": true
                    },
                    {
                        "name": "productAmount",
                        "value": "",
                        "text": "产品原价(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    },
                    {
                        "name": "purchaseAmount",
                        "value": "",
                        "text": "合同金额(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    }
                ],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "key",
                            "valueCompare": {
                                "name": "isNewBuy",
                                "value": 1
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "main_2",
                "type": "main",
                "border": false,
                "fields": [
                    {
                        "name": "purchaseCount",
                        "value": "",
                        "text": "本次CRM用户数",
                        "type": "input",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "startTime",
                        "value": "",
                        "text": "开始时间",
                        "type": "inputTime",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "endTime",
                        "value": "",
                        "text": "结束时间",
                        "type": "inputTime",
                        "required": true,
                        "readonly": true
                    },
                    {
                        "name": "productAmount",
                        "value": "",
                        "text": "产品原价(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    },
                    {
                        "name": "purchaseAmount",
                        "value": "",
                        "text": "合同金额(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    }
                ],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "key",
                            "valueCompare": {
                                "name": "isNewBuy",
                                "value": 0
                            }
                        },
                        {
                            "dataType": "name",
                            "groupName": "buyType",
                            "valueCompare": {
                                "name": "buyType",
                                "value": 1
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "main_3",
                "type": "main",
                "border": false,
                "fields": [
                    {
                        "name": "purchaseCount",
                        "value": "",
                        "text": "本次CRM用户数",
                        "type": "input",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "startTime",
                        "value": "",
                        "text": "开始时间",
                        "type": "inputTime",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "endTime",
                        "value": "",
                        "text": "结束时间",
                        "type": "text",
                        "required": true,
                        "readonly": true
                    },
                    {
                        "name": "productAmount",
                        "value": "",
                        "text": "产品原价(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    },
                    {
                        "name": "purchaseAmount",
                        "value": "",
                        "text": "合同金额(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    }
                ],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "key",
                            "valueCompare": {
                                "name": "isNewBuy",
                                "value": 0
                            }
                        },
                        {
                            "dataType": "name",
                            "groupName": "buyType",
                            "valueCompare": {
                                "name": "buyType",
                                "value": 2
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "main_4",
                "type": "main",
                "border": false,
                "fields": [
                    {
                        "name": "purchaseCount",
                        "value": "",
                        "text": "本次CRM用户数",
                        "type": "input",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "startTime",
                        "value": "",
                        "text": "开始时间",
                        "type": "text",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "endTime",
                        "value": "",
                        "text": "结束时间",
                        "type": "inputTime",
                        "required": true,
                        "readonly": true
                    },
                    {
                        "name": "productAmount",
                        "value": "",
                        "text": "产品原价(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    },
                    {
                        "name": "purchaseAmount",
                        "value": "",
                        "text": "合同金额(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    }
                ],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "key",
                            "valueCompare": {
                                "name": "isNewBuy",
                                "value": 0
                            }
                        },
                        {
                            "dataType": "name",
                            "groupName": "buyType",
                            "valueCompare": {
                                "name": "buyType",
                                "value": 3
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "main_5",
                "type": "main",
                "border": true,
                "fields": [
                    {
                        "name": "purchaseCount",
                        "value": "",
                        "text": "本次CRM用户数",
                        "type": "text",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "startTime",
                        "value": "",
                        "text": "开始时间",
                        "type": "text",
                        "readonly": true,
                        "required": true
                    },
                    {
                        "name": "endTime",
                        "value": "",
                        "text": "结束时间",
                        "type": "text",
                        "required": true,
                        "readonly": true
                    },
                    {
                        "name": "productAmount",
                        "value": "",
                        "text": "产品原价(元)",
                        "type": "text",
                        "required": true,
                        "readonly": true
                    },
                    {
                        "name": "purchaseAmount",
                        "value": "",
                        "text": "合同金额(元)",
                        "type": "text",
                        "required": false,
                        "readonly": true
                    }
                ],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "key",
                            "valueCompare": {
                                "name": "isNewBuy",
                                "value": 0
                            }
                        },
                        {
                            "dataType": "name",
                            "groupName": "buyType",
                            "valueCompare": {
                                "name": "buyType",
                                "value": 1
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "isSelfDev",
                "type": "attr",
                "border": false,
                "fields": [
                    {
                        "name": "isSelfDev",
                        "type": "radio",
                        "value": 2,
                        "items": [
                            {
                                "text": "是",
                                "value": 1
                            },
                            {
                                "text": "否",
                                "value": 2
                            }
                        ]
                    }
                ],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "attr",
                            "valueCompare": {
                                "name": "productId",
                                "value": 1
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "partner",
                "type": "attr",
                "fields": [],
                "displayLogics": {
                    "conditions": [
                        {
                            "dataType": "name",
                            "groupName": "isSelfDev",
                            "valueCompare": {
                                "name": "isSelfDev",
                                "value": 1
                            }
                        }
                    ],
                    "result": false
                }
            },
            {
                "name": "sales",
                "type": "attr",
                "fields": [],
                "displayLogics": {
                    "result": true
                }
            },
            {
                "name": "discount",
                "type": "attr",
                "fields": [
                    {
                        "name": "discount",
                        "value": "",
                        "text": "综合折扣",
                        "type": "text",
                        "readonly": true,
                        "required": false
                    }
                ],
                "displayLogics": {
                    "result": true
                }
            }
        ]
    }];


});