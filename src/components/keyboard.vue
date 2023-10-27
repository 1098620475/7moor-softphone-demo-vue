<!--
 * @Author: Wangtao
 * @Date: 2022-11-07 14:41:13
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-09-26 18:58:40
-->
<template>
<div class="key-board-box-warp">
  <div>
    <!-- <explicitRule></explicitRule> -->
  </div>
	<div class="key-board-box">
    <div class="input" :class="{inputType1: isType1}">
      <el-input  @keyup.enter.native="softBarDialoutPopup" @focus="inputFocus" :placeholder="placeholder" v-model="dialoutNumber">
         <div  slot="append" class="append-box" v-if="!isType1">
            <img src="./delete.svg" @click.stop="deleteNumber"/>
          </div>
      </el-input>
    </div>
    <div class="key-box">
      <div class="key-item">
        <div class="key-row" v-for="(keyRow, rowindex) in keyList" :key="rowindex">
          <div v-for="(key, index) in keyRow" :key="index" class="key" @click.stop="keyClick(key)">{{key}}</div>
        </div>
        <div class="key-row oprate" v-show="isType1">
          <div class="Keyboard-switch" @click="setKeyBoardType"><i class="iconfont icon-wenbenqingdan-xian"></i></div>
          <div :class="{'out-calling': true, 'out-calling-active': dialoutNumber}" @click="softBarDialoutPopup"><i class="iconfont icon-hujiaohuojieting"></i></div>
          <div class="delete" @click.stop="deleteNumber"><img src="./delete.svg"/></div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import explicitRule from './explicitRule'
export default {
  props: {
    styleType: { type: String, default: 'type1' } // type1 普通键盘 type2 软电话键盘
  },
  components: {
    explicitRule
  },
  data () {
    return {
      keyList: [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['*', '0', '#']
      ],
      dialoutNumber: '',
      clonePlaceHolder: '输入号码点击回车键发起呼叫',
      placeholder: '输入号码点击回车键发起呼叫'
    }
  },
  computed: {
    isType1 () {
      return this.styleType === 'type1'
    }
  },
  methods: {
    inputFocus () {
      this.placeholder = ''
    },
    // inputBlur () {
    //   this.placeholder = this.clonePlaceHolder
    // },
    softBarDialoutPopup(historyNum) {
      if (typeof historyNum === 'object') {
        // input 为空，直接enter的情况
        historyNum = ''
      }
      let phoneNum = this.dialoutNumber.trim()
      if (!phoneNum) {
        return
      }
      webapp.callApi.dialout({
      calleeNumber: phoneNum,
      fail: (res) => {
        console.log(res, 'sssssssss')
      },
      success: (res) => {
        console.log('外呼成功')
      }
    })
    },
    keyClick (key) {
      this.dialoutNumber += key
      if (this.styleType === 'type2') {
        webapp.webrtcApi.sendDTMF(key)
      }
    },
    deleteNumber () {
      if (this.dialoutNumber) {
        const length = this.dialoutNumber.length
        this.dialoutNumber = this.dialoutNumber.substring(0, length - 1)
      }
    },
    setKeyBoardType () {
      this.$emit('setKeyBoardType', 'callList')
    }
  }
}
</script>
<style scoped lang="stylus">
.key-board-box-warp {
  padding: 0px 8px 8px;
  box-sizing: border-box;
}
.key-board-box{
  background-color: #fff;
  border-radius: 8px;
  .input{
    padding: 16px;
    box-sizing: border-box;
    >>> .el-input__inner {
      border-radius: 18px;
      border: none;
      // background-color: ;
      text-align: center;
      font-weight: 400;
      font-size: 20px;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
    }
    >>> input::placeholder{
      color: rgba(0, 0, 0, 0.26) !important;
    }
    >>> .el-input__inner::placeholder{
      font-weight: 400;
      font-size: 14px;
      line-height: 36px;
    }
    >>> .el-input-group__append {
        background-color: transparent;
        border: none;
        padding: 0;
    }
    >>> .append-box {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
  .inputType1 {
    padding: 16px;
    box-sizing: border-box;
    >>> .el-input__inner {
      border-radius: 18px;
      border: none;
      background-color: #F7F7F7;
      text-align: center;
      font-weight: 400;
      font-size: 20px;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
    }
    >>> input::placeholder{
      color: rgba(0, 0, 0, 0.26) !important;
    }
    >>> .el-input__inner::placeholder{
      font-weight: 400;
      font-size: 14px;
      line-height: 36px;
    }

  }
  
  .key-box{
    .oprate > div {
      width: 40px;
      display: flex;
      justify-content: center;
    }
    .key-item{
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      .key-row {
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
        .key {
          display: flex;
          font-weight: 400;
          font-size: 16px;
          justify-content: center;
          align-items: center;
          cursor pointer;
          user-select: none;
        }
        .Keyboard-switch {
          color: rgba(0, 0, 0, 0.6);
          height: 40px;
          align-items: center;
          cursor pointer;
          .iconfont {
            font-size 20px;
          }
        }
        .Keyboard-switch:hover{
          color: var(--color-primary);
        }
        .out-calling {
          margin: 0 40px 0;
          width: 40px;
          background-color: var(--color-success);
          opacity: 0.5;
          color: #fff;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .out-calling-active{
          opacity: 1
        }
        .out-calling-active:hover{
          opacity: .8;
        }
        .delete {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          cursor pointer;
          img {
            width: 24px;
          }
        }
      }
      .key {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #F7F7F7;
      }
      .key:nth-child(2){
        margin: 0 40px 0
      }
    }
  }
}
</style>
