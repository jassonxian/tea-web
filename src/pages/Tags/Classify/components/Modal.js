import React from 'react';
import FormModal from '@/components/FormModal';

const Modal = props => {
  const { ...params } = props;
  const formFields = [
    {
      type: 'textarea',
      label: '标签名称',
      name: 'tag_name_list',
      inputProps: {
        rows: 3,
        style: { minHeight: 32 },
        placeholder: '多个标签用；分隔',
      },
      decoratorOptions: {
        rules: [
          {
            required: true,
            message: '不能为空',
          },
        ],
      },
    },
  ];
  const modalProps = {
    formFields,
    ...params,
  };
  return <FormModal {...modalProps} />;
};

export default Modal;
