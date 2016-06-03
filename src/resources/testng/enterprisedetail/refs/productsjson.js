define(function (require, exports, module) {
    exports = [
        {
            "title": "销客终端",
            "value": 2,
            "name": "productId",
            "groups": [
                {
                    "content": [
                        {
                            "title": "销客终端用户数",
                            "element": "input",
                            "type": "text",
                            "name": "pkNumber",
                            "validate": {
                                "required": true,
                                "digits": true
                            }
                        },
                        {
                            "title": "开始时间",
                            "element": "input",
                            "type": "time",
                            "name": "startTime",
                            "validate": {
                                "required": true,
                                "date": true
                            }
                        },
                        {
                            "title": "结束时间",
                            "element": "input",
                            "type": "time",
                            "name": "endTime",
                            "validate": {
                                "required": true,
                                "date": true,
                                "greater_than_name": "startTime"
                            }
                        },
                        {
                            "title": "产品原价（元）：",
                            "element": "span",
                            "name": "productPrice"
                        },
                        {
                            "title": "合同金额（元）",
                            "element": "input",
                            "type": "text",
                            "name": "amount",
                            "validate": {
                                "required": true,
                                "bigDecimal": true
                            }
                        }
                    ]
                },
                {
                    "content": [
                        {
                            "title": "是否自开拓",
                            "element": "input",
                            "type": "radio",
                            "name": "isSelfDev",
                            "value": 1,
                            "items": [
                                {
                                    "title": "是",
                                    "value": 1
                                },
                                {
                                    "title": "否",
                                    "value": 0
                                }
                            ]
                        },
                        {
                            "display": [
                                {
                                    "name": "isSelfDev",
                                    "value": "0"
                                }
                            ],
                            "title": "合作人",
                            "element": "partners"
                        },
                        {
                            "title": "销售姓名",
                            "element": "salesmen"
                        }
                    ]
                },
                {
                    "content": [
                        {
                            "title": "综合折扣",
                            "element": "discountor"
                        }
                    ]
                },
                {
                    "display": {
                        "depend_key": [
                            {
                                "name": "isNewBuy",
                                "value": "0"
                            }
                        ],
                        "depend_name": [
                            {
                                "name": "buyType",
                                "value": "1"
                            }
                        ]
                    },
                    "content": [
                        {
                            "element": "input",
                            "type": "radio",
                            "name": "buyType",
                            "value": 1,
                            "items": [
                                {
                                    "title": "增数量以及时长",
                                    "value": 1
                                },
                                {
                                    "title": "仅增数量",
                                    "value": 2
                                },
                                {
                                    "title": "仅增时长",
                                    "value": 3
                                }
                            ]
                        },
                        {
                            "title": "本次增购CRM用户数",
                            "element": "input",
                            "type": "text",
                            "name": "pkNumber",
                            "validate": {
                                "required": true,
                                "digits": true
                            }
                        },
                        {
                            "title": "开始时间",
                            "element": "input",
                            "type": "time",
                            "name": "startTime",
                            "validate": {
                                "required": true,
                                "date": true
                            }
                        },
                        {
                            "title": "结束时间",
                            "element": "input",
                            "type": "time",
                            "name": "endTime",
                            "validate": {
                                "required": true,
                                "date": true,
                                "greater_than_name": "startTime"
                            }
                        },
                        {
                            "title": "产品原价（元）：",
                            "element": "span",
                            "name": "productPrice"
                        },
                        {
                            "title": "合同金额（元）",
                            "element": "input",
                            "type": "text",
                            "name": "amount",
                            "validate": {
                                "required": true,
                                "bigDecimal": true
                            }
                        },
                        {
                            "element": "completor"
                        }
                    ]
                },
                {
                    "display": {
                        "depend_key": [
                            {
                                "name": "isNewBuy",
                                "value": "0"
                            }
                        ],
                        "depend_name": [
                            {
                                "name": "buyType",
                                "value": "2"
                            }
                        ]
                    },
                    "content": [
                        {
                            "element": "input",
                            "type": "radio",
                            "name": "buyType",
                            "value": 2,
                            "items": [
                                {
                                    "title": "增数量以及时长",
                                    "value": 1
                                },
                                {
                                    "title": "仅增数量",
                                    "value": 2
                                },
                                {
                                    "title": "仅增时长",
                                    "value": 3
                                }
                            ]
                        },
                        {
                            "title": "本次增购CRM用户数",
                            "element": "input",
                            "type": "text",
                            "name": "pkNumber",
                            "validate": {
                                "required": true,
                                "digits": true
                            }
                        },
                        {
                            "title": "开始时间",
                            "element": "input",
                            "type": "time",
                            "name": "startTime",
                            "validate": {
                                "required": true,
                                "date": true
                            }
                        },
                        {
                            "title": "结束时间",
                            "element": "input",
                            "type": "text",
                            "name": "endTime",
                            "readonly": true,
                            "validate": {
                                "required": true,
                                "date": true,
                                "greater_than_name": "startTime"
                            }
                        },
                        {
                            "title": "产品原价（元）：",
                            "element": "span",
                            "name": "productPrice"
                        },
                        {
                            "title": "合同金额（元）",
                            "element": "input",
                            "type": "text",
                            "name": "amount",
                            "validate": {
                                "required": true,
                                "bigDecimal": true
                            }
                        }
                    ]
                },
                {
                    "display": [
                        {
                            "key": "isNewBuy",
                            "value": "0"
                        },
                        {
                            "name": "buyType",
                            "value": "3"
                        }
                    ],
                    "content": [
                        {
                            "element": "input",
                            "type": "radio",
                            "name": "buyType",
                            "value": 3,
                            "items": [
                                {
                                    "title": "增数量以及时长",
                                    "value": 1
                                },
                                {
                                    "title": "仅增数量",
                                    "value": 2
                                },
                                {
                                    "title": "仅增时长",
                                    "value": 3
                                }
                            ]
                        },
                        {
                            "title": "本次增时长CRM用户数",
                            "element": "input",
                            "type": "text",
                            "name": "pkNumber",
                            "depend_key": "pkNumber",
                            "validate": {
                                "required": true,
                                "digits": true,
                                "less_than_key": "pkNumber"
                            }
                        },
                        {
                            "title": "开始时间",
                            "element": "input",
                            "type": "time",
                            "name": "startTime",
                            "readnoly": true,
                            "depend_key": "endDate",
                            "validate": {
                                "required": true,
                                "date": true
                            }
                        },
                        {
                            "title": "结束时间",
                            "element": "input",
                            "type": "time",
                            "name": "endTime",
                            "readonly": true,
                            "validate": {
                                "required": true,
                                "date": true,
                                "greater_than_name": "startTime"
                            }
                        },
                        {
                            "title": "产品原价（元）：",
                            "element": "span",
                            "name": "productPrice"
                        },
                        {
                            "title": "合同金额（元）",
                            "element": "input",
                            "type": "text",
                            "name": "amount",
                            "validate": {
                                "required": true,
                                "bigDecimal": true
                            }
                        }
                    ]
                }
            ]
        }
        ,{
        "title": "CRM",
        "value": 1,
        "name": "productId",
        "groups": [
            {
                "content": [
                    {
                        "title": "CRM用户数",
                        "element": "input",
                        "type": "text",
                        "name": "pkNumber",
                        "validate": {
                            "required": true,
                            "digits": true
                        }
                    },
                    {
                        "title": "开始时间",
                        "element": "input",
                        "type": "time",
                        "name": "startTime",
                        "validate": {
                            "required": true,
                            "date": true
                        }
                    },
                    {
                        "title": "结束时间",
                        "element": "input",
                        "type": "time",
                        "name": "endTime",
                        "validate": {
                            "required": true,
                            "date": true,
                            "greater_than_name": "startTime"
                        }
                    },
                    {
                        "title": "产品原价（元）：",
                        "element": "span",
                        "name": "productPrice"
                    },
                    {
                        "title": "合同金额（元）",
                        "element": "input",
                        "type": "text",
                        "name": "amount",
                        "validate": {
                            "required": true,
                            "bigDecimal": true
                        }
                    }
                ]
            },
            {
                "content": [
                    {
                        "title": "是否自开拓",
                        "element": "input",
                        "type": "radio",
                        "name": "isSelfDev",
                        "value": 1,
                        "items": [
                            {
                                "title": "是",
                                "value": 1
                            },
                            {
                                "title": "否",
                                "value": 0
                            }
                        ]
                    },
                    {
                        "display": [
                            {
                                "name": "isSelfDev",
                                "value": "0"
                            }
                        ],
                        "title": "合作人",
                        "element": "partners"
                    },
                    {
                        "title": "销售姓名",
                        "element": "salesmen"
                    }
                ]
            },
            {
                "content": [
                    {
                        "title": "综合折扣",
                        "element": "discountor"
                    }
                ]
            },
            {
                "display": {
                    "depend_key": [
                        {
                            "name": "isNewBuy",
                            "value": "0"
                        }
                    ],
                    "depend_name": [
                        {
                            "name": "buyType",
                            "value": "1"
                        }
                    ]
                },
                "content": [
                    {
                        "element": "input",
                        "type": "radio",
                        "name": "buyType",
                        "value": 1,
                        "items": [
                            {
                                "title": "增数量以及时长",
                                "value": 1
                            },
                            {
                                "title": "仅增数量",
                                "value": 2
                            },
                            {
                                "title": "仅增时长",
                                "value": 3
                            }
                        ]
                    },
                    {
                        "title": "本次增购CRM用户数",
                        "element": "input",
                        "type": "text",
                        "name": "pkNumber",
                        "validate": {
                            "required": true,
                            "digits": true
                        }
                    },
                    {
                        "title": "开始时间",
                        "element": "input",
                        "type": "time",
                        "name": "startTime",
                        "validate": {
                            "required": true,
                            "date": true
                        }
                    },
                    {
                        "title": "结束时间",
                        "element": "input",
                        "type": "time",
                        "name": "endTime",
                        "validate": {
                            "required": true,
                            "date": true,
                            "greater_than_name": "startTime"
                        }
                    },
                    {
                        "title": "产品原价（元）：",
                        "element": "span",
                        "name": "productPrice"
                    },
                    {
                        "title": "合同金额（元）",
                        "element": "input",
                        "type": "text",
                        "name": "amount",
                        "validate": {
                            "required": true,
                            "bigDecimal": true
                        }
                    },
                    {
                        "element": "completor"
                    }
                ]
            },
            {
                "display": {
                    "depend_key": [
                        {
                            "name": "isNewBuy",
                            "value": "0"
                        }
                    ],
                    "depend_name": [
                        {
                            "name": "buyType",
                            "value": "2"
                        }
                    ]
                },
                "content": [
                    {
                        "element": "input",
                        "type": "radio",
                        "name": "buyType",
                        "value": 2,
                        "items": [
                            {
                                "title": "增数量以及时长",
                                "value": 1
                            },
                            {
                                "title": "仅增数量",
                                "value": 2
                            },
                            {
                                "title": "仅增时长",
                                "value": 3
                            }
                        ]
                    },
                    {
                        "title": "本次增购CRM用户数",
                        "element": "input",
                        "type": "text",
                        "name": "pkNumber",
                        "validate": {
                            "required": true,
                            "digits": true
                        }
                    },
                    {
                        "title": "开始时间",
                        "element": "input",
                        "type": "time",
                        "name": "startTime",
                        "validate": {
                            "required": true,
                            "date": true
                        }
                    },
                    {
                        "title": "结束时间",
                        "element": "input",
                        "type": "text",
                        "name": "endTime",
                        "readonly": true,
                        "validate": {
                            "required": true,
                            "date": true,
                            "greater_than_name": "startTime"
                        }
                    },
                    {
                        "title": "产品原价（元）：",
                        "element": "span",
                        "name": "productPrice"
                    },
                    {
                        "title": "合同金额（元）",
                        "element": "input",
                        "type": "text",
                        "name": "amount",
                        "validate": {
                            "required": true,
                            "bigDecimal": true
                        }
                    }
                ]
            },
            {
                "display": [
                    {
                        "key": "isNewBuy",
                        "value": "0"
                    },
                    {
                        "name": "buyType",
                        "value": "3"
                    }
                ],
                "content": [
                    {
                        "element": "input",
                        "type": "radio",
                        "name": "buyType",
                        "value": 3,
                        "items": [
                            {
                                "title": "增数量以及时长",
                                "value": 1
                            },
                            {
                                "title": "仅增数量",
                                "value": 2
                            },
                            {
                                "title": "仅增时长",
                                "value": 3
                            }
                        ]
                    },
                    {
                        "title": "本次增时长CRM用户数",
                        "element": "input",
                        "type": "text",
                        "name": "pkNumber",
                        "depend_key": "pkNumber",
                        "validate": {
                            "required": true,
                            "digits": true,
                            "less_than_key": "pkNumber"
                        }
                    },
                    {
                        "title": "开始时间",
                        "element": "input",
                        "type": "time",
                        "name": "startTime",
                        "readnoly": true,
                        "depend_key": "endDate",
                        "validate": {
                            "required": true,
                            "date": true
                        }
                    },
                    {
                        "title": "结束时间",
                        "element": "input",
                        "type": "time",
                        "name": "endTime",
                        "readonly": true,
                        "validate": {
                            "required": true,
                            "date": true,
                            "greater_than_name": "startTime"
                        }
                    },
                    {
                        "title": "产品原价（元）：",
                        "element": "span",
                        "name": "productPrice"
                    },
                    {
                        "title": "合同金额（元）",
                        "element": "input",
                        "type": "text",
                        "name": "amount",
                        "validate": {
                            "required": true,
                            "bigDecimal": true
                        }
                    }
                ]
            }
        ]
    }
    ]


});