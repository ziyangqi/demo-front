import CreateModal from '@/pages/Admin/User/components/CreateModal';
import UpdateModal from '@/pages/Admin/User/components/UpdateModal';
import { deleteUserUsingPost } from '@/services/backend/userController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import {waitListPost} from "@/services/backend/taskController";

/**
 * 流程引擎界面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.waitList>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.waitList) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteUserUsingPost({
        id: row.id as any,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.waitList>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch:true
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '流程id',
      dataIndex: 'processInstanceId',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '当前余额',
      dataIndex: 'processDefinitionId',
      valueType: 'text',
      hideInSearch: true
    },

    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '时间区间',
      key: 'dateTimeRange',
      dataIndex: 'createdAtRange',
      valueType: 'dateTimeRange',
      colSize:1.5,
      hideInTable:true,
      search: {
        transform: (value: any) => ({
          startTime: value[0],
          endTime: value[1],
        }),
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.waitList>
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
          // const { data, code } = await listUserByPageUsingGet({
          //   ...params,
          //   sortField,
          //   sortOrder,
          //   ...filter,
          // } as API.UserQueryRequest)
          const {data ,code} = await waitListPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.TodoTaskQueryDTO)

          console.log(params)
          return {
            success: code === 200,
            data: data || [],
            total: Number(data?.length) || 0,
          };
        }}
        columns={columns}></ProTable>
      {/*<CreateModal*/}
      {/*  visible={createModalVisible}*/}
      {/*  columns={columns}*/}
      {/*  onSubmit={() => {*/}
      {/*    setCreateModalVisible(false);*/}
      {/*    actionRef.current?.reload();*/}
      {/*  }}*/}
      {/*  onCancel={() => {*/}
      {/*    setCreateModalVisible(false);*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<UpdateModal*/}
      {/*  visible={updateModalVisible}*/}
      {/*  columns={columns}*/}
      {/*  oldData={currentRow}*/}
      {/*  onSubmit={() => {*/}
      {/*    setUpdateModalVisible(false);*/}
      {/*    setCurrentRow(undefined);*/}
      {/*    actionRef.current?.reload();*/}
      {/*  }}*/}
      {/*  onCancel={() => {*/}
      {/*    setUpdateModalVisible(false);*/}
      {/*  }}*/}
      {/*/>*/}
    </PageContainer>
  );
};
export default UserAdminPage;
