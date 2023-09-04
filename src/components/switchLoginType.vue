<!--
 * @Author: Wangtao
 * @Date: 2022-11-07 14:41:13
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-07-06 15:22:45
-->
<template>
	<div class="switch-login-warp">
    <div class="switch-login-box">
      <div class="title">通话设置</div>
      <div class="oprate">
        <formItem>
          接听方式
          <el-select slot="field" class="switch-type-box" :disabled='firstType === "sip"' v-model="loginType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </formItem>
        <div class="type-oprate">
          <div v-if='loginType === "sip"'>
            <el-checkbox  v-model="autoAnswer" class="auto-answer">自动接听</el-checkbox>
          </div>
          <div v-if='loginType === "Local"'>
            <formItem>
              手机号码
              <el-input slot="field" class="switch-type-box" v-model="mobile" :placeholder="'请选择手机号'">
              
            </el-input>
            </formItem>
          </div>
          <div v-if='loginType === "gateway"'>
            <formItem>
              SIP号
              <el-select slot="field" class="switch-type-box" v-model="gatewayExten" :placeholder="'请选择'">
                <el-option
                  v-for="item in getSipList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </formItem>
          </div>
        </div>
      </div>
      <div class="confirm">
         <el-button class="cancle-btn" type="text" size="mini" @click="cancel">取消</el-button>
         <el-button type="primary" size="mini" @click="loginTypeChange">确认</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import formItem from './formItem'
export default {
  components: {
    formItem
  },
  data () {
    return {
      options: [{
          value: 'Local',
          label: '手机号'
        }, {
          value: 'gateway',
          label: 'sip话机'
        }, {
          value: 'sip',
          label: 'webrtc'
        }],
      loginType: '',
      autoAnswer: false,
      statusRelay: '',
      allowSwitchState: false, //是否允许保存
      mobile: '',
      gatewayExten: '',
      getSipList: [
        
      ],
      userInfo: {}
    }
  },
  computed: {
    isAutoAnswer () {
      return this.$store.state.webrtc.autoAnswer
    },
    // mobile () {
    //   return this.$store.state.session.user.mobile
    // },
    alowSwitch () {
      return this.currentLoginType !== this.loginType
    }
  },
  watch: {
    
  },
  methods: {
    cancel () {
      this.$emit('switchConfig', {status: false})
    },
    loginTypeChange() {
      this.changeLoginType(this.loginType)
    },
    async changeLoginType(command) {
      // 变更登录方式
      let arr = command.split(',')
      let extenNum = ''
      let users = this.userInfo
      if (arr[0] === 'gateway') {
        if (users.hasOwnProperty('gatewayLoginWay')) {
          if (users.gatewayLoginWay) {
            // 是否允许sip方式登录
            if (this.gatewayExten && this.gatewayExten !== users.gatewayExten) {
              let getwayinfo = await this.gatewayExtenChange(this.gatewayExten)
              if (!getwayinfo.success) {
                return
              }
            }
            if (!users.gatewayExten || users.gatewayExten === '') {
              this.$message.error('您没有设置语音网关sip号！')
              return
            } else {
              extenNum = users.gatewayExten
            }
          } else {
            this.$message.error(this.$t('cti.extenTypeError'))
            return
          }
        } else {
          if (this.gatewayExten && this.gatewayExten !== users.gatewayExten) {
            let getwayinfo = await this.gatewayExtenChange(this.gatewayExten)
            if (!getwayinfo.success) {
              return
            }
          }
          if (!users.gatewayExten || users.gatewayExten === '') {
            this.$message.error(this.$t('cti.NotConfigSip'))
            return
          } else {
            extenNum = users.gatewayExten
          }  
        }
      } else if (arr[0] === 'Local') {
        if (users && users.hasOwnProperty('localLoginWay')) {
          // 是否允许手机方式登录
          if (users.localLoginWay) {
            if(!this.mobile) {
              this.$message.error(this.$t('userInfo.localCannotPhone')) 
              return
            }
            if (users.mobile !== this.mobile) {
                let info = await this.updateUserPhone(this.mobile)
                if (!info.success) {
                  return
                }
            }
            extenNum = users.mobileExten
          } else {
            this.$message.error('该接听方式已经被限制，请更换其他接听方式！')
            return
          }
        } else {
          if (users.mobile !== this.mobile) {
            let info = await this.updateUserPhone(this.mobile)
            if (!info.success) {
              return
            }
          }
          extenNum = users.mobileExten
        }
      } else {
        if (users.hasOwnProperty('sipLoginWay')) {
          // 是否允许在线客服方式登录
          if (users.sipLoginWay) {
            extenNum = users.sipExten
          } else {
            this.$message.error('该接听方式已经被限制，请更换其他接听方式！')
            return
          }
        } else {
          extenNum = users.sipExten
        }
        this.setAutoAnswer(this.autoAnswer)
      }
      if (!this.alowSwitch) {
        this.cancel()
        this.$message.success('修改成功！')
        return
      }
      window.webapp.agentApi.changeLoginType({
        loginType: arr[0],
        success:()=>{
          this.loginType = arr[0];
          this.$emit('switchConfig', {status: false, type: arr[0]})
        }
      })
    },
    setAutoAnswer (status) {
      // this.$store.commit('webrtc/SET_AUTO_ANSWER', status)
    },
    updateUserPhone (phone, callback) {
      return new Promise((resolve) => {
        window.webapp.agentApi.updateAgentMobile({
          mobile: phone,
          success: ()=>{
            resolve({
              success: true
            })
          },
          fail: (res)=>{
            console.log(res)
            resolve({
              success: false
            })
          }
        }) 
      })
    },
    getUnboundGatewaySips () {
      window.webapp.agentApi.getGatewaySips({
        success: (res) => {
          this.getSipList = resp.data
        }
      })
    },
    gatewayExtenChange (value) {
      return new Promise((resolve) => {
        window.webapp.agentApi.bindGatewaySip({
          sipNumber: value,
          success: ()=> {
            resolve({success: true})
          },
          fail: () => {
            resolve({success: false})
          }
        })
      })
    }
  },
  mounted () {
    // this.loginType = 'Local'

    // this.mobile = '13934691550'
    // this.gatewayExten = ''
    // 软电话是否自动接听
    // this.autoAnswer = this.isAutoAnswer

    window.webapp.agentApi.getAgentInfo({
      success: (res)=>{
        let info = res.data
        this.mobile = info.mobile
        this.loginType = info.loginType
        this.gatewayExten = info.gatewayExten
        this.userInfo = info
      }
    })

    this.getUnboundGatewaySips()
  },
  props: {
    firstType: String
  }
}
</script>
<style lang="stylus" scoped>
  .switch-login-warp {
    padding: 0px 8px 8px 8px;
  }
  .switch-login-box {
    padding: 8px;
    padding-top: 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    >>> .border-form-item {
      .label {
        width: 70px;
        text-align: center;
      }
    }
    >>> .el-icon-arrow-up {
      color: rgba(31, 31, 31, 1);
    }
    .type-oprate {
      padding: 8px 0 8px;
    }
    .title {
      font-weight: 400;
      font-size: 14px;
      padding: 8px 0 8px;
    }
    .confirm {
      display: flex;
      justify-content: flex-end;
    }
  }
  .switch-type-box {
    width: 100%;
    >>>.el-input__inner {
      height: 36px;
    }
    >>>.el-input__icon {
      line-height: 36px;
    }
  }
  .auto-answer >>>.el-checkbox__label
    font-size 14px
  .cancle-btn
    color var(--color-text-gray4)
    font-size: 14px;
    font-weight: 400;
    margin-right: 14px;
</style>
