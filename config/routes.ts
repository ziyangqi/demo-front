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
      { icon: 'table', path: '/admin/transfer', name: '个人办公' ,
      routes :[
        {icon: 'Excel', path: '/admin/transfer/flowList',component: './Admin/transfer/flowList', name: '流程列表'},
        {icon: 'Excel', path: '/admin/transfer/entrustment',component: './Admin/transfer/entrustment', name: '委托设置'},
      ]},
      { icon: 'Excel', path: '/admin/flowable', name: '流程管理' ,
      routes :[
        {icon: 'Excel', path: '/admin/flowable/waitlist', component: './Admin/flowable/waitlist', name: '获取流程代办'},
        {icon: 'Excel', path: '/admin/flowable/waitReadList', component: './Admin/flowable/waitReadList', name: '获取流程待阅'},
       // {icon: 'Excel', path: '/admin/flowable/getSpeedList', component: './Admin/flowable/getSpeedList', name: '当前待办流程的进度列表'}
      ]},
      { icon: 'table', path: '/admin/analysisExcel', component: './Admin/analysisExcel', name: '网站列表' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
