import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, DatePicker, Select, Button, notification} from 'antd';
import {listUserUsingGet} from "@/services/backend/userController";
import moment from "moment";
import {taskEntrustFlowPost} from "@/services/backend/flowController";

const { Option } = Select;

interface CreateFormProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
}
const CreateForm: React.FC<CreateFormProps> = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState<any[]>();
  const getUserInfo = async () => {
    const data = await listUserUsingGet({})
    // @ts-ignore
    setUserInfo(data.data)
  }

  // 使用钩子函数
  useEffect(() => {
    getUserInfo();
  }, []); //
  const handleCreate = async () => {
    // 获取信
    const endDate = moment(form.getFieldValue("endDate"),).format('YYYY-MM-DD HH:mm:ss')
    const startDate  = moment(form.getFieldValue("startDate"),).format('YYYY-MM-DD HH:mm:ss')
    if (endDate <= startDate){
      notification.error({
        message: "提示",
        description: "结束时间不能小于开始时间",
        duration: 2,
        placement: "top",
      });
      return
    }
    const newEntrustDTO = {
      agentType :form.getFieldValue("agentType"),
      authIds: form.getFieldValue("authIds") ? [form.getFieldValue("authIds") ] : [],
      endDate:  moment(form.getFieldValue("endDate"),).format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment(form.getFieldValue("startDate"),).format('YYYY-MM-DD HH:mm:ss'),
      opinion: form.getFieldValue("opinion"),
      subject: form.getFieldValue("subject"),
    }
    // 调用接口
    const code = await taskEntrustFlowPost({
      ...newEntrustDTO
    })
    // @ts-ignore
    if (code === 200){
      notification.success({
        message: "提示",
        description: "新建成功",
        duration: 2,
        placement: "top",
      });
    }

    form.validateFields().then(values => {
      onCreate(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={visible}
      title="添加流程代理设置"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="create" type="primary" onClick={handleCreate}>
          确定
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="authIds"
          label="被委托人"
          rules={[{ required: true, message: '请选择被委托人' }]}
        >
          <Select placeholder="请选择被委托人">
            {userInfo?.map(user => (
              <Option key={user.userName} value={user.userName}>
                {user.userAccount}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subject"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="开始生效时间"
          rules={[{ required: true, message: '请选择开始时间' }]}
        >
          <DatePicker showTime placeholder="选择开始时间" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="失效时间"

          rules={[{ required: true, message: '请选择失效时间' }]}
        >
          <DatePicker showTime placeholder="选择失效时间" style={{ width: '100%' }}  />
        </Form.Item>

        <Form.Item
          name="agentType"
          label="代理范围"
          rules={[{ required: true, message: '请选择代理范围' }]}
        >
          <Select placeholder="选择代理范围">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="opinion"
          label="委托说明"
        >
          <Input.TextArea placeholder="请输入委托说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
