<template>
  <div class="mc-call-variable">
    <el-button class="logout" @click="logout">登出</el-button>
    <div :class="{'phone-bar': true, 'onthecall': onTheCallState}" v-move="{top: 300, left: 550}" @mouseenter='onMouseenter' @mouseleave="onMouseleave">
      <!-- 通话状态条 -->
      <!-- {{currentMapType}}
      {{currentEventType}} -->
      <div class="peerStatus-wrap" v-if="!onTheCallState">
        <div class="peerStatus" :class="[currentStyleClass]">
          <el-dropdown class="status-select"  @command="changeCdrStatus" trigger="hover" style="min-width: 55px">
            <span class="status-name" v-show="!isUnregister">
              {{ctiUiDesc}} <i class="el-icon-caret-bottom"></i>
            </span>
            <span class="status-name" v-show="isUnregister">
              未连接
            </span>
            <el-dropdown-menu  slot="dropdown">
              <el-dropdown-item v-for="(status, index) in phoneBarStauts" :command="status.value"  v-show="status.value !== currentPeerstate && !isUnregister" :key="index"><div class="drop-status"><span :class="['round', 'type' + status.value]"></span><span>{{status.label}}</span></div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="login-type" v-show="!showConfig">
            <div class="left"></div>
            <div class="middle pointer" @click.stop="goToSetting({status: true})">{{ getLoginTypeText }} <i class="el-icon-caret-right"></i></div>
            <div class="right"></div>
          </div>
          <div class="time-box" v-show="!isUnregister">
            <phoneBarTimer v-if="!onTheCallState" ref="phoneBarTimeRef" />
            <span class="span-icon">
              <i @click="toggleKeyBoard(true)" class="iconfont icon-a-hujiaojieting" v-show="!showKeyBoard"></i>
              <i @click="toggleKeyBoard(false)" class="iconfont icon-kuozhan-shouqi-xian" v-show="showKeyBoard"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="keyboard-wrap" v-show="!showConfig">
        <keyboard v-show="!onTheCallState && !isUnregister"></keyboard>
        <call-operations :attachData='attachData' :eventType='currentMapType' v-if="onTheCallState"></call-operations>
      </div>
      <switchLoginType @switchConfig='goToSetting' v-if="showConfig"></switchLoginType>
    </div>
  </div>
</template>

<script>
import move from './move';
import phoneBarTimer from './phoneBarTimes'

import keyboard from './keyboard'

import callOperations from './calloperations/index'

import switchLoginType from './switchLoginType'

import SoftPhone from '7moor-softphone-sdk'



