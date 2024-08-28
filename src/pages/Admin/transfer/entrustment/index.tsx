import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { readByAlreadyGet, waitReadListPost } from "@/services/backend/taskController";
import CreateForm from './components/CreateForm'; // 确保路径正确

/**
 * 流程引擎界面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据

  // 新建内容的处理函数
  const handleCreate = async (values: any) => {
    console.log('新建数据:', values);
    setCreateModalVisible(false);
    message.success('新建成功');
    actionRef.current?.reload();
  };

  const handleCancel = () => {
    setCreateModalVisible(false);
  };

  /**
   * 把节点的状态给进行改变
   *
   * @param row
   */
  const handleChange = async (row: API.waitReadList) => {
    const hide = message.loading('正在进行状态的改变');
    if (!row) return true;
    try {
      await readByAlreadyGet({
        // 根据流程id进行更改
        id: row.id as any,
      });
      hide();
      message.success('更改成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('更改失败，' + error.message);
      return false;
    }
  };

  // 表格列配置
  const columns: ProColumns<API.waitReadList>[] = [
    // ... 省略其他列配置
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleChange(record)}>
            阅读
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.waitReadList>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const {data ,code} = await waitReadListPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.BaseResponseReadList_)

          // @ts-ignore
          const processedData = data.map((item: { data: any; }) => {
            return {
              ...item.data,
            };
          });

          return {
            success: code === 200,
            data: processedData || [],
            total: Number(data?.length) || 0,
          };
        }}
        columns={columns}
      />

      {/* 新建表单的模态框 */}
      <CreateForm
        visible={createModalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
      />
    </PageContainer>
  );
};

export default UserAdminPage;
