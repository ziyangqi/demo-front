import React, { useEffect, useState } from 'react';
import { getFlowDetail, getFlowList, taskFlowablePost } from "@/services/backend/flowController";
import { Modal, Form, Input, Button } from 'antd';
import defaultImage from '@/assets/default.png';

interface DataItem {
  href: string;
  name: string;
  modelKey: string;
  description: string;
}

interface FormItem {
  icon: string;
  name: string;
  options: any;
  model: string;
  rules: any[];
  type: string;
  key: string;
}

interface FormJson {
  list: FormItem[];
  config: {
    size: string;
    labelPosition: string;
    formName: string;
    labelWidth: number;
  };
}

type modelDetail = {
  defId?: string | null;
  modelId?: string | null;
  title?: string | null;
}

export default function IconGrid() {
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [formData, setFormData] = useState<FormItem[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<modelDetail>();
  const [form] = Form.useForm(); // 使用Form实例

  useEffect(() => {
    async function fetchData() {
      const response = await getFlowList();
      const data = response.data;
      setDataList(data);
    }
    fetchData();
  }, []);

  const handleCardClick = async (item: DataItem) => {
    const modelKey = item.modelKey;
    const {data} = await getFlowDetail({ modelKey });
    console.log(data)

    // 获取需要的数据
    // @ts-ignore
    const detail: modelDetail = {
      defId: data.defId,
      modelId: data.modelId,
      title: data.sysTypeEntity.title,
    };
    setDetailData(detail);
    console.log(detail)

    try {
      // 解析并设置表单项
      const parsedJson: FormJson = JSON.parse(data.formJson);
      setFormData(parsedJson.list);
      form.resetFields(); // 重置表单
      setModalVisible(true);
    } catch (error) {
      console.error("解析JSON时出错:", error);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImage; // 设置默认的图片路径
  };

  const renderFormItem = (item: FormItem) => {
    switch (item.type) {
      case 'input':
        return (
          <Form.Item
            key={item.key}
            label={item.name}
            name={item.model}
            rules={item.rules}
            style={{ width: item.options.width || '100%' }}
          >
            <Input placeholder={item.options.placeholder} />
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item
            key={item.key}
            label={item.name}
            name={item.model}
            rules={item.rules}
            style={{ width: item.options.width || '100%' }}
          >
            <Input.TextArea placeholder={item.options.placeholder} />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 获取并验证表单数据
      const taskData = {
        defId: detailData?.defId,
        modelId: detailData?.modelId,
        typeTitle: detailData?.title,
        formData: JSON.stringify(values), // 将表单数据转换为字符串
        externalUrl: '',
      };

      const dataDetail = await taskFlowablePost({
        ...taskData
      }); // 发起流程
      console.log(dataDetail)

      console.log(detailData)

      setModalVisible(false);
    } catch (error) {
      console.error("表单验证失败或提交出错:", error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {dataList.map((item, index) => (
          <div
            key={index}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleCardClick(item)}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
              <img
                src={item.href || defaultImage}
                onError={handleImageError}
                style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>{item.name}</div>
          </div>
        ))}
      </div>

      <Modal
        title="动态表单"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            提交
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="dynamic_form"
          layout="vertical"
          onFinish={(values) => console.log('Form values:', values)}
        >
          {formData && formData.map((item) => renderFormItem(item))}
        </Form>
      </Modal>
    </>
  );
}
