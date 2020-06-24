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

      <el-form-item label="用户头像">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="user.userImg" :src="user.userImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="updateUser('user')">确定修改</el-button>
        <el-button @click="resetForm('user')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'UpdateUser',
  props: ['userId'],

  data() {
    return {
      uploadUrl: 'http://localhost:8080/upload/uploadImage',
      userImg: '',
      user: {
        userImg: ''
      },
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

  mounted() {
    // queryAllUser.vue 引用的当前组件 通过父组件传的ID进行查询修改
    this.queryUserById()
  },
  methods: {
    queryUserById() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/user/queryUserById', {
        params: {
          userId: currThis.userId
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.user = res.data
          if (currThis.userImg != '') {
            currThis.user.userImg = currThis.userImg
          }
        })
        .catch(error => console.log(error))
    },

    updateUser(user) {
      this.$refs[user].validate((valid) => {
        if (valid) {
          const currThis = this
          currThis.$axios.get('http://localhost:8080/user/updateUser', {
            params: currThis.user,
            // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
            headers: { 'AUTHORIZATION': getToken() }
          })
            .then(res => currThis.$emit('updateSuccessClick', res.data))
            .catch(error => console.log(error))
        } else {
          return false
        }
      })
    },
    // 重置表单内容
    resetForm(user) {
      this.$refs[user].resetFields()
    },
    handleAvatarSuccess(res, file) {
      const currThis = this
      if (res.code === 200) {
        currThis.userImg = res.filename
        currThis.$message.success(res.message)
        currThis.queryUserById()
      } else {
        currThis.$message.error(res.message)
      }
      // console.log(res)
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
