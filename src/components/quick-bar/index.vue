<!--
 * @Author: Wangtao
 * @Date: 2022-11-07 14:41:13
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-07-03 14:52:31
-->
<template>
	<div class="quick-bar">
    <div class="status onthecall" :class="[currentStyleClass]">
      <div class="status-text">{{ctiUiDesc}}<span v-show="showNumber" class="number-box">{{number}}</span></div>
      <div class="timer">
        <phoneBarTimer ref="phoneBarTimeRef" class="phone-bar-timer"></phoneBarTimer>
      </div>
    </div>
    <div class="oprate">
      <div class="oprate-btn hangup" @click.stop='phoneHangup' v-if="isVisibleBtn('hangup')">
        <i class="iconfont icon-guaji11"></i>
      </div>
      <div class="oprate-btn accept"  v-if="isVisibleBtn('accept') && showAnswer" @click="answerClick">
        <i class="iconfont icon-hujiaohuojieting"></i>
      </div>
    </div>
    <!-- <div class="tip" v-if="transferData.TransferReason && showTip">
      <div class="title">
        {{$t('cti.trasferReasonTip2', {agent:transferAgent,agentNum:transferAgentNum})}}
        <div class="text">通话转接来自【{{transferData.TransferAgent}}】，转接原因如下:</div>
        <div class="close" @click="showTip = false"><i class="iconfont icon-guanbi2"></i></div>
      </div>
      <div class="info">
        {{transferData.TransferReason}}
      </div> -->
    </div>
  </div>
</template>

