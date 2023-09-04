/*
 * @Author: Wangtao
 * @Date: 2023-06-28 21:04:32
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-28 22:17:14
 */


// 不作为main组件子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('../pages/login')
};


// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/app',
    name: 'app',
    title: 'App',
    meta: {
      requireAuth: true
    },
    component: () => import('../components/index')
  },
  {
    path: '/',
    name: 'home',
    title: 'home',
    meta: {
      requireAuth: true
    },
    component: () => import('../components/index')
  }
];

export const routers = [
  loginRouter,
  ...appRouter
];
