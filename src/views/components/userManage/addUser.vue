<template>
  <div>
    <el-form ref="user" :model="user" :rules="yanzheng" label-width="100px" class="demo-ruleForm">

      <el-form-item label="用户账号" prop="userAccount">
        <el-input v-model="user.userAccount" />
      </el-form-item>

      <el-form-item label="用户姓名" prop="userName">
        <el-input v-model="user.userName" />
      </el-form-item>

      <el-form-item label="用户邮箱" prop="userEmail">
        <el-input v-model="user.userEmail" />
      </el-form-item>

      <el-form-item label="用户密码" prop="userPass">
        <el-input v-model="user.userPass" />
      </el-form-item>

      <el-input v-model="user.userImg" type="hidden" />

      <el-form-item>
        <el-button type="primary" @click="addUser('user')">立即创建</el-button>
        <el-button @click="resetForm('user')">重置</el-button>
      </el-form-item>
      <uploadImages @uploadSuccessClick="uploadSuccessClick" />
    </el-form>
  </div>
</template>

<script>
import uploadImages from '@/views/store-manage/upLoadFile/image'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'AddUser',
  components: {
    uploadImages
  },
  data() {
    return {
      user: {},
      yanzheng: {
        userAccount: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        userPass: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {

    uploadSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.user.userImg = returnJson.filename
      }
    },
    // 添加用户信息
    addUser(user) {
      this.$refs[user].validate((valid) => {
        if (valid) {
          const currThis = this
          currThis.$axios.get('http://localhost:8080/user/addUser', {
            params: currThis.user,
            // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
            headers: { 'AUTHORIZATION': getToken() }
          })
            .then(res => currThis.$emit('addSuccessClick', res.data))
            .catch(error => console.log(error))
        } else {
          return false
        }
      })
    },

    // 重置表单内容
    resetForm(user) {
      this.$refs[user].resetFields()
    }
  }
}
</script>
