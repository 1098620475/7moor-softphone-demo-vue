import Vue from 'vue'
import VueRouter from 'vue-router'
import loginView from '../pages/login.vue'

import { Loading } from 'element-ui';

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: loginView
  },
  {
    path: '/app',
    name: 'app',
    meta: {
      requireAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})


let loading;
router.beforeEach((to, form, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (window.token) {  // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
  loading = Loading.service({
    // fullscreen: true,
    target: '.content-wrapper',
    text: '跳转中...'
  });

});

router.afterEach((to, from) => {
  // 解决某些情况下loading无法关闭的情况
  setTimeout(() => {
    loading.close();
  }, 0)
});

export default router
