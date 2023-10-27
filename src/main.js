/*
 * @Author: Wangtao
 * @Date: 2023-06-19 14:20:10
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-09-04 16:34:36
 */

import ElementUI from 'element-ui';
import Vue from 'vue'
import App from './App.vue'


import 'element-ui/lib/theme-chalk/index.css';

import './assets/iconfont/iconfont.css'

Vue.use(ElementUI)

import './components/variables.css'
import router from './router'

Vue.config.productionTip = false

new Vue({
 router,
 render: h => h(App)
}).$mount('#app')
