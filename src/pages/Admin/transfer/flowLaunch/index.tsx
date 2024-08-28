import React, { useState } from 'react';
import { CheckCard } from '@ant-design/pro-components';
import { Modal, Form, Input, Button, notification } from 'antd';

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [form] = Form.useForm(); // 创建一个表单实例

  // 执行提交的业务
  const handleOk = async () => {
    try {
      // 获取并校验表单值
      const values = await form.validateFields();
      // 获取表单的值
      console.log('表单值:', values.field1, values.field2);

      setIsModalVisible(false);
      setIsChecked(false);

      // 进行业务逻辑的编写
      notification.success({
        message: "提示",
        description: "提交成功",
        duration: 2,
        placement: "top",
      });
    } catch (error) {
      console.log('表单校验失败:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsChecked(false);
    notification.error({
      message: "提示",
      description: "取消成功",
      placement: "top",
    });
  };

  return (
    <>
      <CheckCard
        avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
        title="示例一"
        description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
        checked={isChecked}
        onChange={(newChecked) => {
          console.log('checked', newChecked);
          if (newChecked) {
            setIsChecked(true);
            setIsModalVisible(true); // 打开 Modal
          } else {
            setIsChecked(false);
          }
        }}
        defaultChecked={false}
        onClick={() => {
          console.log('clicked');
        }}
      />

      <Modal
        title="数据"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="exampleForm">
          <Form.Item
            label="表单字段1"
            name="field1"
            rules={[{ required: true, message: '请输入表单字段1的值' }]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item
            label="表单字段2"
            name="field2"
            rules={[{ required: true, message: '请输入表单字段2的值' }]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
