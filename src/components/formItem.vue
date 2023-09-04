<!--
 * @Author: Wangtao
 * @Date: 2022-11-10 14:47:56
 * @LastEditors: Wangtao
 * @LastEditTime: 2022-11-10 14:54:29
-->
<template>
  <div class="border-form-item">
    <span class="label"><slot></slot></span>
    <slot name="field"></slot>
  </div>
</template>
<style lang="stylus">
.border-form-item {
  display: inline-table;
  width: 100%;
  .label {
    color: #595959;
    display: table-cell;
    vertical-align: middle;
    border: 1px solid #dcdfe6;
    border-top-left-radius: 4px;
    border-right: none;
    padding: 0 8px;
    white-space: nowrap;
    border-bottom-left-radius: 4px;
  }
  .el-input__inner {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

</style>