export default {
  name: 'telephone-strip',
  components: {
    phoneBarTimer,
    keyboard,
    callOperations,
    switchLoginType
  },
  directives: {
    move
  },
  computed: {
    getLoginTypeText () {
      if (this.currentLoginType === 'Local') {
        return '手机'
      } else if (this.currentLoginType === 'sip') {
        return '软电话'
      } else {
        return '话机'
      }
    },
    currentStatus () {
      return 'unregister'
    },
    ctiUiDesc () {
      let desc = ''
      this.phoneBarStauts.some((state) => {
        if (state.value === this.currentPeerstate) {
          desc = state.label
        } else if (this.currentPeerstate === '99') {
          desc = '后处理'
        }
      });
      return desc
    },
    currentStyleClass() {
      if (this.isUnregister) {
        return 'unregister'
      } else {
        return this.currentPeerstate === '0' ? 'peerstate' : 'busy'
      }      
    },
    onTheCallState () {
      return ['consultWaiting', 'transferWaiting', 'belling', 'dialing', 'dialTalking', 'innerDialing', 'listening', 'talking', 'threeWayTalking', 'hold', 'consultTalking', 'dialTransfer', 'transfer', 'transferBelling', 'transferDialing', 'innerTalking', 'listened', 'innerBelling'].includes(this.currentEventType)
    },
    isUnregister () {
      return this.currentEventType === 'unregister'
    }
  },
  methods: {
    changeCdrStatus(command) {
      // 切换软电话条状态
      window.webapp.agentApi.updateAgentStatus({
        statusValue: command
      })
    },
    goToSetting ({status, type}) {
      console.log(status, 'llll', type)
      this.showConfig = status
      if (type) {
        this.currentLoginType = type
      }
    },
    toggleKeyBoard (state) {
      this.showKeyBoard = state
    },
    onMouseenter () {
      if (!this.onTheCallState && !this.showConfig && !this.isUnregister) {
        this.showKeyBoard = true
      }
    },
    onMouseleave (event) {
      if (event && event.relatedTarget) {
        let rt = event.relatedTarget.getAttribute('class')
        if (rt === 'mask') {
          return
        } 
      }
      this.showKeyBoard = false
    },
    initSoftPhone () {
      let that = this;
      webapp.agentApi.getAgentPhoneBarList({
        success(res){
          that.phoneBarStauts = res.data
        }
      })
      webapp.agentApi.getAgentInfo({
        success: (res) => {
          if (res.success) {
            let userInfo = res.data;
            let loginType = userInfo.loginType;
            that.currentLoginType = loginType;
            webapp.attachEvent({
              message: (event) => {
                that.currentEventType = event.type
                that.currentMapType = event.type + '_' + that.currentLoginType
                if (event.attachData) {
                  that.attachData = event.attachData
                } else {
                  that.attachData = {}
                }
                console.log(event, '通话事件--------------------')
                if (event.type === 'kick') {
                  this.$alert('您当前的会话已经失效,导致该问题的原因是别的座席使用相同的帐号（或相同的分机）登录了', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                    }).then(() => {
                      this.$router.replace({
                        path: '/login'
                      })
                    });
                }
                const timeType = event.typeValue && event.typeValue === '99' ? 'countDown' : 'timing';
                that.setPeerState(event)
                if (event.statusTime) {
                  this.timeRecording(timeType, event.statusTime);
                } else {
                  this.timeRecording(timeType);
                }
              }
            })
          }
        }
      })
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
    },
    setPeerState (event) {
      if (event.type === 'peerstate' && event.typeValue) {
        this.currentPeerstate = event.typeValue
      }
    },
    logout () {
      let that = this;
      window.webapp.agentApi.Logout({
        success() {
          window.token = false;
          that.$router.replace({
            path: '/login'
          })
        }
      })
    }
  },
  data () {
    return {
      showConfig: false, // 是否显示切换设置界面
      showKeyBoard: false, // 是否显示键盘
      phoneBarStauts: [],
      currentPeerstate: '',
      currentEventType: 'unregister',
      currentMapType: 'unregister_Local',
      currentLoginType: 'Local',
      ruleForm: {
        username: '20011@pkjtest-wh',
        password:'123456Aa',
        pbxUrl: 'http://10.1.114.11:18082',
        accountId: 'N00000004285'
      },
      attachData: {}
    }
  },
  mounted () {
    let that = this;
    that.initSoftPhone()
    // window.webapp = new SoftPhone({
    //   accountId: that.ruleForm.accountId,
    //   agentNumber: that.ruleForm.username,
    //   password: that.ruleForm.password,
    //   loginType: 'Local',
    //   serviceAddress: 'https://dev-kf.7moor.com:3443',
    //   proxy_url: that.ruleForm.pbxUrl,
    //   error(e){
    //     console.log(e)
    //   },
    //   success(e) {
    //     window.token = true
    //     that.initSoftPhone()
    //   }
    // })
  }
};
</script>
<style scoped lang="stylus">
.logout {
  position: fixed;
}
.phoneMenu {
  z-index: 10001 !important;
}
.offlineTip {
  z-index: 10001 !important;
}
.drop-status .type0{
  background: var(--color-primary) !important;
}
</style>


<style scoped lang="stylus">
.drop-status {
  display: flex;
  align-items: center;
  .round {
    display: block;
    width: 6px;
    height: 6px;
    background: var(--color-danger);
    border-radius: 50%;
    margin-right: 8px;
  }
}
.mc-call-variable {
  background-color: var(--color-primary)
}
.width-full {
  width: 100%;
}
.oprate-transfer {
  background: white;
  border-radius: 8px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 8px;
}
.phone-bar {
  overflow: hidden;
  font-size: 14px;
  position: fixed;
  width: 320px;
  z-index: 200;
  top: 0px;
  left: 200px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1)
  border-radius: 8px;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  background-color: rgba(255,255,255,0.5);
  &:hover {
    .setting {
      display: block;
    }
    .dial {
      display: block;
      height: 344px;
      margin-bottom: 8px;
    }
  }
  .left-switch {
    position: absolute;
    width: 20px;
    height: 64px;
    background: rgba(255, 255, 255, 0.9);
    top: 20px;
    left: -20px;
    // border-top-left-radius: 6px;
    // border-bottom-left-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  .left-switch::before {
    content: '';
    width: 20px;
    position: absolute;
    height: 16px;
    top: -16px;
    // background-image: url('~@/assets/images/phonebar/top.svg');
  }
  .left-switch::after {
    content: '';
    width: 20px;
    position: absolute;
    height: 16px;
    bottom: -16px;
    // background-image: url('~@/assets/images/phonebar/bottom.svg');
  }
}
.onthecall {
  background-color: transparent;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);;
}

