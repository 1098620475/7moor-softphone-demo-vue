<!--
 * @Author: Wangtao
 * @Date: 2022-11-07 14:41:13
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-09-26 18:48:14
-->
<template>
	<div class="call-operations-box">
    <div class="quick-box" @mouseenter='onMouseenter' @mouseleave="onMouseleave">
      <quick-bar :currentEventType='currentEventType' :backType='backType'></quick-bar>
      <div class='oprate-warp' v-show="showOprate">
        <div class="on-the-call-btn" v-show="true">
          <div class="call-btn" @click="phoneHold" v-if="isVisibleBtn('hold')">
              <div class="icon"><i class="iconfont icon-baochi1"></i></div>
              <div class="text">保持</div>
            </div>
            <div class="call-btn" @click="setCurrentType('transferOprate')" v-if="isVisibleBtn('transfer')">
              <div class="icon"><i class="iconfont icon-zhuanjie"></i></div>
              <div class="text">转接</div>
            </div>
            <div class="call-btn" @click="setCurrentType('consulOprate')" v-if="isVisibleBtn('consul')">
              <div class="icon"><i class="iconfont icon-zixun"></i></div>
              <div class="text">咨询</div>
            </div>
            <div class="call-btn" @click="setCurrentType('IVR')" v-if="isVisibleBtn('ivr')">
              <div class="icon"><i class="iconfont icon-ivr1"></i></div>
              <div class="text">IVR</div>
            </div>
            <div class="call-btn" @click="setCurrentType('satisfaction')" v-if="isVisibleBtn('satisfaction')">
              <div class="icon"><i class="iconfont icon-manyidu"></i></div>
              <div class="text">满意度调查</div>
            </div>
          <div class="call-btn" @click="toRTCkeys" v-if="isVisibleBtn('key')">
              <div class="icon"><i class="iconfont icon-jianpan"></i></div>
              <div class="text">键盘</div>
            </div>
            <div class="call-btn" @click="showTransferReason = true" v-if="transferData.TransferReason && !showTransferReason">
              <div class="icon"><i class="iconfont icon-xinxi-line"></i></div>
              <div class="text">转接原因</div>
            </div>
            <div class="call-btn"  @click.stop="phoneThreewaycall('912345')" v-if="isVisibleBtn('threepartycall')">
              <div class="icon"><i class="iconfont icon-sanfangtonghua"></i></div>
              <div class="text">三方通话</div>
            </div>
            <div class="call-btn" @click="transferConsul('912345', 'number')" v-if="isVisibleBtn('transferconsul')">
              <div class="icon"><i class="iconfont icon-zixunzhuanyi1"></i></div>
              <div class="text">转接咨询</div>
            </div>
            <div class="call-btn" @click="phoneStopConsult" v-if="isVisibleBtn('closetheconsul')">
              <div class="icon"><i class="iconfont icon-quxiaozixun1"></i></div>
              <div class="text">结束咨询</div>
            </div>
        </div>
        <div class="spec-oprate">
          <div class="keep-hold" v-if="isVisibleBtn('unhold')">
            <div class="spec-btn-box">
              <div class="spec-btn" @click.stop="phoneUnhold">
                <i class="iconfont icon-quxiaobaochi2"></i>
                <div class='spec-btn-text'>取消保持</div>
              </div>
            </div>
          </div>
          <div class="consultation" v-show="isVisibleBtn('unconsul')">
            <consultation :eventType='eventType' @back='setBackType'></consultation>
          </div>
          <div class="ivr" v-if="isVisibleBtn('univr')">
            <div class="spec-btn-box">
              <div class="spec-btn" @click="setBackType">
                <i class="iconfont icon-quxiaoivr"></i>
                <div class='spec-btn-text'>取消转IVR</div>
              </div>
            </div>
            <ivrOprate></ivrOprate>
          </div>
          <div class="transfer" v-show="isVisibleBtn('untransfer')">
            <transfer :eventType='eventType' @back='setBackType'></transfer>
          </div>
          <div class="satisfaction" v-if="isVisibleBtn('unsatisfaction')">
            <div class="spec-btn-box" style="margin-bottom: 8px">
              <div class="spec-btn" @click="setBackType">
                <i class="iconfont icon-a-jiantou-zuo-line"></i>
                <div class='spec-btn-text'>返回</div>
              </div>
            </div>
            <satisfaction></satisfaction>
          </div>
          <div class="key" v-if="isVisibleBtn('unrtckeys')">
            <div class="spec-btn-box">
              <div class="spec-btn" @click="phoneSetCurrentType">
                <i class="iconfont icon-quxiaojianpan"></i>
                <div class='spec-btn-text'>取消键盘</div>
              </div>
            </div>
            <keyboard :styleType='"type2"'></keyboard>
          </div>
          <div class='endthethreewaycall' v-if="isVisibleBtn('endthethreewaycall')">
            <endthethreewaycall></endthethreewaycall>
          </div>
          <div class='TransferReason'>
            <div class="tip" v-if="attachData.TransferReason && showTransferReason">
              <div class="title">
                <div>
                <div class="text">通话转接来自【{{attachData.TransferAgent}}】，转接原因如下</div>
                <div class="text">{{attachData.showTransferReason}}</div>
                </div>
                <div class="close" @click="showTransferReason = false"><i class="iconfont icon-guanbi2"></i></div>
              </div>
              <div class="info">
                {{attachData.TransferReason}}
              </div>
            </div>
          </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import phoneBarTimer from '../phoneBarTimes'
