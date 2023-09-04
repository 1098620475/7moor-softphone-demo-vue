<!--
 * @Author: Wangtao
 * @Date: 2022-11-15 14:51:50
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-28 11:59:25
-->
<template>
	<div class="endthethreewaycall-box">
     <div class="user-list">
       <div class="user-item" @click.stop="hangupThreeCall(item)" v-for="(item, index) in getAutoHangupList" :key="index"><span>{{item.Exten}}</span>挂断<i class="iconfont icon-guaji11"></i></div>
     </div>
  </div>
</template>

<script>
export default {
  components: {
    
  },
  data () {
    return {
      getAutoHangupList: []
    }
  },
  methods: {
    hangupThreeCall(item) {
      let that = this;
      // 三方通话状态下，发起方可自主进行对客户方或被咨询方挂断。
      this.$confirm(`${item.Exten}将退出三方通话，确定执行？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        cancelButtonClass: 'primary_btn',
        confirmButtonClass: 'primary_btn',
        type: 'warning'
      })
        .then(() => {
          window.webapp.callApi.hangup({
            Channel: item.Channel,
            success: function() {
              that.getAutoHangupList = that.getAutoHangupList.filter((info) => {
                return info.Exten !== item.Exten
              })
            }
          })
        })
        .catch(() => {})
    },
    getHanupList () {
      let that = this;
      window.webapp.callApi.getthreewaycalluser({
      success(res){
        that.getAutoHangupList = res.data;
      }
    })
    }
  },
  mounted () {
    this.getHanupList()
  }
}
</script>
<style scoped lang="stylus">
.user-item {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0;
  box-sizing: border-box;
  color: #000;
  font-size: 12px;
  .iconfont {
    color: var(--color-danger);
  }
}
.user-item:hover{
  background-color: #F7F7F7;
  cursor pointer;
}
</style>
