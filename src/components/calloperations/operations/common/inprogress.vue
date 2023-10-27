<!--
 * @Author: Wangtao
 * @Date: 2022-11-09 14:32:57
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-09-27 15:41:47
-->
<template>
	<div class="consultation-box">
    <div class="title-info">{{currentType === 'transfer' ?'转接中':'咨询中'}}，请稍等...</div>
    <div class="spec-btn-box">
      <div class="spec-btn" @click="phoneCancelTransfer">
        <i class="iconfont icon-quxiaozixun1"></i>
        <div class='spec-btn-text'>{{ currentType === 'transfer' ? '取消转接' : '取消咨询' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentType: {
      default: 'transfer'
    }
  },
  components: {
    
  },
  computed: {
    waitState() {
      // 转接或者是咨询后的等待ing
      return {}
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    phoneCancelTransfer() {
      // isTransfer为true是转接 为false是咨询
      if (this.currentType === 'transfer') {
        window.webapp.callApi.canceltransfer({
          success: function(){
            console.log('取消转接成功')
          }
        })
      } else {
        window.webapp.callApi.cancelconsult({
          success: (res) => {
            console.log('取消咨询成功')
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="stylus">
.transfer-exten {
  color: rgba(30, 99, 245, 1);
}
.title-info {
  font-weight: 400;
  font-size: 12px;
  display: flex;
  justify-content: center;
  padding: 8px 0 8px;
  align-items: center;
}
.consultation-box {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>
