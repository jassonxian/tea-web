## 高级搜索组件API

### AdvancedSearchProps

| 参数         | 说明                         | 类型   | 默认值 |
| :----------- | :--------------------------- | :----- | :----- |
| filter       | 存储搜索参数（用于数据回填） | Object | {}     |
| onOk         | 执行搜索                     | Fun    |        |
| onReset      | 重置搜索状态                 | Fun    |        |
| searchFields | 搜索项列表配置,详细配置见下  | Array  | []     |

### 对单个搜索项

### SearchField

| 参数             | 说明                                                         | 类型   | 默认值 | 必填 |
| ---------------- | ------------------------------------------------------------ | ------ | ------ | ---- |
| type             | 输入框类型： input，number，select，time（单个时间）,range(时间段) | String | input  | 是   |
| inputProps       | 输入框的基本属性设置                                         | Object |        | 否   |
| name             | 输入框对应的key                                              | String |        | 是   |
| label            | 输入框对应的label                                            | String |        | 是   |
| decoratorOptions | 对应from装饰器的配置项，可配置rules，initialValue等          | Object |        | 否   |
| options          | 只针对type为select时option列表，eg: [{label: '测试', value: 'test'}] | Array  |        |      |

###  示例

```javascript
searchFields: [
      {
        type: 'input',
        label: '短文本',
        name: 'shortText',
        decoratorOptions: {
          rules: [{ required: true, message: 'Please select your gender!' }],
        },
        inputProps: {
          placeholder: '短文本',
        },
      },
      {
        label: '长文本输入框',
        type: 'input',
        name: 'longText',
        decoratorOptions: {
          // initialValue: filter.longText,
        },
        inputProps: {
          placeholder: '长文本输入框',
        },
      },
      {
        label: '数字',
        type: 'number',
        name: 'number',
        inputProps: {
          placeholder: '数字',
        },
      },
      {
        label: '带步长的数字',
        type: 'number',
        name: 'stepNumber',
        inputProps: {
          min: 5,
          step: 5,
          placeholder: '带步长的数字',
        },
      },
      {
        label: '初始化选项',
        type: 'select',
        name: 'select',
        options: [
          {
            label: '执行中',
            value: 'active',
          },
          {
            label: '已暂停',
            value: 'paused',
          },
          {
            label: '已完成',
            value: 'finished',
          },
          {
            label: '删除中',
            value: 'error',
          },
        ],
        inputProps: {
          placeholder: '请选择',
        },
      },
      {
        label: '时间点',
        type: 'time',
        name: 'time',
        inputProps: {
          format: 'YYYY-MM-DD HH:mm',
          placeholder: '选择时间',
        },
      },
      {
        label: '时间段',
        type: 'range',
        name: 'range',
        inputProps: {
          format: 'YYYY-MM-DD HH:mm',
          placeholder: ['开始时间', '结束时间'],
        },
      },
    ];
```





