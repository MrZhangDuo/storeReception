<template>

  <div>
    <el-form ref="updateRoleTable" :model="role" :rules="yanzheng" label-width="100px" class="demo-ruleForm">

      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" />
      </el-form-item>

      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="role.roleDesc" />
      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="updateRole('updateRoleTable')">确定修改</el-button>
        <el-button @click="resetForm('updateRoleTable')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'UpdateRole',
  props: ['roleId'],

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

  mounted() {
    // queryAllUser.vue 引用的当前组件 通过父组件传的ID进行查询修改
    this.queryRoleById()
  },
  methods: {
    queryRoleById() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/role/queryRoleById', {
        params: {
          roleId: currThis.roleId
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => currThis.role = res.data)
        .catch(error => console.log(error))
    },

    updateRole(updateRoleTable) {
      this.$refs[updateRoleTable].validate((valid) => {
        if (valid) {
          const currThis = this
          currThis.$axios.get('http://localhost:8080/role/updateRole', {
            params: currThis.role
          })
            .then(res => currThis.$emit('updateSuccessClick', res.data))
            .catch(error => console.log(error))
        } else {
          return false
        }
      })
    },

    // 重置表单内容
    resetForm(updateRoleTable) {
      this.$refs[updateRoleTable].resetFields()
    }
  }
}
</script>
