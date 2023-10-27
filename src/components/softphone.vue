<template>
  <div class="box">
    当前状态: {{textMap[currentType] ? textMap[currentType] : currentType}}
    <div><el-input v-model="phoneNumber"/></div>
    <div class="oprate">
     <el-button v-if="isVisibleBtn('outbound')" @click="dialoutTest">外呼</el-button>
     <el-button v-if="isVisibleBtn('hangup')" @click="hangup">挂机</el-button>
     <el-button v-if="isVisibleBtn('hold')" @click="hold">保持</el-button>
     <el-button v-if="isVisibleBtn('unhold')" @click="unhold">取消保持</el-button>
     <el-popover
        placement="top"
        width="250"
        v-model="visible">
        <div style="display: flex">
          <el-input size="mini" type="text" v-model="transferNumber" />
          <el-button type="primary" size="mini" @click="transfer">确认转接</el-button>
        </div>
        <el-button slot="reference" v-show="isVisibleBtn('transfer')">转接</el-button>
      </el-popover>
      <el-popover
        placement="top"
        width="250"
        v-model="visible">
        <div style="display: flex">
          <el-input size="mini" type="text" v-model="transferNumber" />
          <el-button type="primary" size="mini" @click="consult">确认咨询</el-button>
        </div>
        <el-button slot="reference" v-show="isVisibleBtn('consul')">咨询</el-button>
      </el-popover>
      <el-button v-if="isVisibleBtn('cancelConsult')" @click="cancelConsult">取消咨询</el-button>
      <el-button v-if="isVisibleBtn('consultTranster')" @click="consultTranster">咨询转移</el-button>
      <el-button v-if="isVisibleBtn('threepartycall')" @click="threepartycall">三方通话</el-button>
       <el-button v-if="isVisibleBtn('satisfaction')" @click="satisfaction">满意度调查</el-button>
     </div>
  </div>
</template>

<script>
let webapp = null
import SoftPhone from './softphone/index'
export default {
  name: 'telephone-strip',
  props: {
    
  },
  directives: {
  
  },
  components: {
    
  },
  data () {
    return {
      transferNumber: '',
      phoneNumber: '',
      currentMap: '',
      currentType: '',
      renderMap: {
        // 空闲
        peerstate_Local: ['outbound'],
        peerstate_gateway: ['outbound'],
        peerstate_sip: ['outbound'],
        // 咨询等待中
        consultWaiting_Local: ['cancelConsult'],
        consultWaiting_gateway: ['cancelConsult'],
        consultWaiting_sip: ['cancelConsult'],
        // 咨询通话中
        consultTalking_Local: ['consultTranster', 'stopConsult', 'threepartycall'],
        consultTalking_gateway: ['consultTranster', 'stopConsult', 'threepartycall'],
        consultTalking_sip: ['consultTranster', 'stopConsult', 'threepartycall'],
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
        'hold': '保持',
        'transferWaiting': '转接中',
        'consultWaiting': '咨询等待',
        'consultTalking': '咨询通话中'
      }
    }
  },
  methods: {
    dialoutTest () {
      const that = this;
      if (!that.phoneNumber) {
        this.$message.error('请输入外呼号码');
        return
      }
      webapp.callApi.dialout({
      calleeNumber: that.phoneNumber,
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
    },
    transfer() {
      const that = this;
      if (!that.transferNumber) {
        this.$message.error('请输入转接号码');
        return
      }
      webapp.callApi.transfer({
        TransferNumber: that.transferNumber
      })
    },
    consult(){
      const that = this;
      if (!that.transferNumber) {
        this.$message.error('请输入咨询号码');
        return
      }
      webapp.callApi.consult({
        ConsultNumber: that.transferNumber
      })
    },
    cancelConsult () {
      webapp.callApi.cancelconsult({
        success: (res) => {
          console.log('取消咨询成功')
        }
      })
    },
    consultTranster () {
      webapp.callApi.transferconsult({
        success: (res) => {
          console.log('咨询转移成功')
        }
      })
    },
    threepartycall () {
      webapp.callApi.threewaycall({})
    },
    satisfaction () {
      webapp.callApi.transferSatisfaction({})
    },
    getAgentPhoneBarList () {
      webapp.agentApi.getAgentPhoneBarList({
        success(res){
          console.log(res, 'ooooooooooooooo')
        }
      })
    }
  },
  mounted () {
    let that = this;
    webapp = new SoftPhone({
    accountId: 'N00000003731',
    agentNumber: '30003@dxtest21',
    password: '123456Aa',
    loginType: 'Local',
    // serviceAddress: 'http://10.1.114.23:9500',
    proxy_url: 'https://pbx-bj-salesman02.7moor.com',
    error(e){
      console.log(e)
    },
    success(e) {
       console.log('初始化成功')
       webapp.agentApi.getAgentPhoneBarList({
        success(res){
          console.log(res, ';;;')
        }
       })
    }
  })

  webapp.attachEvent({
      message: (event) => {
        that.currentType = event.type
        that.currentMap = event.type + '_Local'
        console.log(event, '通话事件--------------------000000')
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
 .box
   display: flex
   flex-direction: column
   max-width: 250px;
   margin: 0 auto;
   .oprate
     margin-top: 20px;

</style>
