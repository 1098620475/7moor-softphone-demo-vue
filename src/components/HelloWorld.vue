<template>
  <div class="box">
     <div :class="['phone-bar', currentType]">{{textMap[currentType]}}{{currentMap}}</div>
     <div>
      <div v-if="isVisibleBtn('hangup')" @click="hangup">挂机</div>
      <div v-if="isVisibleBtn('hold')" @click="hold">保持</div>
      <div v-if="isVisibleBtn('unhold')" @click="unhold">取消保持</div>
     </div>
     <div class="keyboard-wrap">
        <keyboard @dialout='dialoutTest'></keyboard>
      </div>

      <el-button>测试</el-button>
  </div>
</template>

<script>
import move from './move';
import SoftPhone from './softphone'
import keyboard from './keyboard'
let webapp = null
export default {
  name: 'telephone-strip',
  props: {
    
  },
  directives: {
    move
  },
  components: {
    keyboard
  },
  data () {
    return {
      currentMap: '',
      currentType: '',
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
        // 外呼转接通话
        dialTransfer_Local: ['hangup', 'hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        dialTransfer_sip: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark', 'key'],
        dialTransfer_gateway: ['hangup','hold', 'transfer', 'consul', 'ivr', 'satisfaction', 'remark'], // 外呼通话
        // 内线呼叫
        innerDialing_Local: ['hangup'],
        innerDialing_gateway: ['hangup'],
        innerDialing_sip: ['hangup', 'accept'],
        // 转接振铃
        transferDialing_Local: ['hangup'],
        transferDialing_sip: ['hangup', 'accept'],
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
        transferBelling_sip: ['hangup', 'accept'],
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
        listening_sip: ['hangup', 'accept'],
        listening_gateway: ['hangup'],
        // 内部通话振铃
        innerBelling_sip: ['hangup', 'accept'],
        innerBelling_gateway: ['hangup'],
        innerBelling_Local: ['hangup']
      },
      textMap: {
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
        'hold': '保持'
      }
    }
  },
  methods: {
    dialoutTest (phone) {
      console.log(phone, 'ppppppppppppppppp')
      webapp.callApi.dialout({
      calleeNumber: phone,
      fail: (res) => {
        console.log(res, 'sssssssss')
      },
      success: (res) => {
        console.log('外呼成功')
      }
    })
    },
    isVisibleBtn(type) {
      if (this.currentMap) {
        const mapData = this.renderMap[this.currentMap] || ''
        return mapData && mapData.indexOf(type) > -1
      } else {
        return false
      }
    },
    hangup () {
      webapp.callApi.hangup({})
    },
    hold () {
      webapp.callApi.hold({})
    },
    unhold () {
      webapp.callApi.unhold({})
    }
  },
  mounted () {
    let that = this;
    webapp = new SoftPhone({
    accountId: 'N00000004285',
    agentNumber: '20011@pkjtest-wh',
    password: '123456Aa',
    loginType: 'Local',
    serviceAddress: 'http://10.1.114.23:9500',
    proxy_url: 'http://10.1.114.11:18082',
    error(e){
      console.log(e)
    },
    success(e) {

    }
  })

    webapp.attachEvent({
      message: (event) => {
        that.currentType = event.type
        that.currentMap = event.type + '_Local'
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
.box
  font-size: 14px;
  position: fixed;
  width: 320px;
  z-index: 10000;
  top: 200px;
  left: 200px;
  box-shadow: 0 0 16px rgba(0,0,0,.1);
  border-radius: 8px;
  box-sizing: border-box;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  background-color: hsla(0,0%,100%,.5);
.peerstate
    background: var(--color-primary);
    display: flex;
    align-items: center;
    border-radius: 8px;
    height: 36px;
    padding: 0 12px;
    padding-right: 0;
    margin-bottom: 8px;
    color: #fff;
    position: relative;
    cursor: pointer;
    overflow: hidden;  
</style>
