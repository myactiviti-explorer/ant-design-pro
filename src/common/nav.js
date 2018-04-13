import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '流程',
        path: 'flow',
        icon: 'profile',
        children: [
          {
            name: '我的流程',
            path: 'wodeliucheng',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
          },
          {
            name: '已部署流程',
            path: 'yibushu',
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/ListDeployed')),
          },
          {
            name: '流程设计工作区',
            path: 'liuchengsheji',
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/FlowDesign')),
          },
        ],
      },
      {
        name: '任务',
        path: 'task',
        icon: 'form',
        children: [
          {
            name: '待办任务',
            path: 'daiban',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
          },
          {
            name: '我的任务',
            path: 'wode',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
          },
          {
            name: '队列',
            path: 'duilie',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
          },
          {
            name: '受邀',
            path: 'shouyao',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
          },
          {
            name: '已归档',
            path: 'yiguidang',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
          }],
      },
      {
        name: '结果',
        path: 'result',
        icon: 'check-circle-o',
        hideInMenu: true,
        children: [
          {
            name: '成功',
            path: 'success',
            component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
          },
          {
            name: '失败',
            path: 'fail',
            component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/',
    layout: 'UserLayout',
    hideInMenu: true,
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
          {
            name: '注册',
            path: 'register',
            component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
            hideInMenu: true,
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
    layout: 'BlankLayout',
    children: {
      name: '使用文档',
      path: 'http://myactiviti.limeng32.com',
      target: '_blank',
      icon: 'book',
    },
  },
];
