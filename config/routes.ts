export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '欢迎页' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
      { icon: 'Excel', path: '/admin/flowable', name: '流程管理' ,
      routes :[
        {icon: 'Excel', path: '/admin/flowable/waitlist', component: './Admin/flowable/waitlist', name: '获取流程代办'},
        {icon: 'Excel', path: '/admin/flowable/waitReadList', component: './Admin/flowable/waitReadList', name: '获取流程待阅'}
      ]},
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
