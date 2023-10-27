<!--
 * @Author: Wangtao
 * @Date: 2023-06-19 14:20:10
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-10-27 10:34:42
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import App from './components/index.vue';
import './components/variables.css'
export default {
  name: 'telephone-strip',
  components: {
    App
  }
};
</script>
<style lang="scss">
html,body{
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
