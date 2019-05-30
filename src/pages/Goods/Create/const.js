const EDITOR_RULES = {
  title: [
    {
      required: true,
      min: 6,
      max: 50,
      message: '请输入6-50个字符',
    },
  ],
  unit_ids: [
    {
      required: true,
      message: '请选择接收单位',
    },
  ],
  report_tag_id: [
    {
      required: true,
      message: '请选择报告类型',
    },
  ],
};

const VUL_TYPE = [
  'XSS',
  '弱口令',
  '文件上传',
  '信息泄露',
  '应用漏洞',
  'CSRF跨站请求伪造漏洞',
  '存在后门',
  '逻辑漏洞',
  '权限绕过',
  '任意文件操作',
  'CGI漏洞',
  '文件包含',
  '代码执行',
  '命令执行',
  'SQL注入',
  '解析漏洞',
  '表单破解漏洞',
];

const VUL_LEVEL = ['高', '中', '低'];

export { EDITOR_RULES, VUL_TYPE, VUL_LEVEL };
