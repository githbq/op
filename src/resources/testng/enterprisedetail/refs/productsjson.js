define(function (require, exports, module) {
    //[{data:[],state:1,productId:11},{data:[],productId:11},{data:[],productId:11},{data:[],productId:11}]
    module.exports = {
        "products": [
            {
                "text": "CRM",
                "productId": 1
            },
            {
                "text": "CRM2",
                "productId": 11
            },
            {
                "text": "CRM3",
                "productId": 111
            },
            {
                "text": "CRM4",
                "productId": 1111
            }
        ],
        "defaultStates": [
            {
                "productId": 1,
                "state": 0
            }
        ],
        "global": {
            "enterpriseId": ""
        }
        ,
        "logics": [
            {
                "attr": {
                    "productId": 1,
                    "title": "CRM"
                },
                "data": [
                    {
                        "name": "buyType",
                        "value": 1
                    },
                    {
                        "name": "purchaseCount",
                        "value": null
                    },
                    {
                        "name": "purchaseCount_2",
                        "value": null
                    },
                    {
                        "name": "startTime",
                        "value": null
                    },
                    {
                        "name": "startTime_2",
                        "value": null
                    },
                    {
                        "name": "endTime",
                        "value": null
                    },
                    {
                        "name": "endTime_2",
                        "value": null
                    },
                    {
                        "name": "productAmount",
                        "value": null
                    },
                    {
                        "name": "productAmount_2",
                        "value": null
                    },
                    {
                        "name": "purchaseAmount",
                        "value": null
                    },
                    {
                        "name": "purchaseAmount_2",
                        "value": null
                    },
                    {
                        "name": "isSelfDev",
                        "value": null
                    },
                    {
                        "name": "partners",
                        "valueItems": null
                    },
                    {
                        "name": "sales",
                        "valueItems": null
                    },
                    {
                        "name": "discount",
                        "value": null
                    },
                    {
                        "name": "discount_2",
                        "value": null
                    }
                ],
                "baseState": [
                    {
                        "name": "buyType",
                        "groupName": "buyType",
                        "readonly": false,
                        "dataType": "radio",
                        "validate": [
                            {
                                "required": true
                            }
                        ],
                        "onchange": [
                            {
                                "type": "evaluation",
                                "valueType": "state",
                                "source": "state"
                            },
                            {
                                "type": "evaluation",
                                "valueType": "data",
                                "source": "value",
                                "valueRef": "buyType"
                            }
                        ]
                    },
                    {
                        "name": "purchaseCount",
                        "label": "本次CRM用户数",
                        "groupName": "main_1",
                        "readonly": false,
                        "dataType": "number",
                        "validate": [
                            {
                                "required": true
                            }
                        ],
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "merge"
                                }
                            }
                        ]
                    },
                    {
                        "name": "startTime",
                        "label": "开始时间",
                        "groupName": "main_1",
                        "readonly": false,
                        "dataType": "time",
                        "validate": [
                            {
                                "required": true,
                                "lessThan": {
                                    "valueType": "data",
                                    "valueRef": "endTime"
                                }
                            }
                        ],
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "merge"
                                }
                            },
                            {
                                "type": "evaluation",
                                "valueType": "data",
                                "target": "endTime",
                                "source": "value"
                            }
                        ],
                        "init": {
                            "name": "min",
                            "value": {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "enterpriseId",
                                        "valueType": "global",
                                        "valueRef": "enterpriseId"
                                    }
                                ],
                                "backName": "endTime"
                            }
                        }
                    },
                    {
                        "name": "endTime",
                        "label": "结束时间",
                        "groupName": "main_1",
                        "readonly": false,
                        "dataType": "endTime",
                        "validate": [
                            {
                                "required": true,
                                "greaterThan": {
                                    "valueType": "data",
                                    "valueRef": "startTime"
                                }
                            }
                        ],
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "merge"
                                }
                            }
                        ]
                    },
                    {
                        "name": "productAmount",
                        "label": "产品原价(元)",
                        "groupName": "main_1",
                        "readonly": true,
                        "dataType": "number"
                    },
                    {
                        "name": "purchaseAmount",
                        "label": "合同金额(元)",
                        "groupName": "main_1",
                        "readonly": false,
                        "dataType": "number",
                        "validate": [
                            {
                                "required": true
                            }
                        ],
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "merge"
                                }
                            }
                        ]
                    },
                    {
                        "name": "purchaseCount_2",
                        "label": "本次CRM用户数",
                        "groupName": "main_2",
                        "readonly": false,
                        "dataType": "number",
                        "validate": [
                            {
                                "required": true
                            }
                        ],
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount_2"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime_2"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime_2"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount_2"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "mapping",
                                    "mapper": [
                                        {
                                            "name": "productAmount",
                                            "valueType": "data",
                                            "valueRef": "productAmount_2"
                                        },
                                        {
                                            "name": "discount",
                                            "valueType": "data",
                                            "valueRef": "discount_2"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "name": "startTime_2",
                        "label": "开始时间",
                        "groupName": "main_2",
                        "readonly": true,
                        "dataType": "time",
                        "validate": {
                            "required": true,
                            "lessThan": {
                                "valueType": "data",
                                "valueRef": "endTime_2"
                            }
                        },
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount_2"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime_2"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime_2"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount_2"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "mapping",
                                    "mapper": [
                                        {
                                            "name": "productAmount",
                                            "valueType": "data",
                                            "valueRef": "productAmount_2"
                                        },
                                        {
                                            "name": "discount",
                                            "valueType": "data",
                                            "valueRef": "discount_2"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "name": "endTime_2",
                        "label": "结束时间",
                        "groupName": "main_2",
                        "readonly": true,
                        "dataType": "endTime",
                        "value": {
                            "type": "ajax",
                            "url": "",
                            "query": [
                                {
                                    "name": "productId",
                                    "valueType": "attr",
                                    "valueRef": "productId"
                                },
                                {
                                    "name": "enterpriseId",
                                    "valueType": "global",
                                    "valueRef": "enterpriseId"
                                }
                            ],
                            "backName": "startTime"
                        },
                        "validate": [
                            {
                                "required": true,
                                "greaterThan": {
                                    "valueType": "data",
                                    "valueRef": "startTime_2"
                                }
                            }
                        ],
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount_2"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime_2"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime_2"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount_2"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "mapper",
                                    "mapper": [
                                        {
                                            "name": "productAmount",
                                            "valueType": "data",
                                            "valueRef": "productAmount_2"
                                        },
                                        {
                                            "name": "discount",
                                            "valueType": "data",
                                            "valueRef": "discount_2"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "name": "productAmount_2",
                        "label": "产品原价(元)",
                        "groupName": "main_2",
                        "readonly": true,
                        "dataType": "number"
                    },
                    {
                        "name": "purchaseAmount_2",
                        "label": "合同金额(元)",
                        "groupName": "main_2",
                        "readonly": false,
                        "dataType": "number",
                        "validate": [
                            {
                                "required": true
                            }
                        ],
                        "onchange": [
                            {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "purchaseCount",
                                        "valueType": "data",
                                        "valueRef": "purchaseCount_2"
                                    },
                                    {
                                        "name": "startTime",
                                        "valueType": "data",
                                        "valueRef": "startTime_2"
                                    },
                                    {
                                        "name": "endTime",
                                        "valueType": "data",
                                        "valueRef": "endTime_2"
                                    },
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "purchaseAmount",
                                        "valueType": "data",
                                        "valueRef": "purchaseAmount_2"
                                    }
                                ],
                                "response": {
                                    "writeBackType": "mapper",
                                    "mapper": [
                                        {
                                            "name": "productAmount",
                                            "valueType": "data",
                                            "valueRef": "productAmount_2"
                                        },
                                        {
                                            "name": "discount",
                                            "valueType": "data",
                                            "valueRef": "discount_2"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        "name": "isSelfDev",
                        "label": "是否自开拓",
                        "groupName": "isSelfDev",
                        "readonly": false,
                        "dataType": "radio",
                        "items": [
                            {
                                "text": "是",
                                "value": 1,
                                "state": 1
                            },
                            {
                                "text": "否",
                                "value": 0,
                                "state": 0
                            },
                            {
                                "text": "否3",
                                "value": 3,
                                "state": 3
                            }
                        ],
                        "validate": [
                            {
                                "required": true
                            }
                        ],
                        "onchange": [
                            {
                                "type": "evaluation",
                                "valueType": "state",
                                "source": "state"
                            },
                            {
                                "type": "evaluation",
                                "valueType": "data",
                                "valueRef": "isSelfDev",
                                "source": "value"
                            }
                        ]
                    },
                    {
                        "name": "partners",
                        "label": "合作人",
                        "groupName": "partners",
                        "readonly": false,
                        "dataType": "partners",
                        "items": [],
                        "validate": [
                            {
                                "required": true
                            }
                        ]
                    },
                    {
                        "name": "sales",
                        "label": "销售姓名",
                        "groupName": "sales",
                        "readonly": false,
                        "dataType": "sales",
                        "items": [],
                        "validate": [
                            {
                                "required": true
                            }
                        ]
                    },
                    {
                        "name": "discount",
                        "label": "综合折扣",
                        "groupName": "discount",
                        "readonly": true,
                        "unit": "折",
                        "dataType": "number",
                        "validate": [
                            {
                                "required": true
                            }
                        ]
                    },
                    {
                        "name": "discount_2",
                        "label": "综合折扣2",
                        "groupName": "discount",
                        "readonly": true,
                        "unit": "折",
                        "dataType": "number",
                        "validate": [
                            {
                                "required": true
                            }
                        ]
                    }
                ],
                "currState": 0,
                "states": [
                    [
                        {
                            "name": "buyType",
                            "hidden": true
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 1
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 0
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 1
                                },
                                {
                                    "text": "不知道",
                                    "value": 3,
                                    "state": 3
                                }
                            ]
                        },
                        {
                            "name": "partners",
                            "hidden": true
                        },
                        {
                            "name": "purchaseCount_2",
                            "hidden": true
                        },
                        {
                            "name": "startTime_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime_2",
                            "hidden": true
                        },
                        {
                            "name": "productAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "purchaseAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "discount_2",
                            "hidden": true
                        }
                    ],
                    [
                        {
                            "name": "buyType",
                            "hidden": true
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 0
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 0
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 1
                                }
                            ]
                        },
                        {
                            "name": "purchaseCount_2",
                            "hidden": true
                        },
                        {
                            "name": "startTime_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime_2",
                            "hidden": true
                        },
                        {
                            "name": "productAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "purchaseAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "discount_2",
                            "hidden": true
                        }
                    ],
                    [
                        {
                            "name": "buyType",
                            "value": {
                                "type": "normal",
                                "value": 1
                            },
                            "items": [
                                {
                                    "text": "增数量以及时常",
                                    "value": 1,
                                    "state": 2
                                },
                                {
                                    "text": "仅增数量",
                                    "value": 2,
                                    "state": 4
                                },
                                {
                                    "text": "仅增时常",
                                    "value": 3,
                                    "state": 6
                                }
                            ]
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 1
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 2
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 3
                                }
                            ]
                        },
                        {
                            "name": "partners",
                            "hidden": true
                        }
                    ],
                    [
                        {
                            "name": "buyType",
                            "value": {
                                "type": "normal",
                                "value": 1
                            },
                            "items": [
                                {
                                    "text": "增数量以及时常",
                                    "value": 1,
                                    "state": 3
                                },
                                {
                                    "text": "仅增数量",
                                    "value": 2,
                                    "state": 5
                                },
                                {
                                    "text": "仅增时常",
                                    "value": 3,
                                    "state": 7
                                }
                            ]
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 0
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 2
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 3
                                }
                            ]
                        }
                    ],
                    [
                        {
                            "name": "buyType",
                            "value": {
                                "type": "normal",
                                "value": 2
                            },
                            "items": [
                                {
                                    "text": "增数量以及时常",
                                    "value": 1,
                                    "state": 2
                                },
                                {
                                    "text": "仅增数量",
                                    "value": 2,
                                    "state": 4
                                },
                                {
                                    "text": "仅增时常",
                                    "value": 3,
                                    "state": 6
                                }
                            ]
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 1
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 4
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 5
                                }
                            ]
                        },
                        {
                            "name": "partners",
                            "hidden": true
                        },
                        {
                            "name": "purchaseCount_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime",
                            "readonly": true,
                            "value": {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "enterpriseId",
                                        "valueType": "global",
                                        "valueRef": "enterpriseId"
                                    }
                                ],
                                "backName": "endTime"
                            }
                        },
                        {
                            "name": "startTime_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime_2",
                            "hidden": true
                        },
                        {
                            "name": "productAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "purchaseAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "discount_2",
                            "hidden": true
                        }
                    ],
                    [
                        {
                            "name": "buyType",
                            "value": {
                                "type": "normal",
                                "value": 2
                            },
                            "items": [
                                {
                                    "text": "增数量以及时常",
                                    "value": 1,
                                    "state": 3
                                },
                                {
                                    "text": "仅增数量",
                                    "value": 2,
                                    "state": 5
                                },
                                {
                                    "text": "仅增时常",
                                    "value": 3,
                                    "state": 7
                                }
                            ]
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 0
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 4
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 5
                                }
                            ]
                        },
                        {
                            "name": "purchaseCount_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime",
                            "readonly": true,
                            "value": {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "enterpriseId",
                                        "valueType": "global",
                                        "valueRef": "enterpriseId"
                                    }
                                ],
                                "backName": "endTime"
                            }
                        },
                        {
                            "name": "startTime_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime_2",
                            "hidden": true
                        },
                        {
                            "name": "productAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "purchaseAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "discount_2",
                            "hidden": true
                        }
                    ],
                    [
                        {
                            "name": "buyType",
                            "value": {
                                "type": "normal",
                                "value": 3
                            },
                            "items": [
                                {
                                    "text": "增数量以及时常",
                                    "value": 1,
                                    "state": 2
                                },
                                {
                                    "text": "仅增数量",
                                    "value": 2,
                                    "state": 4
                                },
                                {
                                    "text": "仅增时常",
                                    "value": 3,
                                    "state": 6
                                }
                            ]
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 1
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 6
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 7
                                }
                            ]
                        },
                        {
                            "name": "partners",
                            "hidden": true
                        },
                        {
                            "name": "purchaseCount_2",
                            "hidden": true
                        },
                        {
                            "name": "startTime",
                            "readonly": true,
                            "value": {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "enterpriseId",
                                        "valueType": "global",
                                        "valueRef": "enterpriseId"
                                    }
                                ],
                                "backName": "startTime"
                            }
                        },
                        {
                            "name": "startTime_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime_2",
                            "hidden": true
                        },
                        {
                            "name": "productAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "purchaseAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "discount_2",
                            "hidden": true
                        }
                    ],
                    [
                        {
                            "name": "buyType",
                            "value": {
                                "type": "normal",
                                "value": 3
                            },
                            "items": [
                                {
                                    "text": "增数量以及时常",
                                    "value": 1,
                                    "state": 3
                                },
                                {
                                    "text": "仅增数量",
                                    "value": 2,
                                    "state": 5
                                },
                                {
                                    "text": "仅增时常",
                                    "value": 3,
                                    "state": 7
                                }
                            ]
                        },
                        {
                            "name": "isSelfDev",
                            "value": {
                                "type": "normal",
                                "value": 0
                            },
                            "items": [
                                {
                                    "text": "是",
                                    "value": 1,
                                    "state": 6
                                },
                                {
                                    "text": "否",
                                    "value": 0,
                                    "state": 7
                                }
                            ]
                        },
                        {
                            "name": "purchaseCount_2",
                            "hidden": true
                        },
                        {
                            "name": "startTime",
                            "readonly": true,
                            "value": {
                                "type": "ajax",
                                "url": "",
                                "query": [
                                    {
                                        "name": "productId",
                                        "valueType": "attr",
                                        "valueRef": "productId"
                                    },
                                    {
                                        "name": "enterpriseId",
                                        "valueType": "global",
                                        "valueRef": "enterpriseId"
                                    }
                                ],
                                "backName": "startTime"
                            }
                        },
                        {
                            "name": "startTime_2",
                            "hidden": true
                        },
                        {
                            "name": "endTime_2",
                            "hidden": true
                        },
                        {
                            "name": "productAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "purchaseAmount_2",
                            "hidden": true
                        },
                        {
                            "name": "discount_2",
                            "hidden": true
                        }
                    ]
                ]
            }
        ]
    };
});