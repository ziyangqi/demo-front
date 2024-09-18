import {
  DeploymentUnitOutlined,
  GithubOutlined,
  GitlabOutlined, InboxOutlined,
  InteractionOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '中兴（温州）轨道通讯技术有限公司';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'ShowDoc',
          title: (
            <>
              <InboxOutlined /> Wiki知识库
            </>
          ),
          href: 'http://wiki.zxrail.com.cn',
          blankTarget: true,
        },
        {
          key: 'Chandao',
          title: (
            <>
              <ProjectOutlined  /> 项目管理系统
            </>
          ),
          href: 'http://chandao.zxrail.com.cn/user-login-Lw==.html',
          blankTarget: true,
        },
        {
          key: 'API Documentation',
          title: (
            <>
              <InteractionOutlined  /> 接口管理服务
            </>
          ),
          href: 'http://api.zxrail.com.cn/',
          blankTarget: true,
        },
        {
          key: 'KodExplorer',
          title: (
            <>
              <DeploymentUnitOutlined  /> 可道云.资源管理器
            </>
          ),
          href: 'https://api.dicebear.com/7.x/miniavs/svg?seed=pan',
          blankTarget: true,
        },
        {
          key: 'Gitea',
          title: (
            <>
              <GitlabOutlined /> 自助 Git 服务
            </>
          ),
          href: 'http://gitea.zxrail.com.cn',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
