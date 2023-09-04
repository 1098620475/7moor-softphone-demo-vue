<!--
 * @Author: Wangtao
 * @Date: 2022-11-07 17:34:00
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-27 18:39:31
-->
<template>
  <div class="call-history-box-warp">
  <div class="call-history-box">
    <div class="input">
      <div class="phone-book-icon">
        <i @click="setListType('callbook')" v-show="isHistory" class='iconfont icon-dianhuaben call-book-icon'></i>
        <i @click="setListType('history')" v-show='!isHistory' class="iconfont icon-a-jiantou-zuo-line call-book-icon"></i>
       </div>
        <el-input v-model="dialoutNumber" :placeholder="placeholder" @keyup.enter.native="softBarDialoutPopup">
          <div  slot="append" :class="{'dialout-btn': true, 'dialout-btn-hover': dialoutNumber}">
            <i @click='softBarDialoutPopup' class="iconfont icon-hujiaohuojieting"></i>
          </div>
        </el-input>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: String,
      default: 'callState'
    },
    isShow: {
      type: Boolean
    }
  },
  data () {
    return {
      listType: 'history', // history 历史记录  callbook 电话本
      dialoutNumber: '',
      list: [],
      loading: false,
      phoneBookTable: []
    }
  },
  components: {
    
  },
  computed: {
    isHistory () {
      return this.listType === 'history'
    },
    placeholder () {
      if (this.channel === 'consul') {
        return this.listType === 'history' ? '输入号码点击回车键发起转接' : '输入号码点击回车键发起转接'
      } else if (this.channel === 'transfer') {
        return this.listType === 'history' ? '输入号码点击回车键发起转接' : '输入号码点击回车键发起转接'
      } else {
        return this.listType === 'history' ? '输入号码点击回车键发起转接' : '输入号码点击回车键发起转接'
      }
    }
  },
  methods: {
    getCurrentTypeIcon (type) {
      if (type === 'dialout') {
        return 'icon-qudian'
      } else if (type === 'dialTransfer') {
        return 'icon-qudian'
      } else if (type === 'transfer') {
        return 'icon-laidian'
      } else {
        return 'icon-laidian'
      }
    },
    callDate (time) {
        return timeFormat(time, 'card')
    },
    callBookSearch() {
      if (this.listType === 'callbook') {
        let _search = this.dialoutNumber.toLowerCase()
        this.list = this.phoneBookTable.filter((item) => {
          if (item.name.toLowerCase().indexOf(_search) !== -1 || item.number.toLowerCase().indexOf(_search) !== -1) {
            return true
          }
        })
      }
    },
    historyNumberClick (historyNum) {
      this.dialoutNumber = this.checkHideNum(historyNum)
    },
    booxNumberClick (num) {
      this.dialoutNumber = num
    },
    softBarDialoutPopup(historyNum, encryptedTel) {
      if (typeof historyNum === 'object') {
        // input 为空，直接enter的情况
        historyNum = ''
      }
      let phoneNum =  this.dialoutNumber.trim()
      this.$emit('numberClick', phoneNum)
    }
  },
  mounted () {
    
  }
}
</script>
<style scoped lang="stylus">
.call-history-box-warp {
  padding: 8px;
  box-sizing: border-box;
  padding-top: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px)
}
.call-history-box {
  background-color: #fff;
  position relative;
  border-radius: 8px;
  .history-name {
    display: inline-block;
    max-width: 12em;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }
  .input {
    padding: 8px 16px 8px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    >>> .el-input-group {
      border-radius: 18px;
      border: none;
      background-color: #F7F7F7;
      text-align: center;
      font-weight: 400;
      font-size: 20px;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
      .el-input-group__append {
        background-color: transparent;
        border: none;
        padding: 0 6px 0;
      }
    }
    >>> .el-input__inner {
      border: none;
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
    }

  }
  .phone-book-icon {
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    :hover {
      color: var(--color-primary)
    }
    .iconfont {
      font-size 18px;
      margin-right: 8px;
    }
  }
  >>> .dialout-btn {
      width: 24px;
      height: 24px;
      background: var(--color-success);
      opacity: 0.5;
      color: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor pointer;
    }
  >>> .dialout-btn-hover {
    background: var(--color-success);
    opacity: 1;
  }  

    .history {
      .item {
        height: 54px;
        padding: 8px 16px;
        box-sizing: border-box;
        cursor pointer;
        .title {
          font-weight: 400;
          font-size: 14px;
          line-height:20px
          color: var(--color-text-gray4);
          .iconfont {
            margin-right: 10px;
          }
          .icon-yijieting {
            color: var(--color-success);
          }
          .icon-qudian {
            color: var(--color-success);
            vertical-align: top;
          }
          .icon-laidian {
            color: var(--color-warning);
          }
          .icon-weijieting {
            color: var(--color-danger);
          }
        }
        .phone-city {
          padding-left: 28px;
          font-size: 12px;
          color: var(--color-text-gray1);
          max-width: 20em;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .text {
          font-weight: 400;
          font-size: 14px;
          color: var(--color-text-gray1);
        }
      }
      .item:hover {
        background-color: #F7F7F7;
      }
    }
    .book-item{
      height: 20px;
      padding: 8px 16px;
      cursor pointer;
      .book-title{
        font-weight: 400;
        font-size: 14px;
        line-height:20px
        color: var(--color-text-gray4);
        max-width: 11em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .book-text {
        font-weight: 400;
        font-size: 14px;
        color: var(--color-text-gray1);
        max-width: 7em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .book-item:hover {
      background-color: #F7F7F7;
    }
    .history {
      // padding: 0 16px 0;
      box-sizing: border-box;
    }
    .list-box {
      max-height: 356px;
      min-height: 280px;
      overflow-y: scroll;
      position: relative;
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
        justify-content: center;
        position: absolute;
        img {
          width: 50%;
        }
        .text {
          color: rgba(0, 0, 0, 0.6);
          font-weight: 400;
          font-size: 14px;
        }
      }
    }
  ::-webkit-scrollbar {
      width: 8px;
  }

  scrollbar {
      width: 8px;
  }

 ::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 4px;
      background: #F2F2F2;
      border: none;
  }
  scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 4px;
      background: #F2F2F2;
      border: none;
  }
  .keybord-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-success);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    bottom: 24px;
    right: 16px;
    position absolute;
    cursor pointer;
    .iconfont {
      font-size: 20px;
    }
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
  }
  .keybord-btn:hover {
    opacity: .8;
  }
}
</style>
