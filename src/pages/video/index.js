import React from 'react';
import { Card, Upload, Button, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default () => {
  const props = {
    action: '//jsonplaceholder.typicode.com/posts/',
    listType: 'picture',
    previewFile(file) {
      console.log('Your upload file:', file);
      // Your process logic. Here we just mock to the same file
      return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
        method: 'POST',
        body: file,
      })
        .then(res => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };
  return (
    <PageHeaderWrapper title="宣传视频">
      <Card bordered={false}>
        <div>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};
