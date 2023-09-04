<!--
 * @Author: Wangtao
 * @Date: 2022-11-15 16:03:05
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-28 18:02:17
-->
<template>
  <div class="endthethreewaycall-warp" v-show="investData && investData.length > 0">
	<div class="endthethreewaycall-box">
     <div class="user-list">
       <div class="user-item" @click.stop="phoneInvestigate(item.Exten)" v-for="(item, index) in investData" :key="index"><span>{{item.DisplayName}}</span><span class="oprate">转调查</span></div>
     </div>
  </div>
  </div>
</template>

<script>
export default {
  components: {
    
  },
  computed: {
    getAutoHangupList() {
      return this.$store.state.cti.globalLet.autoHangupList || []
    }
  },
  data () {
    return {
      investData: []
    }
  },
  methods: {
    openInvestigate() {
      let that = this;  
      window.webapp.callApi.getInvestigateList({
        success(res){
          let investData = res.data || []
          investData.unshift({
            Exten: '',
            DisplayName: '默认满意度'
          })
          that.investData = investData
        }
      })
    },
    phoneInvestigate(Exten) {
      // 满意度
      window.webapp.callApi.transferSatisfaction({
        Exten:Exten,
        success(res){
          console.log('转满意度成功')
        }
      })
    }
  },
  mounted () {
    this.openInvestigate()
  }
}
</script>
<style scoped lang="stylus">
.endthethreewaycall-warp {
  padding: 8px;
  box-sizing: border-box;
}
.endthethreewaycall-box {
  background-color: white;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
}
.user-list {
  max-height: 150px;
  overflow-y: scroll;
}
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
  .oprate {
    color: #1E63F5;
    padding: 4px 8px 4px;
    border-radius: 4px;
  }
  .oprate:hover {
    background-color: #BBD0FC;
  }
}
.user-item:hover{
  background-color: #F7F7F7;
  cursor pointer;
}
</style>
