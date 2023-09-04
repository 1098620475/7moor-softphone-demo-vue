<!--
 * @Author: Wangtao
 * @Date: 2023-07-06 17:42:46
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-07-14 17:12:10
-->
<template>
<div :class="['explicitrule-box', showRight ? '' : 'switch-type-box-content']">
  {{currentType}}
  <formItem>
    <el-select size="mini" :class="['switch-type-box', 'switch-type-box-left']" @change="selectTypeChange" v-model="currentType" placeholder="请选择">
    <el-option
      v-for="item in typeSelect"
      :key="item.value"
      class="telephone-option"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select  size="mini" @change="selectValueChange" v-show="showRight" class="switch-type-box" slot="field" v-model="selectValue" :placeholder="optionDisabled ? '座席绑定' : '请选择'">
    <el-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      <!-- <span v-if="optionDisabled"><span style="margin-right: 15px">{{item.value}}</span>{{item.city}}</span> -->
      <span>{{item.label}}</span>
    </el-option>
  </el-select>
  </formItem>
</div>
</template>

<script>
import formItem from './formItem'
export default {
  props: {
    
  },
  data () {
    return {
      currentType: '',
      selectOptions: [],
      selectValue: '',
      typeSelect: []
    }
  },
  components: {
    formItem
  },
  computed: {
    currentPBX () {
      return this.$store.state.session.user.pbx
    },
    showRight () {
      return this.currentType !== 'accountNumber' && this.currentType !== 'line'
    },
    optionDisabled () {
      if (this.currentType === 'small') {
        if (this.currentSmallType === 'A') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  methods: {
    selectTypeChange () {
      this.typeChange()
    },
    selectValueChange () {
      this.valueChange()
    },
    typeChange (selectValue) {
      let that = this
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', that.currentType)
      window.webapp.agentApi.getExplicitDataByType({
        type: that.currentType,
        success: (res) => {
          console.log(res, 'hhhhhhhhhhhhhhhhhhhhhhhhhh')
        }
      })
    },
    getTypeSelect () {
      let that = this;
      window.webapp.agentApi.getExplicitRules({
        success: (data) => {
          that.typeSelect = data.data || []
        }
      })
    }
  },
  mounted () {
    this.getTypeSelect()
  }
}
</script>
<style scoped lang="stylus">
.switch-type-box {
    width: 100%;
    >>>.el-input__inner {
      height: 32px;
    }
    >>>.el-input__icon {
      line-height: 32px;
    }
  }
.switch-type-box-left {
  >>>.el-input__inner {
    height: 30px;
    border: none;
  }
}
.switch-type-box-content {
  border-width: 1px;
  >>>.border-form-item {
   .label {
      border-right: 1px solid #dcdfe6;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
   }
  }
}
.explicitrule-box{
  padding: 0 16px;
}
</style>
