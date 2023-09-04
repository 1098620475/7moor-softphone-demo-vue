<!--
 * @Author: Wangtao
 * @Date: 2022-11-09 09:28:29
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-28 11:08:19
-->
<template>
	<div class="consultation-box">
    <inprogress :currentType='"consul"'  v-show="isWaiting"></inprogress>
    <div class="spec-btn-box" v-show="!isWaiting">
      <div class="spec-btn" @click="back">
        <i class="iconfont icon-a-jiantou-zuo-line"></i>
        <div class='spec-btn-text'>返回</div>
      </div>
    </div>
    <transfer-selection :transType='"consul"'  v-show="!isWaiting" ></transfer-selection>
  </div>
</template>

<script>
import transferSelection from '../common/transferSelection'
import inprogress from '../common/inprogress'
export default {
  props: {
    eventType: String
  },
  components: {
    transferSelection,
    inprogress
  },
  computed: {
    showTransferCancelDialog() {
      // 取消转接
      return false
    },
    isWaiting () {
      return this.eventType && (this.eventType === 'consultWaiting' || this.eventType.split('_')[0] === 'consultWaiting')
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    // 换行转义
    return2Br(str) {
      return str.replace(/\r?\n/g, '<br/>')
    }
  }
}
</script>
<style scoped lang="stylus">

</style>
