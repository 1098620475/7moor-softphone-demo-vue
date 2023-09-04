<!--
 * @Author: Wangtao
 * @Date: 2022-11-09 09:37:25
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-07-03 14:54:39
-->
<template>
	<div class="transfer-selection-box">
    <div class="transfer-reason-box" v-if='isReason'>
       <!-- 转接原因 -->
       <div class="transfer-reason-title">
        <div class="title">转接原因</div>
        <!-- <div class="add">插入通话备注</div> -->
       </div>
       <div class="transfer-input">
         <el-input
            type="textarea"
            :rows="2"
            autosize
            :placeholder="'转接后的座席可以看到您填写的内容'"
            v-model="TransferReason">
          </el-input>
       </div>
     </div>
     <div class='trans-menu-warp'>
     <div class="menu-box">
       <div @click="setCurrentKey(item.key)" :class="{'menu-item': true, active: item.key === activeKey}" v-for="(item, index) in itemList" :key="index">
          {{item.title}}
       </div>
     </div>
     <div class="agent-select" v-if="activeKey === 'agent'">
      <el-select :placeholder="'請輸入座席工号、姓名'" @visible-change='visibleChange' :filter-method="dataFilter" filterable popper-class="agent-select" v-model="form.id"  ref="selectTree">
          <el-option :key="form.id" :value="form.id" :label="form.label" hidden/>
          <el-tree :data="dataList"
            :props="defaultProps"
            node-key="id"
            accordion
            ref="tree"
            highlight-current
            :filter-node-method="filterNode"
            >
            <div class="custom-tree-node" slot-scope='{ node, data }'>
              <div class="title">
                <span v-show="data.isQueue">{{ node.label }} <span v-show="!data.isAll">（{{data.idleAgentCount}}）</span></span>
                <span v-show="!data.isQueue">{{data.DisplayName}}</span>
                <span v-show="!data.isQueue"><i class="iconfont icon-yuandian"></i>空闲</span>
             </div>
              <div class="oprate" v-show="!data.isAll" @click='transferClick(data)'><i class="iconfont icon-zhuanjie"></i></div>
            </div>
          </el-tree>
      </el-select>
     </div>
     <div class="outside" v-if="activeKey === 'outside'">
       <div class='call-boox'>
        <callBook :throwoutNumber='true' :channel="transType" @numberClick='outLineTranster'></callBook>
       </div>
     </div>
     </div>
  </div>
</template>

