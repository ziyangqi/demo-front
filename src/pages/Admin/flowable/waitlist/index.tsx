import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  notification,
  Radio,
  Select,
  Space,
  Table,
  Typography
} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {getSpeedGet, getSpeedListGet, waitListPost} from "@/services/backend/taskController";
import {
  taskAgreeFlowPost,
  taskDetailGet,
  taskRejectFlowPost,
  taskTransferFlowPost
} from "@/services/backend/flowController";
import { Row, Col } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import initialState from "@@/plugin-initialState/@@initialState";
import {getLoginUserUsingGet, listUserUsingGet} from "@/services/backend/userController";
import {getLocaleList} from "@umijs/plugins/dist/utils/localeUtils";
const UserAdminPage: React.FC = () => {
  const { Option } = Select
  const [radioValue,setRadioValue] = useState("");
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.waitList>();
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [formReject] = Form.useForm(); // 使用Form实例
  const [ModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalSubmitVisible, setModalSubmitVisible] = useState<boolean>(false);
  const [form] = Form.useForm(); // 使用Form实例
  const [formData, setFormData] = useState<FormItem[]>([]);
  const [agreeModelVisible,setAgreeModelVisible] = useState<boolean>(false);
  // 下一个节点的内容
  const [nextNodeMessage, setNextNodeMessage] = useState<any[]>();
  const [approveTaskId, setApproveTaskId] = useState();
  const [approveTitle, setApproveTitle] = useState();
  const [formDataResult, setFormDataResult] = useState<any[]>();
  const [chooseNode, setChooseNode] = useState('');
  const [chooseNodeUser, setChooseNodeUser] = useState('');
  const [modelRejectVisible,setModalRejectVisible] = useState<boolean>(false);
  const [runningData, setRunning] = useState<any[]>();
  const [modalTransferVisible,setModalTransferVisible] = useState<boolean>(false);
  const [transferUserInfo,setTransferUserInfo] = useState<any[]>();
  const [selectUser,setSelectUser] = useState<any[]>();
  const [loginUserData,setLoginUserData] = useState();
  const [formTransfer] =  Form.useForm();
  const [initUserNo ,setInitUseNO] = useState();
  // 设置按钮防止重复提交
  const [isSubmitting, setIsSubmitting] = useState(false);
  // FormJSON的内容
  interface FormJson {
    list: Array<{
      icon: string;
      key: string;
      model: string;
      name: string;
      options: {
        showAlpha: boolean;
        defaultValue: string;
        [key: string]: any; // 允许额外的属性
      };
      rules: Array<any>;
      type: string;
    }>;
    config: {
      size: string;
      labelPosition: string;
      formName: string;
      labelWidth: number;
    };
  }
  // 合并JSON

  const mergeJsons = (parsedJson: FormJson, editJson: Record<string, any>) => {
    parsedJson.list.forEach((item) => {
      const key = item.model;
      if (editJson.hasOwnProperty(key)) {
        item.options.defaultValue = editJson[key]; // 将 editJson 中的值注入到 parsedJson
      }
    });
    return parsedJson;
  };
  // 点击审批后的按钮

  const handleApprove = async (row: API.waitList) => {
    // 打开浮层的Model
    setLoading(true);
    if (!row) return true;
    try {
      // 获取流程细节
      const detailData = await taskDetailGet({
        taskId: row.id as any,
      });

      // 解析并设置表单项
      // @ts-ignore
      const parsedJson: FormJson = JSON.parse(detailData.data.busFormInfo.formJson);
      const editJson: FormJson = JSON.parse(detailData.data.busFormInfo.editForm);
      const mergedJson = mergeJsons(parsedJson, editJson);
      setFormData(mergedJson.list);
      form.resetFields(); // 重置表单

      // 解析下半部分 data是获取流程代办的data
      const { data } = await getSpeedGet({
        taskId: row.processInstanceId as any,
      });
      // @ts-ignore
      setInitUseNO(data.data[0].taskName.split('/')[1].slice(0, -1))
      // 获取taskKeys
      const uniqueTaskKeyNamePairs = Array.from(
        new Map(
          // @ts-ignore
          data.data.slice(1,-1)
            // @ts-ignore
            .filter((item: any) => !data.runing.includes(item.taskKey) )
            .map((item: any) => {
              const match = item.taskName.match(/\(([^)]+)\/([^)]+)\)$/);
              return {
                taskKey: item.taskKey,
                taskName: item.taskName,
                userNo: match ? match[2] : '' // 获取匹配结果中的 userNo 部分
              };
            })
            .map(item => [item.taskKey, item]) // 用 `taskKey` 作为键，进行去重
        ).values()
      );
      setRunning(uniqueTaskKeyNamePairs)
      console.log(runningData)
      // 加载下一个节点的值
      // @ts-ignore
      setNextNodeMessage(detailData.data.nextNodeInfoVOs);
      console.log(nextNodeMessage)
      // @ts-ignore
      setModalData(data.data || []);
      setModalSubmitVisible(true);
      // @ts-ignore
      setApproveTitle(row.title);
      // @ts-ignore
      setApproveTaskId(row.id);
      // 使用 useEffect 监听 formData 变化来生成结果
      const result = mergedJson.list.reduce((acc, item) => {
        const modelValue = item.model;
        const defaultValue = item.options?.defaultValue || '';
        // 累积每个键值对到最终的对象中
        // @ts-ignore
        acc[modelValue] = defaultValue;
        return acc;
      }, {}); // 初始值为空对象
      // @ts-ignore
      setFormDataResult(result);
      console.log(result);

    } catch (error: any) {
      message.error('查找失败，' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 每次 formData 更新时，重新设置表单的字段值
    const initialValues = formData.reduce((values, item) => {
      values[item.model] = item.options.defaultValue || '';
      return values;
    }, {} as Record<string, any>);
    form.setFieldsValue(initialValues);
  }, [formData, form]);

  useEffect(() => {
    // 当 nextNodeMessage 更新时，更新 chooseNode 和 chooseNodeUser
    if (nextNodeMessage) {
      const nodeIds = nextNodeMessage.map(node => node.taskId).join(',');
      setChooseNode(nodeIds);
      // 相同的使用_分割，不同的使用，分割
      const userNos = nextNodeMessage
        .map(node => node.nodeUsers ? node.nodeUsers.map((user: { userNo: string; }) => user.userNo).join('_') : '')
        .filter(str => str !== '')
        .join(',');
      setChooseNodeUser(userNos);
    }
  }, [nextNodeMessage]); // 依赖于 nextNodeMessage，当它变化时执行

  useEffect(() => {
    // 每次 formData 更新时，重新设置表单的字段值
    const initialValues = formData.reduce((values, item) => {
      values[item.model] = item.options.defaultValue || '';
      return values;
    }, {} as Record<string, any>);
    form.setFieldsValue(initialValues);
  }, [formData, form]);

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
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '是否转办',
      dataIndex: 'transfer',
      valueType: 'text',
      hideInSearch: true,
      valueEnum:{
        'true' : {
          text : '否'
          },
        'false': {
          text : '是'
        }
      }
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
              handleApprove(record)
              setCurrentRow(record);
            }}
          >审批
          </Typography.Link  >
          <Typography.Link type="success" onClick={async () => {
            const {data, code} = await getSpeedListGet({
              taskId:record.id as any
            });
            if(code === 200) {
              console.log()
              // @ts-ignore
              setDrawerData(data.data || []);
              console.log(drawerData)
              setDrawerVisible(true);
            }
          }}>
            流程进度列表
          </Typography.Link>
          <Typography.Link type="success" onClick={async () => {
            const {data, code} = await getSpeedGet({
              taskId: record.processInstanceId as any,
            })
            if(code === 200) {
              // @ts-ignore
              console.log(data.data)
              // @ts-ignore
              setModalData(data.data || []);
              console.log(drawerData)
              setModalVisible(true);
            }
          }}>
            流程进度
          </Typography.Link>
        </Space>
      ),
    },
  ];
  const drawerColumnsList = [
    {
      title: '意见',
      dataIndex: 'opinion',
      key: 'opinion',
    },
    {
      title: '任务id',
      dataIndex: 'taskId',
      key: 'taskId',
    },
    {
      title: '任务关键值',
      dataIndex: 'taskKey',
      key: 'taskKey',
    },
    {
      title: '业务状态',
      dataIndex: 'bizStatus',
      key: 'bizStatus',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '创建时间',
      dataIndex: 'create',
      key: 'create',
    },
    {
      title: '结束时间',
      dataIndex: 'end',
      key: 'end',
    },
  ];
  const handleSubmit = () => {
    // 处理审批逻辑
    // 1 开启一个浮窗
    setAgreeModelVisible(true);
    // 2 对浮窗的内容进行填写传入参数
  };
  const handleReject = () =>{

    setModalRejectVisible(true);
  };

  const handleTransfer = async () => {
    // 进行获取本地的用户

    // 处理流转的内容
    // 获取用户的列表
    // @ts-ignore
    const localListData = await listUserUsingGet();
    console.log(localListData.data)
    setTransferUserInfo(localListData.data)
    setModalTransferVisible(true);
  };

  // 同意流程中的同意按钮的内容
  const handleSubmitAgree = async () => {
    try {
      setIsSubmitting(true)
      // 处理审批逻辑
      // @ts-ignore
      const values = form.getFieldsValue("selectedUsers");
      console.log(values)
      const newTaskAgreeFlowDTO = {
        taskName: "",
        taskId: approveTaskId,
        taskTitle: approveTitle,
        monitor: false,
        action: "agree",
        actionName: "agree",
        bpmVar: "",
        formData: JSON.stringify(formDataResult),
        chooseNode: chooseNode,
        chooseNodeUser: chooseNodeUser,
        formType: "inner",
        nodeIndex: '0',
        priority: '50',
        opinion: values.opinion,
      };

      const {code} = await taskAgreeFlowPost({
        ...newTaskAgreeFlowDTO
      })
      if (code === 200) {
        notification.success({
          message: "提示",
          description: "审批成功",
          duration: 2,
          placement: "top",
        });
      }
    }  catch (error: any) {
      message.error('查找失败，' + error.message);
      return false;
    }finally {
      setAgreeModelVisible(false)
      setModalSubmitVisible(false)
      setIsSubmitting(false)
    }
    // @ts-ignore
    actionRef.current.reload()

  };
  // 改变User的时候获取
  const onUserChange = (userName: any) => {
    // @ts-ignore
    const user = transferUserInfo.find(user => user.userName === userName);

    const transformedUsers = {
      userNo: user.userName,
      fullname: user.userAccount,
    };
    // @ts-ignore
    setSelectUser(transformedUsers)
  };

  // 处理驳回的逻辑
  const handleSubmitReject = async (values:any) => {
    try{
      setIsSubmitting(true)
      const newTaskRejectFlowDTO = {
        newActivityId: radioValue.split('-')[0],
        operate: "backToNode",
        priority: '50',
        option: values.opinion,
        taskId:approveTaskId,
        taskTitle: approveTitle,
        userId: radioValue.split('-')[1]
          ? radioValue.split('-')[1]  // 如果不为空，使用这个值
          : initUserNo,
      };
      const {code} = await taskRejectFlowPost({
        ...newTaskRejectFlowDTO
      })
      console.log(newTaskRejectFlowDTO)
      if (code === 200){
        notification.success({
          message: "提示",
          description: "驳回成功",
          duration: 2,
          placement: "top",
        });
      }

      // @ts-ignore
      actionRef.current.reload()
    }catch (error : any){
      message.error(error.message)
    }finally {
      setIsSubmitting(false)
      setModalRejectVisible(false)
      setModalSubmitVisible(false)
    }

  };


  // 处理驳回的逻辑
  const handleSubmitTansfer = async (values:any) => {
    try{
      setIsSubmitting(false)
      const newTaskTransferFlowDTO = {
        usersInfo:selectUser,
        option: values.opinion,
        taskId:approveTaskId,
      };
      console.log(newTaskTransferFlowDTO)
      const {code} = await taskTransferFlowPost({
        ...newTaskTransferFlowDTO
      })
      if (code === 200){
        notification.success({
          message: "提示",
          description: "转办成功",
          duration: 2,
          placement: "top",
        });
      }
      // 成功后结束
      setModalTransferVisible(false);
      setModalSubmitVisible(false)
      // @ts-ignore
      actionRef.current.reload()
    }catch(error : any){
      message.error(error.message)
    }finally {
      setIsSubmitting(true)
    }
  };

  // 结构
  interface FormItem {
    icon: string;
    name: string;
    options: any;
    model: string;
    rules: any[];
    type: string;
    key: string;
  }
  //动态列表的内容
  const renderFormItem = (item: FormItem) => {
    switch (item.type) {
      case 'input':
        return (
          <Form.Item
            key={item.key}
            label={item.name}
            name={item.model}
            rules={item.rules}
            initialValue={item.options.defaultValue}
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

  const customTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>审批流程</span>
      <Space style={{ marginRight: '30px' }}> {/* 调整margin-right 使按钮组向左移动 */}
        <Button onClick={handleSubmit} type="primary">
          审批
        </Button>
        <Button onClick={handleReject} danger>
          驳回
        </Button>
        <Button onClick={handleTransfer}>
          流转
        </Button>
      </Space>
    </div>
  );


  const modelColumnsList = [
    {
      title: '意见',
      dataIndex: 'opinion',
      key: 'opinion',
    },
    {
      title: '任务id',
      dataIndex: 'taskId',
      key: 'taskId',
    },
    {
      title: '任务关键值',
      dataIndex: 'taskKey',
      key: 'taskKey',
    },
    {
      title: '业务状态',
      dataIndex: 'bizStatus',
      key: 'bizStatus',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '创建时间',
      dataIndex: 'create',
      key: 'create',
    },
    {
      title: '结束时间',
      dataIndex: 'end',
      key: 'end',
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.waitList>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        pagination={{
          showSizeChanger: true, // 允许用户修改每页记录数
          defaultPageSize: 10,  // 默认每页显示10条
          showQuickJumper: true // 允许快速跳转到某一页
        }}
        search={{ labelWidth: 120 }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          // @ts-ignore
          const sortField = Object.keys(sort)?.[0];
          // @ts-ignore
          // todo 获取新的roleToken
          // getRoleToken
          const sortOrder = sort?.[sortField] ?? undefined;
          const {data,code} = await waitListPost({
            page: 1,
            limit:10000,
            sortField,
            sortOrder,
            ...filter,
          } as API.TodoTaskQueryDTO)

          const userData = localStorage.getItem("userAccount")
          // @ts-ignore
          console.log(userData)
          // @ts-ignore
          setLoginUserData(userData)
          return {
            success: code === 200,
            data: Array.isArray(data) ? data : [],
            total: Number(data?.length) || 0,
          };
        }}
        columns={columns}
      />
      <Drawer
        title="流程代办列表"
        width={1000}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ maxHeight: '100vh', overflowY: 'auto' }}
      >
        <Table
          columns={drawerColumnsList}
          dataSource={drawerData} // 提取 data 内的数据
          rowKey="id"
        />
      </Drawer>



      {/*浮层表单*/}
      <Modal
        destroyOnClose
        title="流程代办列表"
        width={1000}
        onCancel={() => setModalVisible(false)} // 点击 X 或者遮罩层时关闭 Modal
        footer={null}
        visible={ModalVisible}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Table
          columns={modelColumnsList}
          dataSource={modalData} // 提取 data 内的数据
          rowKey="batchId"
        />
      </Modal>

      <Modal
        destroyOnClose
        title={customTitle}
        visible={modalSubmitVisible}
        onCancel={() => setModalSubmitVisible(false)}
        onOk={() => setModalSubmitVisible(false)} // 审批完成后关闭 Modal
        confirmLoading={loading} // 根据 loading 状态显示加载效果
        width="90vw" // 根据窗口大小设置宽度
        height="90vm"
        style={{top: 20}} // 使 Modal 在页面中垂直居中
        centered // 垂直居中显示 Modal
        bodyStyle={{
          height: '90vh', // 使用视口高度的70%作为 Modal 的高度
          overflowY: 'auto',
          display: 'flex', // 使用 flex 布局
          flexDirection: 'column',
        }}
      >
        {/* 上半部分表单 */}
        <div style={{flex: 1, marginBottom: '10px'}}>
          <Form
            form={form}
            name="dynamic_form"
            layout="vertical"
          >
            <Row gutter={16}>
              {formData && formData.map((item, index) => (
                <Col span={12} key={index}>
                  {renderFormItem(item)}
                </Col>
              ))}
            </Row>
          </Form>
        </div>

        {/* 下半部分表格 */}
        <div style={{flex: 1}}>
          <Table
            columns={drawerColumnsList}
            dataSource={modalData}
            pagination={false} // 如果你不需要分页，可以关闭分页
            scroll={{y: 'calc(45vh - 40px)'}} // 设置滚动条的高度
            rowKey="key"
          />
        </div>

        {/*浮层表单关于办理流程的浮层表单 */}
        <Modal
          destroyOnClose
          title="办理"
          width={500}
          onCancel={() => setAgreeModelVisible(false)} // 点击 X 或者遮罩层时关闭 Modal
          footer={null}
          visible={agreeModelVisible}
          bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
          <Form form={form} name="22" layout="vertical" autoComplete="off" onFinish={handleSubmitAgree}>
            <Form.Item name="next_node" style={{marginBottom: 0}}>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <span style={{marginRight: 8}}>下一个节点  </span>
                {nextNodeMessage?.map(({taskId, taskName}, index) => (
                  <Button key={taskId || index} type="primary">
                    {taskName}
                  </Button>
                ))}
              </div>
              <br/>
              <Form.Item name="selectedUsers">
                <div style={{gap: '8px', alignItems: 'center'}}>
                  {nextNodeMessage?.map(({taskName, nodeUsers}, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                      <p style={{marginRight: '8px'}}>{taskName}:</p>
                      <div style={{display: 'flex', gap: '8px'}}>
                        {nodeUsers?.map(({fullname}, index) => (
                          <Button key={index} type="primary" size="middle"
                                  style={{display: 'flex', alignItems: 'center', padding: '0 8px', lineHeight: '24px'}}>
                            {fullname}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Form.Item>
              <Form.Item
                name="opinion"
                rules={[{required: true, message: '请输入审批意见'}]} // 可以加一些表单验证规则
              >
                <div style={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
                  <label style={{marginRight: '8px'}}>审批意见</label>
                  <TextArea
                    rows={2}
                    placeholder="请输入意见"
                    maxLength={100}
                    style={{flexGrow: 1}}
                    required
                  />
                </div>
              </Form.Item>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '16px'}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={isSubmitting} > 提交 </Button>
                  <Button type="default"  onClick={() => setAgreeModelVisible(false)}> 取消 </Button>
                </Space>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          destroyOnClose
          title="驳回"
          width={500}
          onCancel={() => setModalRejectVisible(false)} // 点击 X 或者遮罩层时关闭 Modal
          footer={null}
          visible={modelRejectVisible}
          bodyStyle={{maxHeight: '70vh', overflowY: 'auto'}}
        >
          <Form form={formReject} name="validateOnly" layout="vertical" autoComplete="off"  onFinish={handleSubmitReject}>
            <Form.Item name="name" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ marginRight: 8 }}>审批人: {loginUserData}</span>
              </div>
              <br />
              <Form.Item
                name="runningKey"
              >
                <span style={{ marginRight: 8 }}>驳回节点</span>
                <Radio.Group
                  onChange={(e) => setRadioValue(e.target.value)}
                >
                  {runningData?.map((item, index) => (
                    <Radio value={`${item.taskKey}-${item.userNo}`} key={index}> {/* 示例使用拼接 */}
                      {item.taskName}
                    </Radio>
                  ))}
                </Radio.Group>

              </Form.Item>
              <Form.Item
                name="opinion"
                rules={[{ required: true, message: '请输入审批意见' }]} // 可以加一些表单验证规则
              >
                <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  <label style={{ marginRight: '8px' }}>驳回意见</label>
                  <TextArea
                    rows={2}
                    placeholder="请输入意见"
                    maxLength={100}
                    style={{ flexGrow: 1 }}
                    required
                  />
                </div>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={isSubmitting} > 提交 </Button>
                  <Button type="default" htmlType="reset"  onClick={() => setModalRejectVisible(false)}> 取消 </Button>
                </Space>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          destroyOnClose={true}
          title="流转"
          width={500}
          onCancel={() => setModalTransferVisible(false)} // 点击 X 或者遮罩层时关闭 Modal
          footer={null}
          visible={modalTransferVisible}
          bodyStyle={{maxHeight: '70vh', overflowY: 'auto'}}
        >
          <Form form={formTransfer} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmitTansfer}>
            <Form.Item name="name" style={{ marginBottom: 0 }}>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <span style={{marginRight: 8}}>审批人: {loginUserData}</span>
              </div>
              <br/>
              <Form.Item
                name="fullname"
                >
                <span style={{ marginRight: 8 }}>请选择流转人</span>
                <Select
                  allowClear={true}
                  placeholder="请选择流转人"
                  onChange={onUserChange}
                >
                  {transferUserInfo?.map(user => (
                    <Option key={user.userName} value={user.userName}>
                      {user.userAccount}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="opinion"
                rules={[{ required: true, message: '请输入审批意见' }]}
              >
                <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  <label style={{ marginRight: '8px' }}>流转意见</label>
                  <TextArea
                    rows={2}
                    placeholder="请输入意见"
                    maxLength={100}
                    style={{ flexGrow: 1 }}
                    required
                  />
                </div>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={isSubmitting} > 提交 </Button>
                  <Button type="default" htmlType="reset"   onClick={() => setModalTransferVisible(false)}> 取消 </Button>
                </Space>
              </div>
            </Form.Item>
          </Form>
        </Modal>

      </Modal>

    </PageContainer>
  );
};
export default UserAdminPage;
