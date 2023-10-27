<!--
 * @Author: Wangtao
 * @Date: 2023-06-28 21:09:36
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-10-27 11:34:46
-->
<template>
<div id="pubg">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" id="demo-ruleForms">
<h1 class="title"><i class="el-icon-user-solid"></i>电话条demo</h1>
  <el-form-item label="账号" prop="username" label-width="60px">
    <el-input v-model="ruleForm.username" type="username"></el-input>
  </el-form-item>
    <el-form-item label="密码" prop="password" label-width="60px">
    <el-input v-model="ruleForm.password" type="password"></el-input>
  </el-form-item>

  </el-form-item>
    <el-form-item label="账户ID" prop="accountId" label-width="60px">
    <el-input v-model="ruleForm.accountId" type="accountId"></el-input>
  </el-form-item>

  </el-form-item>
    <el-form-item label="pbxUrl" prop="pbxUrl" label-width="60px">
    <el-input v-model="ruleForm.pbxUrl" type="pbxUrl"></el-input>
  </el-form-item>
  
  <el-form-item class="marginLeft">
    <el-button type="primary" v-loading='loading' @click="submitForm('ruleForm')">登录</el-button>
    <el-button @click="resetForm(ruleForm)">重置</el-button>
  </el-form-item>
</el-form>
        </div>
</template>

<script>
  import SoftPhone from '7moor-softphone-sdk'
  // import SoftPhone from '../components/softphone/index'
  export default {
      name:'loginindex',
    data() {
      return {
        ruleForm: {
          accountId: 'N00000003731',
          username: '30003@dxtest21',
          password: '123456Aa',
          loginType: 'Local',
          // serviceAddress: 'http://10.1.114.23:9500',
          pbxUrl: 'https://pbx-bj-salesman02.7moor.com',
        },
        // ruleForm: {
        //  username: '6000@testvue',
        //  password:'123456Aa',
        //  pbxUrl: 'http://10.1.114.11:18081',
        //  accountId: 'N00000004555'
        // },
        //  ruleForm: {
        //  username: '20011@pkjtest-wh',
        //  password:'123456Aa',
        //  pbxUrl: 'http://10.1.114.11:18082',
        //  accountId: 'N00000004285'
        // },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
          ],
          accountId: [
            { required: true, message: '请输入账户ID', trigger: 'blur' },
          ],
          pbxUrl: [
            { required: true, message: '请输入pbx地址', trigger: 'blur' },
          ]
          
        },
        loading: false
      };
    },
    methods: {
      submitForm(ruleForm) {
         let that = this;
         if (that.loading) {
           return
         }
         this.$refs[ruleForm].validate((valid) => {
          if (valid) {
          that.loading = true;
          window.webapp = new SoftPhone({
              accountId: that.ruleForm.accountId,
              agentNumber: that.ruleForm.username,
              password: that.ruleForm.password,
              loginType: 'sip',
              // serviceAddress: 'https://dev-kf.7moor.com:3443',
              proxy_url: that.ruleForm.pbxUrl,
              error(e){
                console.log(e)
              },
              success(e) {
                window.token = true
                that.$router.replace({
                  path: '/app'
                })
              }
            })}
         })
      },
      resetForm(){
        this.ruleForm = {
          username:'',
          password:'',
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
     html,body, #pubg{
        height: 100%;
        width: 100%;
    }
    #pubg{
      background-repeat:no-repeat;
       display:flex;
       justify-content:center;
       align-items: center;
    }
    #demo-ruleForms {
      margin-top:150px;
       border:1px solid #ccc;
      border-radius:4px ;
      padding:0px 20px 10px 10px;
      .title{
        font-size:18px;
        padding:20px 0px 0px 76px;
      }
     .marginLeft{
       margin-left:-30px;
     }
    }
</style>