.scale0 .link-hangup {
  animation: scale0 0.3s 1 forwards;
  animation-delay: 0s;
}

.scale0 .link-oprate {
  height: 0;
  animation: scale1 0.1s 1 forwards;
  animation-delay: 0.3s;
  overflow: hidden;
}

.link-oprate .btn:hover {
  animation: btn-size 0.3s 1;
}

.scale0 .peerStatus {
  height: 0;
  animation: scale1 0.1s 1 forwards;
  animation-delay: 0.3s;
  overflow: hidden;
}

@keyframes scale0 {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}
@keyframes scale1 {
  from {
    height: 0;
  }

  to {
    height: auto;
  }
}
.peerStatus-wrap {
  padding: 8px;
  padding-bottom: 0;
  box-sizing: border-box;
}
.keyboard-wrap {
  padding: 0 0px 0;
}
.peerStatus {
  background: var(--color-primary);
  display: flex;
  align-items: center;
  // justify-content: space-between;
  border-radius: 8px;
  height: 36px;
  padding: 0 12px;
  padding-right: 0;
  margin-bottom: 8px;
  color: #fff;
  position: relative;
  cursor pointer;
  overflow: hidden;
  .status-select {
    position absolute;
    font-size: 14px;
    left: 16px;
  }
  .time-box {
    font-size 14px;
    right: 0;
    position: absolute;
    .iconfont {
      font-size: 16px;
      box-sizing: border-box
    }
    .span-icon{
      display: inline-block;
      height: 36px;
      line-height: 36px;
      border-left: 1px solid rgba(255, 255, 255, 0.3);
      margin-left: 8px;
      padding: 0 8px;
      text-align: center;
      box-sizing: border-box;
    }
    .span-icon:hover{
      background-color: rgba(1,1,1,0.1);
    }
  }
  .status-name {
    color: #fff;
    .iconzhankai {
      margin-left: 4px;
    }
  }
  .iconfont {
    font-size: 12px;
  }
  .login-type {
    display: flex;
    color: #000;
    align-self: flex-start;
    color: var(--color-primary)
    margin: 0 auto;
    .left {
      width: 8px;
      height: 8px;
      background: #fff;
      position: relative;
      // border-top-right-radius: 8px;
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 8px;
        height: 8px;
        border-top-right-radius: 8px;
        background-color: var(--color-primary);
      }
    }
    .middle {
      padding: 4px 8px;
      font-size: 12px;
      background-color: #fff;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-sizing: unset;
      display: flex
      align-items: center
      .iconfont  {
        font-size: 12px
      }
      .iconProperty1xia {
        display: inline-block;
      }
      &:hover {
        .iconProperty1xia {
          display: inline-block;
        }
      }
    }
    .right {
      width: 8px;
      height: 8px;
      background: #fff;
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 8px;
        height: 8px;
        border-top-left-radius: 8px;
        background-color: var(--color-primary);
      }
    }
  }
}
.free {
  background-color: #4fab68;
  .login-type {
    color: #4fab68;
  }
  .left,
  .right {
    background-color: #4fab68;
  }
  .left:before,
  .right:before {
    background-color: #4fab68;
  }
}
.busy {
  background-color:  var(--color-danger);
  .login-type {
    color:  var(--color-danger);
  }
  .left:before,
  .right:before {
    background-color:  var(--color-danger)!important;
  }
}
.dialing {
  background-color:  #FF8404;
  .login-type {
    color:  #FF8404;
  }
  .left:before,
  .right:before {
    background-color:  #FF8404!important;
  }
}
.unregister {
  background-color:  #C5C5C5;
  .login-type {
    color:  #C5C5C5;
  }
  .left:before,
  .right:before {
    background-color: #C5C5C5!important;
  }
}
.disconnect {
  background-color: #cccccc;
  .login-type {
    color: #cccccc;
  }
  .left,
  .right {
    background-color: #cccccc;
  }
  .left:before,
  .right:before {
    background-color: #cccccc;
  }
}
.calling,
.called {
  background-color: rgba(0, 0, 0, 0);
  color: rgba(0, 0, 0, 0.8);
  height: 20px;
  padding: 0 8px;
  .status-name {
    color: rgba(0, 0, 0, 0.8);
  }
}
.oprate-wrap {
  display: flex;
  width: calc(100% + 8px);
  margin-left: -4px;
}
.btn {
  border-radius: 8px;
  padding: 10px 8px;
  margin: 0 4px 8px;
  line-height: 20px;
  text-align: center;
  flex-grow: 1;
}
.btn-middle {
  border-radius: 8px;
  width: 96px;
  box-sizing: border-box;
  padding: 8px 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  max-width: 96px;
  box-sizing: border-box;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.8);
  .iconfont {
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 2px;
  }
  .text {
    line-height: 18px;
  }
}
.error-back {
  background-color: #fc5926;
  color: #fff;
}
.success-back {
  background-color: #69e4a4;
  color: #fff;
}
.light-back {
  background-color: rgba(0, 0, 0, 0.03);
}
.dial {
  // height: 0px;
  height: 344px;
  margin-bottom: 8px;
  transition: 'height, background-image' 0.5s;
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 3px 1px rgb(0 0 0 / 5%);
  .input {
    margin: 16px 0 8px;
  }
  .dial-box {
    padding: 0 52px;
    display: flex;
    flex-wrap: wrap;
    .num {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 50%;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.8);
      &:nth-child(3n + 2) {
        margin: 0 40px 16px;
      }
      &.back {
        border-radius: 0;
        width: 32px;
      }
      &.iconjianpan {
        font-size: 24px;
      }
    }
    .success-back {
      background-color: #69e4a4;
      color: #fff;
    }
    .star {
      font-size: 24px;
      line-height: 51px;
    }
  }
}
.setting {
  display: block;
  transition: height 0.5s;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #fff;
  box-shadow: 0 0 3px 1px rgb(0 0 0 / 5%);
  .label {
    line-height: 20px;
    margin-bottom: 8px;
  }
  .type {
    margin-bottom: 8px;
  }
  .footer {
    padding-top: 8px;
    text-align: right;
  }
}
.error {
  // background-image: url('../../assets/images/plugins/phone-error.png');
  background-size: 100%;
  background-color: #fff;
  padding: 24px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-repeat: no-repeat;
}

