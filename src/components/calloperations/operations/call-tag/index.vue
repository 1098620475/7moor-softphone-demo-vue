<!--
 * @Author: Wangtao
 * @Date: 2022-11-09 09:28:29
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-04-21 14:50:31
-->
<template>
	<div class="consultation-box">
    <!-- <div class="spec-btn-box">
      <div class="spec-btn">
        <i class="iconfont icon-a-jiantou-zuo-line"></i>
        <div class='spec-btn-text'>返回</div>
      </div>
    </div> -->
    <div class="remark-box-warp">
      <div class="remark-box">
        <div class='title'>
          <div class="text">{{$t('PhoneStrip.text26')}}</div>
        </div>
        <div class="remark-textarea">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入"
            @blur="saveCdrMemo"
            v-model="customerNote">
          </el-input>
        </div>
        </div>
    </div>
    <div class="remark-box-warp" v-if="isMark && !isHideMulti">
      <div class="remark-box">
        <div class='title'>
          <div class="text">{{$t('PhoneStrip.text27')}}</div>
          <!-- <div class="oprate"><i class="iconfont icon-tianjia-xian"></i>添加</div> -->
        </div>
        <div class="remark-textarea">
           <single-label
            v-if="labelType === 'single'"
            :isDialog="true"
            :checkLabels="checkLabels"
            :callLabel="getSingleLabel"
            :phoneBarFlag="phoneBarFlag"
            :callSheetId="callSheetId"
            :refreshCallLabel="refreshNum"
            :flag="flag"
            :disabled="disabled"
          ></single-label>
          <multi-label
            v-if="labelType === 'multi'"
            :showAdd="showAdd"
            :isDialog="true"
            :checkLabels="checkLabels"
            :phoneBarFlag="phoneBarFlag"
            :callSheetId="callSheetId"
            :showOperaLog="showOperaLog"
            :callLabel="getMultiLabel"
            :refreshCallLabel="refreshNum"
            :flag="flag"
          ></multi-label>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import { getAllUseSingleCallLabel, getAllUseMultiCallLabel, getStrLength, isHasFunc } from '@/utils/m7Utils.js'
