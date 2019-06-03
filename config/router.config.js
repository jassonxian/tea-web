export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/goods' },
      {
        path: '/goods',
        icon: 'appstore',
        name: 'goods',
        routes: [
          {
            path: '/goods',
            component: './Goods/Index',
          },
          {
            path: '/goods/create',
            component: './Goods/Create',
          },
        ],
      },
      {
        path: '/tags',
        icon: 'tags',
        name: 'tags',
        routes: [
          {
            path: '/tags/category',
            name: 'category',
            component: './Tags/Category',
          },
          {
            path: '/tags/brand',
            name: 'brand',
            component: './Tags/Brand',
          },
        ],
      },
      {
        path: '/agent',
        icon: 'team',
        name: 'agent',
        component: './Agent',
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
