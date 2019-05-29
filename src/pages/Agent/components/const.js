const USER_RULES = {
  username: [
    {
      required: true,
      min: 2,
      max: 30,
      message: '请输入2-30个字符',
    },
  ],
  password: [
    {
      required: true,
      min: 6,
      message: '不能少于6位',
    },
  ],
  name: [
    {
      required: true,
      min: 2,
      max: 30,
      message: '请输入2-30个字符',
    },
  ],
  phone: [
    {
      required: true,
      pattern: /^1[34578]\d{9}$/,
      message: '请输入正确的手机号码',
    },
  ],
  telephone: [
    {
      pattern: /[0-9-()（）]{7,18}/,
      message: '请输入正确的电话号码',
    },
  ],
  email: [
    {
      required: true,
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      message: '请输入正确的电子邮箱',
    },
  ],
  role_id: [
    {
      required: true,
      message: '请选择角色',
    },
  ],
  customer_uuid: [
    {
      required: true,
      message: '请选择客户',
    },
  ],
  unit_id: [
    {
      required: true,
      message: '请选择单位',
    },
  ],
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
  },
};

export { USER_RULES, formItemLayout };
