const EDITOR_RULES = {
  goods_name: [
    {
      required: true,
      min: 1,
      max: 50,
      message: '请输入1-50个字符',
    },
  ],
  category_id: [
    {
      required: true,
      message: '请选择商品类别',
    },
  ],
  brand_id: [
    {
      required: true,
      message: '请选择商品品牌',
    },
  ],
  freight: [
    {
      required: true,
      message: '请输入邮费',
    },
  ],
  count: [
    {
      required: true,
      message: '请输入总数',
    },
  ],
  price: [
    {
      required: true,
      message: '请输入价格',
    },
  ],
  goods_picture: [
    {
      required: true,
      message: '请选择图片',
    },
  ],
  template_picture: [
    {
      required: true,
      message: '请选择图片',
    },
  ],
};

export default EDITOR_RULES;
