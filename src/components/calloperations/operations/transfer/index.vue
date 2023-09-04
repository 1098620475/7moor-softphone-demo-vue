<!--
 * @Author: Wangtao
 * @Date: 2022-11-09 09:28:29
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-27 18:03:58
-->
<template>
	<div class="consultation-box">
    <inprogress v-show="isWaiting"></inprogress>
    <div class="spec-btn-box" v-show="!isWaiting">
      <div class="spec-btn" @click="back">
        <i class="iconfont icon-a-jiantou-zuo-line"></i>
        <div class='spec-btn-text'>返回</div>
      </div>
    </div>
    <transfer-selection v-show="!isWaiting" @transHandle='softphonebarTransfer'></transfer-selection>
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
      return this.eventType === 'transferWaiting' || this.eventType.split('_')[0] === 'transferWaiting'
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
    softphonebarTransfer: function (transObj) {
      // 点击表单右侧的转接按钮
      let type = transObj.type
      let number = transObj.number
      let transferReason = transObj.TransferReason || ''
      let TransferReason = this.return2Br(transferReason)
      if (type === 'outline') {
        // 手动输入外线
        let phoneNum = '9' + number
        this.$store.dispatch('phoneTransfer', {
          phoneNum: phoneNum,
          mode: 'number',
          self: this,
          exten: number,
          TransferReason
        })
      } else if (type === 'inline') {
        // 选中下拉框
        let phoneNum = '9' + number
        this.$store.dispatch('phoneTransfer', {
          phoneNum: phoneNum,
          mode: 'number',
          self: this,
          exten: number,
          TransferReason
        })
      } else if (type === 'group') {
        this.$store.dispatch('phoneTransfer', {
          phoneNum: number,
          mode: 'skillgroup',
          self: this,
          TransferReason
        })
      } else {
        this.$message.error(this.$t('cti.agentNumberError'))
      }
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