import keyboard from '../keyboard'
import ivrOprate from './operations/ivr'
import consultation from './operations/consultation/index'

import quickBar from '../quick-bar/index'

import endthethreewaycall from './operations/consultation/endthethreewaycall'

import satisfaction from './operations/satisfaction'

import transfer from './operations/transfer/index'

export default {
  props: {
    eventType: {
      type: String
    },
    attachData: {
      type: Object
    }
  },
  watch: {
    eventType: {
      handler: function(val) {
        this.currentEventType = val
      },
      immediate: true
    }
  },
  computed: {
    showAnswer() {
      return this.$store.state.webrtc.showAnswer
    },
    callingNum() {
      // 正在通话中的号码
      return this.$store.state.cti.globalLet.callingNum
    },
    callObject () {
      return this.$store.state.cti.globalLet._phone_callObject
    },
    calleeArea() {
      // 号码归属地
      let area = this.$store.state.cti.globalLet.calleeArea
      if (area.indexOf(' ') !== -1) {
        area = area.replace(/\s/gi, '')
      }
      return area
    },
    transferData () {
      return {}
    }
  },
  components: {
    phoneBarTimer,
    keyboard,
    ivrOprate,
    consultation,
    transfer,
    endthethreewaycall,
    satisfaction,
    quickBar
  },
  data () {
    return {
      currentEventType: '',
      backType: '',
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
        consultWaiting: ['unconsul', 'hangup'],
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
        threeWayTalking: ['hangup', 'endthethreewaycall', 'remark'],
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
      showTransferReason: true,
      showOprate: false
    }
  },
  methods: {
    onMouseenter () {
      this.showOprate = true
    },
    onMouseleave () {
      if (this.isVisibleBtn('unhold')) {
        return
      }
      if (this.isVisibleBtn('unconsul')) {
        return
      }

      if (this.isVisibleBtn('untransfer')) {
        return
      }

      if (this.isVisibleBtn('unlabel')) {
        return
      }

      if (this.isVisibleBtn('endthethreewaycall')) {
        return
      }
      
      if (this.isVisibleBtn('univr')) {
        return
      }

      if (this.isVisibleBtn('unsatisfaction')) {
        return
      }
      this.showOprate = false
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
    setCurrentType (type) {
      this.backType = this.currentEventType;
      this.currentEventType = type;
    },
    setBackType(){
      this.currentEventType = this.backType
    },
    // 通话接口
    phoneHangup() {
      // this.trasferReason = ''
      this.$store.dispatch('phoneHangup')
    },
    // 保持
    phoneHold() {
      window.webapp.callApi.hold({})
    },
    // 取消保持
    phoneUnhold() {
      window.webapp.callApi.unhold({})
    },
    phoneConsul () {
      this.currentEventType = 'consulOprate'
    },
    phoneTransfer () {
      this.currentEventType = 'transferOprate'
    },
    phoneSetCurrentType () {
      this.currentEventType = this.backType
    },
    phoneStopConsult() {
      // 结束咨询
      window.webapp.callApi.endconsult({
        fail: (res) => {
          console.log(res)
        },
        success: (res) => {
          console.log('结束咨询成功')
        }
      })
    },
    transferConsul() {
      // 转移咨询
      window.webapp.callApi.transferconsult({
        fail: (res) => {
          console.log(res, '转移咨询失败')
        },
        success: (res) => {
          console.log('转移咨询成功')
        }
      })
    },
    phoneThreewaycall(num) {
      // 转三方通话
      window.webapp.callApi.threewaycall({
        fail: (res) => {
          console.log(res, '三方通话失败')
        },
        success: (res) => {
          console.log('三方通话成功')
        }
      })
    },
    toRTCkeys () {
      this.backType = this.currentEventType
      this.currentEventType = 'rtckeys'
    },
    answerClick() {
      this.$store.dispatch('Answer')
    }
  }
}
</script>
<style scoped lang="stylus">
.quick-box {
  background: red;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
}
.TransferReason {
  .tip {
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
.call-operations-box {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    backdrop-filter: blur(8px);
    background-color: rgba(255,255,255,0.5);
  .toggle-thin {
    position: absolute;
    background-color: #F2F2F2;
    color: #A6A6A6;
    right: 0;
    top: 0;
    width: 26px;
    height: 26px;
    border-bottom-left-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor pointer;
  }
  .top {
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    .status-box{
      height: 20px;
      border-radius: 10px;
      background-color: #FF8404;
      display: flex;
      align-items: center;
      padding: 0 12px 0;
      color: #fff;
      font-weight: 400;
      font-size: 14px;
      box-sizing: border-box;
      margin-right: 8px;
    }
    .number {
      height: 20px;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
    // 呼叫状态
    .dialTalking {
      background-color: #2BB24C;
    }
    .hold {
      background-color: #2BB24C;
    }
  }
  .customer-info {
    padding: 0 16px 16px;
    box-sizing: border-box;
    .number-location {
      display: flex;
      justify-content: space-between;
      height: 20px;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    .name {
      font-size: 20px;
      color: #000;
      font-weight: 500;
      display: block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
    .time {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    margin: 16px 0 8px;
    .region {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }
    .tag {
      height: 18px;
      background-color: #EEF0F2;
      color: #252C32;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      align-items: center;
      border-radius: 9px;
      padding: 0 6px 0;
    }
  }
  .oprate-warp {
    background #fff;
    border-radius: 8px;
  }
  .answer-hangup-btn:hover {
    opacity: .8;
  }
  .answer-hangup-btn {
    padding: 8px;
    box-sizing: border-box;
    display: flex;
    .btn {
      display: flex;
      height: 40px;
      border-radius: 8px;
      align-items: center;
      background: var(--color-danger);
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      justify-content: center;
      cursor pointer;
      .iconfont {
        margin-right: 8px;
      }
    }
    .hangup {
      flex: 1;
      // margin-right: 8px;
    }
    .answer{
      width: 60%;
      background-color: #2BB24C;
    }
  }

  .on-the-call-btn {
    display: flex;
    flex-direction: row;
    padding: 0 8px 0;
    flex-wrap: wrap;
    box-sizing: border-box;
    .call-btn:nth-child(3n-1) {
      margin: 0 9px 8px;
    }
    .call-btn:only-child{
      flex: 1;
    }
    .call-btn{
        float: left;
        width: calc(33.3333% - 6px)
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 0 8px;
        box-sizing: border-box;
        cursor pointer;
        border-radius: 8px;
        color: rgba(0, 0, 0, 0.88);
        background: #FFFFFF;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
        .text {
          font-size: 12px;
          font-weight: 400;
        }
        margin-bottom: 8px;
      }
      .call-btn:hover{
        background-color: #F2F2F2;
      }
    .call-btn-row {
      // display: flex;
      margin-bottom: 8px;
      // overflow: hidden;
      width: 100%;
      .call-btn:nth-child(2) {
        margin: 0 9px 0;
      }
      .call-btn{
        float: left;
        width: calc(33.3333% - 6px)
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 0 8px;
        box-sizing: border-box;
        cursor pointer;
        border-radius: 8px;
        color: rgba(0, 0, 0, 0.88);
        background: #FFFFFF;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
        .text {
          font-size: 12px;
          font-weight: 400;
        }
      }
      .call-btn:hover{
        background-color: #F2F2F2;
      }
    }
  }
  .spec-oprate {
    .keep-hold {
      margin-bottom: 8px;
    }
    >>> .spec-btn-box {
      display: flex;
      padding: 0 8px 0;
      box-sizing: border-box;
      .spec-btn {
        flex: 1;
        height: 52px;
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        cursor pointer;
        font-weight: 400;
        font-size: 12px;
        .iconfont {
          font-weight: 400;
          font-size: 12px;
        }
      }
      .spec-btn:hover {
        background-color: #F2F2F2;
      }
    }
  }
}
</style>
