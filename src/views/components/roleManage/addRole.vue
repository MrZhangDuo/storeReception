<template>
  <div>
    <el-form ref="roleTable" :model="role" :rules="yanzheng" label-width="100px" class="demo-ruleForm">

      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" />
      </el-form-item>

      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="role.roleDesc" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addRole('roleTable')">立即创建</el-button>
        <el-button @click="resetForm('roleTable')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'AddRole',

  data() {
    return {
      role: {},
      yanzheng: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 添加用户信息
    addRole(roleTable) {
      this.$refs[roleTable].validate((valid) => {
        if (valid) {
          const currThis = this
          currThis.$axios.get('http://localhost:8080/role/addRole', {
            params: currThis.role
          })
            .then(res => currThis.$emit('addSuccessClick', res.data))
            .catch(error => console.log(error))
        } else {
          return false
        }
      })
    },

    // 重置表单内容
    resetForm(roleTable) {
      this.$refs[roleTable].resetFields()
    }
  }
}
</script>