import SingleLabel from '@/components/business-modules/call/SingleLabel.vue'
import MultiLabel from '@/components/business-modules/call/MultiLabel.vue'
export default {
  components: {
    MultiLabel,
    SingleLabel
  },
  data () {
    return {
      phoneBarFlag: true,
      isMark: false,
      isHideMulti: false,
      callNote: false,
      customerNote: '',
      refreshNum: 0, // 刷新标签的标志
      getSingleLabel: [], // 单标签
      getMultiLabel: {}, // 多级标签
      labelType: '', // 判断是显示单标签还是多级标签的标志
      checkLabels: [],
      isCallHandUp: true, // 是否挂断
      currentIsCallId: '', // 当前正在通话的id
      dialoutNewCallId: '', // 外呼转接新的id
      showAdd: true, // 添加按钮是否显示
      showOperaLog: false, // 操作日志按钮是否显示
      disabled: false, // 单标签是否是禁止点击
      flag: ''
    }
  },
  computed: {
    callSheetId () {
      return this.$store.state.cti.globalLet.currentCallSheetId
    }
  },
  methods: {
    saveCdrMemo() {
      // 保存备注
      let data = {}
      data.CALL_SHEET_ID = this.callSheetId
      data.memo = this.customerNote
      if (getStrLength(this.customerNote) > 700) {
        this.$message.error(this.$t('call.limitChineseCharacters'))
        return
      }
      let routeArry = this.$route.path.split('/')
      let tabType = routeArry[3]
      let currentCallId = routeArry[4] || ''
      let lastData = { data: data, type: tabType, currentCallId: currentCallId }
      if (
        (tabType === 'cdr_outbound' && this.$store.state.cti.globalLet.outboundScreenCallSheetId) ||
        this.phoneBarFlag
      ) {
        // 去电通话中打备注 || 电话条
        this.callingToMemo(tabType)
      } else if (tabType === 'cdr_call') {
        // 来电模块备注逻辑处理
        let currentCallObj = this.$store.state.cti.globalLet.currentCallUpHandup
        if (currentCallObj && currentCallObj.status === 'up') {
          // 接起
          this.isCallHandUp = false
          this.currentIsCallId = currentCallObj.id // 当前通话的id
        } else {
          this.isCallHandUp = true
          this.currentIsCallId = ''
        }
        if (!this.isCallHandUp && this.callSheetId === this.currentIsCallId) {
          // 正在通话中打备注并且id相等，避免正在通话时去给其他通话记录备注
          this.callingToMemo()
        } else {
          // 挂断电话后打备注
          if (this.dialoutNewCallId) {
            // 外呼转接接起时,会生成一个新的id要重新存起来
            lastData.data.CALL_SHEET_ID = this.dialoutNewCallId
          }
          this.$store.dispatch('saveCdrMemo', lastData).then((resp) => {
            this.commitCommentUpdate()
          })
        }
      } else {
        this.$store.dispatch('saveCdrMemo', lastData).then((resp) => {
          this.commitCommentUpdate()
        })
      }
    },
    callingToMemo() {
      let phoneData = this.$store.state.cti.globalLet.phone_data
      let phoneJson = {
        Channel: phoneData._curChannel,
        pbx: phoneData.pbx_in_ip,
        url: this.getServerUrl,
        value: 'COMMENTS' + this.customerNote,
        callSheetId: this.callSheetId,
        memo: this.customerNote
      }
      this.$store.dispatch('commentCallSheetThroughCall', phoneJson).then((resp) => {
        this.commitCommentUpdate()
        window.localStorage.setItem('phoneBarComments', this.customerNote)
      })
    },
    commitCommentUpdate() {
      this.$store.commit('call/COMMENTS', { id: this.callSheetId, memo: this.customerNote, tabType: 'cdr_call' })
      this.$store.commit('call/COMMENTS', { id: this.callSheetId, memo: this.customerNote, tabType: 'cdr_outbound' })
      this.$store.commit('call/COMMENTS', { id: this.callSheetId, memo: this.customerNote, tabType: 'cdr_pending' })
      this.$store.commit('call/COMMENTS', { id: this.callSheetId, memo: this.customerNote, tabType: 'cdr_all' })
    },
    getAllUseCallLabeles() {
      let labelType = this.$store.state.call.transCache.callLabelType
      this.$store.dispatch('getCache', { type: 'callLabel' }).then((resp) => {
        let singleObj = getAllUseSingleCallLabel(resp || []) // 每次都要重新存，不然子组件检测不到变化
        this.$store.commit('call/SET_CALL_SINGLE_LABEL', singleObj)
        let multiObj = getAllUseMultiCallLabel(resp || [])
        this.$store.commit('call/SET_CALL_MULTI_LABEL', multiObj)
        if (labelType === 'single') {
          this.getSingleLabel = singleObj.singleLabel
        } else if (labelType === 'multi') {
          this.getMultiLabel = multiObj
          this.handleLocalLabel()
        }
      })
    },
     handleLocalLabel() {
      let labelIdObj = JSON.parse(window.localStorage.getItem('labelIdObj'))
      if (labelIdObj) {
        let newCallId = this.$store.state.cti.globalLet.currentCallSheetId
        if (newCallId) {
          // 前提要先先取到当前的通话id
          let localCallId = labelIdObj.callId
          if (newCallId !== localCallId) {
            // 当前id和本地存储的id不一致时，重新储存
            try {
              // try catch是因为local存储暴了之后，会报错，影响后面的逻辑进行
              window.localStorage.setItem('labelIdObj', JSON.stringify({ callId: newCallId, labelIdArray: [] }))
            } catch (e) {}
          }
          let obj = JSON.parse(window.localStorage.getItem('labelIdObj'))
          if (obj) {
            if (obj.labelIdArray) {
              this.checkLabels = obj.labelIdArray
            } else {
              this.checkLabels = []
            }
          }
        }
      }
    },
    openDialog(item) {
      this.callNote = true
      let routeArry = this.$route.path.split('/')
      let tabType = routeArry[3]
      if (
        tabType === 'cdr_all' &&
        item.DISPOSAL_AGENT !== this.$store.state.session.user._id &&
        !item.LABELS &&
        !this.phoneBarFlag
      ) {
        // 全部 && 当前通话处理人不是自己 && 没有打过标签 && 不是电话条
        this.isHideMulti = true
      } else {
        this.isHideMulti = false
      }
      if (isHasFunc('func_mark_cdr', this.$store.state.session.user)) {
        this.isMark = true // 通话标签权限
      }
      if (
        tabType === 'cdr_all' &&
        item.DISPOSAL_AGENT !== this.$store.state.session.user._id &&
        !this.phoneBarFlag &&
        this.labelType === 'single'
      ) {
        // 全部 && 当前通话处理人不是自己 && 不是电话条
        this.disabled = true
      } else {
        this.disabled = false
      }
      if (tabType === 'cdr_pending') {
        // UNDEAL 通话待处理的打标签去掉处理坐席验证，即：处理坐席不是自己也可以打标签
        this.flag = 'UNDEAL'
      } else {
        this.flag = ''
      }
      if (this.phoneBarFlag) {
        // 电话条的备注存储到local
        let localComments = window.localStorage.getItem('phoneBarComments')
        this.customerNote = localComments || ''
      } else {
        this.customerNote = item.COMMENTS || ''
      }
      if (this.phoneBarFlag && this.$store.state.call.transCache.callLabelType === 'multi') {
        this.handleLocalLabel()
      } else {
        this.checkLabels = item.LABELS || []
      }
      // this.callSheetId = item.CALL_SHEET_ID || ''
      this.dialoutNewCallId = item.dialoutNewCallId || ''
      this.refreshNum = Math.random()
    }
  },
  beforeMount() {
    let labelType = this.$store.state.call.transCache.callLabelType
    this.labelType = labelType
    this.getAllUseCallLabeles()
  },
  mounted() {
    this.openDialog({})
  }
}
</script>
<style scoped lang="stylus">
.remark-box-warp {
  padding: 8px;
  padding-bottom: 0
}
.title {
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .text {
    font-weight: 500;
    font-size: 14px;
  }
  .oprate {
    color: #459AE9;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px 0;
    border-radius: 4px;
    cursor pointer;
  }
  .oprate:hover{
    background-color: #E8EFFE;
  }
}
.remark-textarea {
  padding: 0 8px 0;
}
.remark-box {
  background-color: #FFFFFF;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  :deep(.label-span){
    white-space: normal!important;
  }
  .remark-textarea{
    padding-bottom: 8px;
    max-height: 200px;
    overflow-y: scroll;
  }
  >>> .label-span {
    background: rgba(247, 247, 247, 1);
    border: 0 !important;
  }
}
</style>
<style lang='stylus'>
  .remark-box-warp {
    .remark-box {
    .label-span{
      white-space: normal!important;
    }
  } 
  }
</style>
