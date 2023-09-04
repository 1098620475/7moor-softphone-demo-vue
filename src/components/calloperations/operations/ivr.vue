<!--
 * @Author: Wangtao
 * @Date: 2022-11-08 19:36:06
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-28 15:11:00
-->
<template>
  <div class="ivr-box-wrap">
    <div class="ivr-box">
      <el-select @change='selectChange' popper-class='ivr-box-select' filterable v-model="value" placeholder="请选择">
          <el-option
            v-for="(item, index) in options"
            :key="item.Exten"
            :label="item.DisplayName"
            :value="index">
            <div class="ivr-item">
              <div class="title">{{item.DisplayName}}</div>
              <i class="iconfont icon-zhuanjie"></i>
            </div>
          </el-option>
        </el-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      value: ''
    }
  },
  mounted() {
    this.getIvrList()
  },
  methods: {
    getIvrList() {
      // IVR数据
      let that = this;
      window.webapp.callApi.getIvrMenuList({
        success(res){
          that.options = res.data
        }
      })
    },
    phoneIvrMenu(index) {
      let Exten = this.options[index].Exten;
      window.webapp.callApi.toIvrMenu({
        Exten: Exten, 
        success(res){
          console.log('转移成功')
        }
      })
    },
    selectChange (value) {
      this.phoneIvrMenu(value)
    }
  }
}
</script>
<style scoped lang="stylus">
.ivr-box-wrap {
  padding: 8px;
  box-sizing: border-box;
}
.ivr-box {
  background: #FFFFFF;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 8px;
  box-sizing: border-box;
  >>>.el-select{
    width: 100%;
    .el-input__icon {
      line-height: 20px;
    }
  }
}
</style>
<style lang="stylus">
.ivr-box-select {
  .ivr-item {
    display: flex;
    justify-content: space-between;
    font-weight: 400;
    font-size: 14px;
    .icon-zhuanjie {
      font-size: 14px;
      color: #459AE9;
    }
  }
}
</style>