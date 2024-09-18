import React from 'react';
import { Avatar, List } from 'antd';

const data = [
  {
    href: 'http://wiki.zxrail.com.cn',
    title: 'ShowDoc',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=wiki',
    description: 'Wiki知识库',
    content: 'Detailed information about internal documentation and resources.',
  },
  {
    href: 'http://chandao.zxrail.com.cn',
    title: 'Chandao',
    avatar: 'http://chandao.zxrail.com.cn/user-login-Lw==.html',
    description: '中兴（温州）轨道通讯技术有限公司项目管理系统',
    content: 'Manage all internal projects and tasks efficiently.',
  },
  {
    href: 'http://api.zxrail.com.cn',
    title: 'API Documentation',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=api',
    description: '高效、易用、功能强大的API管理平台旨在为开发、产品、测试人员提供更优雅的接口管理服务',
    content: 'Access the API documentation and integration guidelines.',
  },
  {
    href: 'http://pan.zxrail.com.cn',
    title: 'KodExplorer',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=pan',
    description: '可道云.资源管理器',
    content: 'Store and share files securely within the organization.',
  },
  {
    href: 'http://gitea.zxrail.com.cn',
    title: 'Gitea',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=gitea',
    description: '中兴温州一款极易搭建的自助 Git 服务',
    content: 'Manage and collaborate on code repositories using Gitea.',
  }
];

const App: React.FC = () => (
  <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 5,
    }}
    dataSource={data}
    footer={
      <div>
        <b>ant design</b> footer part
      </div>
    }
    renderItem={(item) => (
      <List.Item
        key={item.title}
        extra={
          <img
            width={272}
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
        }
      >
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={<a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}</a>}
          description={item.description}
        />
        {item.content}
      </List.Item>
    )}
  />
);

export default App;
