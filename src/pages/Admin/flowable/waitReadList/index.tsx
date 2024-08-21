import CreateModal from '@/pages/Admin/User/components/CreateModal';
import UpdateModal from '@/pages/Admin/User/components/UpdateModal';
import { deleteUserUsingPost } from '@/services/backend/userController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import {readByAlreadyGet, waitListPost, waitReadListPost} from "@/services/backend/taskController";

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
        taskId: row.procId as any,
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

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.waitReadList>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch:true
    },
    {
      title: '接收人',
      dataIndex: 'receiver',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '流程id',
      dataIndex: 'procId',
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
      title: '接收人Id',
      dataIndex: 'receiverId',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: 'taskId',
      dataIndex: '任务id',
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
      hideInTable:true,
      colSize:1.5,
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
              ...item.data, // 展开原有的 `data` 对象
            };
          });
          console.log(processedData)
          return {
            success: code === 200,
            // @ts-ignore
            data: processedData|| [],
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