<script>
import callBook from '../../../call-input'
export default {
  props: {
    transType:  { type: String, default: 'transfer' },
  },
  components: {
    callBook
  },
  data () {
    return {
      isTransferReason: false,
      TransferReason: '', // 转接原因
      itemList: [{
        title: '其他座席',
        key: 'agent'
      },{
        title: '外线',
        key: 'outside'
      }],
      activeKey: 'agent',
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'queueName'
      },
      form: {
        id: '',
        value: ''
      },
      outsideLineNumber: '',
      restaurants: []
    }
  },
  computed: {
    isReason () {
      return this.transType === 'transfer'
    }
  },
  methods: {
    visibleChange (visible) {
      if (visible) {
        this.getUsers()  
      } else {
        this.dataFilter('')
      }
    },
    setCurrentKey (key) {
      this.activeKey = key
    },
    dataFilter (value) {
      this.$refs.tree.filter(value)
    },
    getUsers () {
      window. webapp.agentApi.getOnlineAgents({
        fail: (res) => {
          console.log(res)
        },
        success: (res) => {
          let transferData = []
          let unshiftData = {
            queueName: '空闲座席',
            children: res.data,
            isAll: true,
            isQueue: true
          }
          transferData.unshift(unshiftData);
          console.log(transferData)
          this.dataList = transferData
        }
      })
    },
    filterNode (value, data) {
      if (data.isAll) {
        return true
      } else {
        if (data.queueName && data.queueName.indexOf(value) !== -1) {
          return true
        } else {
          return (data.DisplayName && data.DisplayName.indexOf(value) !== -1) || (data.exten && data.exten.indexOf(value) !== -1)
        }
      }
    },
    // 换行转义
    return2Br(str) {
      return str.replace(/\r?\n/g, '<br/>')
    },
    transferClick (data) {
      let that = this;
      if (this.isReason) {
         window.webapp.callApi.transfer({
          TransferNumber: data.exten,
          type: 'in',
          TransferReason: that.TransferReason,
          fail: (res) => {
            console.log(res)
          },
          success: (res) => {
            console.log('转接成功')
          }
        }) 
      } else {
        window.webapp.callApi.consult({
          ConsultNumber: data.exten,
          type: 'in',
          fail: (res) => {
            console.log(res)
          },
          success: (res) => {
            console.log('转接成功')
          }
        })
      }
    },
    outLineTranster(number) {
      let that = this;
      if (!number) {
        return
      }
      let reg = /^[0-9]+.?[0-9]*/
      if (!reg.test(number)) {
        this.$message.error('请使用正确类型的号码！')
        return
      }
      if (this.transType === 'transfer') {
        window.webapp.callApi.transfer({
          TransferNumber: number,
          TransferReason: that.TransferReason,
          fail: (res) => {
            console.log(res, 'sssssssss')
          },
          success: (res) => {
            console.log('转接成功')
          }
        })
      } else {
        window.webapp.callApi.consult({
          ConsultNumber: number,
          fail: (res) => {
            console.log(res)
          },
          success: (res) => {
            console.log('咨询成功')
          }
        })
      }
    }
  },
  mounted () {
    // 获取转接列表
    // this.getUsers()
  }
}
</script>
<style scoped lang="stylus">
.transfer-reason-title{
  .title {
    font-size: 14px;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
  }
}
.transfer-selection-box {
    padding: 8px;
    box-sizing: border-box;
    // background: #FFFFFF;
    // box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
    // border-radius: 8px;
  }
  .trans-menu-warp {
    background: #fff;
    padding: 8px;
    box-sizing: border-box;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-top: 8px;
  }
  .menu-box {
    display: flex;
    background-color: #F7F7F7;
    height: 32px;
    padding: 2px;
    box-sizing: border-box;
    border-radius: 4px;
    .menu-item {
      flex:1
      font-weight: 400;
      font-size: 14px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor pointer;
    }
    .active {
      background: #fff;
      color: rgba(30, 99, 245, 1);
    }
  }
  .outside {
    .outside-input{
      display: flex;
      align-items: center;
      .input {
        margin-right: 10px;
      }
      .iconfont {
        color: rgba(0, 0, 0, 0.6);
        font-size: 20px;
        margin-right: 10px;
      }
      .iconfont:hover{
        color: #459ae9;
      }
    }
  }
  .agent-select {
      >>>.el-select {
        width: 100%;
        .el-input__inner {
          height: 36px;
        }
        .el-input__icon {
          line-height: 20px;
        }
      }
    }
</style>
<style  lang="stylus">

.agent-select {
    /*设置鼠标悬浮经过的颜色*/
    margin-top: 8px;
    .el-tree-node:hover > .el-tree-node__content {
      background-color:#FAFAFA !important;
    }
    /*设置字体大小*/
    .el-tree-node__label {
      font-weight: 400;
      font-size: 14px;
      color: #000;
    }
    .custom-tree-node{
      font-weight: 400;
      font-size: 14px;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 14px;
      box-sizing: border-box;
      .iconfont {
        color: #459AE9;
      }
      .icon-yuandian{
        color: #2BB24C;
        font-size: 12px;
        margin: 0 5px 0;
      }
    }
    /*设置tree每行的高度*/
    .el-tree-node__content {
      height: 44px;
    }
  }
  .transfer-reason-box {
    background: #fff;
    padding: 8px;
    box-sizing: border-box;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    .transfer-reason-title {
      font-weight: 500;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 0 4px;
      .title {
        font-weight: 500;
      }
      .add {
        color: #459AE9;
        height: 28px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        padding: 0 8px 0;
        cursor: pointer;
      }
      .add:hover{
        background-color: #E8EFFE;
      }
    }
  }
</style>


