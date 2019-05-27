## 表单型Modal组件API

### formModalProps



| 参数           | 说明                        | 类型    | 默认值 | 是否必填 |
| -------------- | --------------------------- | ------- | ------ | -------- |
| visible        | 控制modal的显隐性           | Boolean | false  | 是       |
| title          | modal 的标题                | String  |        |          |
| confirmLoading | Modal 请求状态              | Boolean | false  |          |
| modalType      | Modal 的类型，create/update | String  |        |          |
| currentItem    | 修改列的值（仅修改时用）    | Object  |        |          |
| onOk           | 添加或修改的回调            | Fun     |        | 是       |
| onCancel       | Modal取消的回调             | Fun     |        | 是       |
| formFields    | 项列表配置,详细配置见下     | Array   |        | 是       |

### FormFields

| 参数             | 说明                                                         | 类型    | 默认值 | 必填 |
| ---------------- | ------------------------------------------------------------ | ------- | ------ | ---- |
| type             | 输入框类型： input，number，select，areaCascader（区域三级联动） | String  | input  | 是   |
| inputProps       | 输入框的基本属性设置                                         | Object  |        | 否   |
| name             | 输入框对应的key                                              | String  |        | 是   |
| label            | 输入框对应的label                                            | String  |        | 是   |
| decoratorOptions | 对应from装饰器的配置项，可配置rules，initialValue等          | Object  |        | 否   |
| options          | 只针对type为select时option列表，eg: [{label: '测试', value: 'test'}] | Array   |        |      |
| editedIsHide     | 修改状态时是否允许展示                                       | Boolean | false  |      |
| unallowedEditer  | 修改状态时，允许展示但不允许编辑                             | Boolean | false  |      |

### 示例

```
const modalFields = [
  {
    type: 'input',
    label: '名称',
    name: 'name',
    inputProps: {
      placeholder: '请输入单位名称...',
    },
    decoratorOptions: {
      rules: [{
        required: true,
        min: 2,
        max: 30,
        message: '请输入2-30个字符',
      }],
    },
  },
  {
    type: 'areaCascader',
    label: '地区',
    name: 'region_code',
    inputProps: {
      placeholder: '请输入...',
      options: district,
    },
    decoratorOptions: {
      rules: [{
        required: true,
        message: '请选择单位所在地区',
      }],
    },
  },
  {
    type: 'input',
    label: '详细地址',
    name: 'address',
    inputProps: {
      placeholder: '请输入...',
    },
    decoratorOptions: {
      rules: [{
        min: 2,
        max: 100,
        message: '请输入2-100个字符',
      }],
    },
  },
  {
    type: 'input',
    label: '联系人',
    name: 'contact',
    inputProps: {
      placeholder: '请输入...',
    },
    decoratorOptions: {
      rules: [{
        min: 2,
        max: 100,
        message: '请输入2-100个字符',
      }],
    },
  },
  {
    type: 'input',
    label: '联系电话',
    name: 'phone',
    inputProps: {
      placeholder: '请输入...',
    },
    decoratorOptions: {
      rules: [{
        pattern: /^1[34578]\d{9}$/,
        message: '请输入正确的手机号码',
      }],
    },
  },
  {
    type: 'textarea',
    label: '备注',
    name: 'remark',
    inputProps: {
      placeholder: '请输入...',
      rows: 3,
      style: { minHeight: 32 },
    },
    decoratorOptions: {
      rules: [{
        min: 2,
        max: 100,
        message: '请输入2-100个字符',
      }],
    },
  },
]
```