<script>
import phoneBarTimer from '../phoneBarTimes'
export default {
  components: {
    phoneBarTimer
  },
  props: {
    currentEventType: {
      type: String
    },
    number: {
      type: String
    },
    showNumber: {
      type: Boolean
    }
  },
  watch: {
    currentEventType: {
      handler: function () {
        this.timeRecording('timing')
      },
      immediate: true
    }  
  },
  computed: {
    showAnswer() {
      // return this.$store.state.webrtc.showAnswer
      return this.$store.state.webrtc.showAutoAnswer
    },
    currentStyleClass() {
      // 给电话条底色根据状态添加class
      return this.currentEventType.split('_')[0]
    },
    ctiUiDesc() {
      // 通话状态
      let eventType = this.currentEventType ? this.currentEventType.split('_')[0] : ''
      if (eventType) {
        let textMap = {
          'dialing': '呼叫中',
          'unregister': '未注册', 
          'peerstate': '空闲',
          'innerDialing': '呼叫中',
          'belling': '来电振铃',
          'innerBelling': '来电振铃',
          'listening': '监听振铃',
          'talking': '通话中',
          'threeWayTalking': '三方通话中',
          'innerTalking': '内部通话',
          'dialTalking': '外呼通话',
          'listened': '监听中',
          'transferBelling': '转接振铃',
          'transferDialing': '转接通话',
          'transfer': '转接通话',
          'dialTransfer': '外呼转接通话',
          'hold': '保持',
          'consultWaiting': '咨询等待',
          'consultTalking': '咨询通话',
          'transferOprate': '转接操作',
          'consulOprate': '咨询操作',
          'IVR': '转IVR操作',
          'satisfaction': '满意度调查',
          'transferWaiting': '转接操作'
        }
        return textMap[eventType] || '未知事件'
      } else {
        return '未知事件'
      }
    }
  },
  data () {
    return {
      renderMap: {
        // 呼叫中
        dialing_Local: ['hangup', 'remark'],
        dialing_gateway: ['hangup', 'remark'],
        dialing_sip: ['hangup', 'remark'],
        // 通话中
        dialTalking_Local: ['hangup', 'hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        dialTalking_sip: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark', 'key'],
        dialTalking_gateway: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        talking_Local: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        talking_sip: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark', 'key'],
        talking_gateway: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        hold_Local: ['hangup', 'unhold'], // 保持
        hold_gateway: ['hangup', 'unhold'],
        hold_sip: ['hangup', 'unhold'],
        // 来电振铃
        belling_Local: ['hangup'],
        belling_gateway: ['hangup'],
        belling_sip: ['hangup', 'accept'],
        // ivr
        IVR: ['univr', 'hangup'],
        // 咨询操作
        consulOprate: ['unconsul', 'hangup'],
        // 转接操作
        transferOprate: ['untransfer', 'hangup'],
        transferWaiting: ['untransfer', 'hangup'],
        // 外呼转接通话
        dialTransfer_Local: ['hangup', 'hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        dialTransfer_sip: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark', 'key'],
        dialTransfer_gateway: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        // 内线呼叫
        innerDialing_Local: ['hangup'],
        innerDialing_gateway: ['hangup'],
        innerDialing_sip: ['hangup'],
        // 转接振铃
        transferDialing_Local: ['hangup'],
        transferDialing_sip: ['hangup'],
        transferDialing_gateway: ['hangup'],
        // 咨询通话
        consultTalking_Local: ['hangup', 'threepartycall', 'closetheconsul', 'transferconsul', 'remark'],
        consultTalking_sip: ['hangup', 'threepartycall', 'closetheconsul', 'transferconsul', 'remark'],
        consultTalking_gateway: ['hangup', 'threepartycall', 'closetheconsul', 'transferconsul', 'remark'],
        // 三方通话
        threeWayTalking_Local: ['hangup', 'endthethreewaycall', 'remark'],
        threeWayTalking_gateway: ['hangup', 'endthethreewaycall', 'remark'],
        threeWayTalking_sip: ['hangup', 'endthethreewaycall', 'remark'],
        rtckeys: ['unrtckeys', 'hangup'],
        satisfaction: ['unsatisfaction', 'hangup'],
        label: ['unlabel', 'hangup'],
        // 咨询通话
        innerTalking_Local: ['hangup'],
        innerTalking_sip: ['hangup'],
        innerTalking_gateway: ['hangup'],
        // 转接振铃
        transferBelling_sip: ['hangup'],
        transferBelling_Local: ['hangup'],
        transferBelling_gateway: ['hangup'],
        // 转接通话
        transfer_Local: ['hangup', 'hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        transfer_sip: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark', 'key'],
        transfer_gateway: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话 
        // 监听中
        listened_Local: ['hangup'],
        listened_sip: ['hangup'],
        listened_gateway: ['hangup'],
        // 监听振铃
        listening_Local: ['hangup'],
        listening_sip: ['hangup'],
        listening_gateway: ['hangup'],
        // 内部通话振铃
        innerBelling_sip: ['hangup'],
        innerBelling_gateway: ['hangup'],
        innerBelling_Local: ['hangup']
      },
      showTip: true
    }
  },
  methods: {
    phoneHangup() {
      window.webapp.callApi.hangup({})
    },
    setQuickState () {
      this.$emit('setQuickState', false)
    },
    isVisibleBtn(type) {
      if (this.currentEventType) {
        let mapData = ''
        if (this.renderMap[this.currentEventType] && this.renderMap[this.currentEventType].length > 0) {
          mapData = this.renderMap[this.currentEventType]
        } else {

          let key = this.currentEventType.split('_')[0]
          mapData = this.renderMap[key] || ''
        }
        return mapData && mapData.indexOf(type) > -1
      } else {
        return false
      }
    },
    answerClick() {
      this.$store.dispatch('Answer')
    },
    timeRecording (type, timestamp) {
      this.$nextTick(()=>{
        let second = 0;
        if (timestamp) {
          const beginDate = new Date(timestamp);
          const endDate = new Date();
          const diff = endDate.getTime() - beginDate.getTime();
          second = diff / 1000;
        }
        this.$refs.phoneBarTimeRef && this.$refs.phoneBarTimeRef.timerTypeChange({ timeType: type, statusTime: second });  
      })
    }
  }
}
</script>
<style scoped lang="stylus">
.quick-bar {
  position relative;
  // background: rgba(255, 255, 255, 0.8);
  // box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  .number-box {
    margin-left: 3px;
  }
  backdrop-filter: blur(16px);
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  .status {
    height: 40px;
    border-radius: 8px;
    background-color: var(--color-success);;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 0;
    box-sizing: border-box;
    color: #fff;
    font-weight: 400;
    font-size: 14px;
    .icon-kuozhan-zhankai-xian {
      cursor: pointer;
    }
  }
  .transferBelling {
    background: var(--color-warning);
  }
  .transferDialing {
    background: var(--color-warning)
  }
  .belling {
    background: var(--color-warning);
  }
  .hold {
    background-color: var(--color-success);
  }
  .dialing {
    background: var(--color-warning);
  }
  .ringing {
    background: var(--color-warning);
  }
  .dialTalking {
    background: var(--color-success);
  }
  .oprate {
    display: flex;
    .oprate-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      .iconfont {
        font-size: 14px;
      }
      margin-left: 8px;
      cursor pointer;
    }
    .accept {
      background-color: var(--color-success);
    }
    .hangup {
      background-color: var(--color-danger);
    }
    .hangup:hover{
      opacity: .8;
    }
  }
  .phone-bar-timer {
    margin-right: 10px;
  }
  .tip {
    position absolute;
    background: #FFFFFF;
/* 基础投影 */
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    top: calc(100% + 8px);
    left: 0;
    padding: 16px;
    box-sizing: border-box;
    .title {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      .text {
        flex: 1
        font-weight: 500;
        font-size: 14px;
      }
      .close {
        .iconfont {
          font-size: 20px;
          cursor pointer;
        }
      }
    }
    .info {
      font-weight: 400;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>