.phone-bar-quick {
  position: fixed;
  min-width: 50px;
  height: 48px;
  text-align: center;
  line-height: 100px;
  font-size: 28px;
  right: 0;
  top: 300px;
  transition: max-width 0.5s;
  border-bottom: 2px transparent solid;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  // background-image: linear-gradient(to right, #38e38a, #38e38a);
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15)
  );
  box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.15);
  .icon {
    padding-right: 8px;
  }
  z-index: 1000;
}
.phone-bar-quick::before {
  background: white;
  content: '';
  display: block;
  position: absolute;
  width: calc(100% - 2px);
  height: 46px;
  border-top-left-radius: 23px;
  border-bottom-left-radius: 23px;
  top: 1px;
  left: 1px;
  z-index: 49;
}

.phone-bar-quick .icon .recovery {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4fab68;
}
.phone-bar-quick .icon {
  z-index: 50;
  width: calc(100% - 2px);
  height: 44px;
  border-top-left-radius: 23px;
  border-bottom-left-radius: 23px;
  top: 2px;
  left: 2px;
  position: relative;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-self: center;
  .busy {
    background: #fc5926;
  }
  .disconnect {
    background: rgba(0, 0, 0, 0.3);
  }
}

.phone-bar-quick .number {
  margin-left: 8px;
  margin-right: 8px;
}

.phone-bar-quick .quick-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: white;
  cursor: pointer;
  margin-left: 8px;
}

.phone-bar-quick .quick-btn:hover {
  animation: btn-size 0.3s 1;
}

@keyframes btn-size {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
}

.phone-bar-quick .icon .answer {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #38e38a;
}
.phone-bar-quick .icon .hangup {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fc5926;
}

.phone-bar-quick .circle {
  position: absolute;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  opacity: 0;
}

.ripple {
  max-width: 300px;
  background-image: linear-gradient(to right, #38e38a, transparent);
  transition: max-width 0.5s;
}

/* 波纹效果 */
.ripple .circle {
  // top: -2px;
  // left: -2px;
  width: calc(100% + 2px);
  /* 减去边框的大小 */
  height: calc(100% + 2px);
  /* 减去边框的大小 */
  border: 2px solid #fff;
  border-right: 0;
  border-color: #38e38a;
}

.ripple .circle:first-child {
  animation: circle-opacity 2s infinite;
}

.ripple .circle:nth-child(2) {
  animation: circle-opacity 2s infinite;
  animation-delay: 0.3s;
}

.ripple .circle:nth-child(3) {
  animation: circle-opacity 2s infinite;
  animation-delay: 0.6s;
}
@keyframes circle-opacity {
  from {
    opacity: 0.8;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(1.5, 1.5);
    border-width: 0;
    /* transform: translateX(-25px) */
  }
}
</style>
<style lang="stylus">
.dial {
  .input {
    .el-input__inner {
      border: none;
      background-color: #fff;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>