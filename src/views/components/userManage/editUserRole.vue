<template>
  <div>
    <el-table ref="multipleTable" :data="role" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">

      <el-table-column v-model="multipleSelection" type="selection" width="55" />

      <el-table-column label="角色名称" width="120">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
      </el-table-column>

      <el-table-column prop="name" label="角色描述" width="120">
        <template slot-scope="scope">{{ scope.row.roleDesc }}</template>
      </el-table-column>
    </el-table>
    <el-form label-width="100px" class="demo-ruleForm">
      <el-form-item size="large">
        <el-button type="primary" @click="updateUserRole">分配角色</el-button>
        <el-button @click="resetForm('role')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'EditUserRole',
  props: ['userId'],
  data() {
    return {
      role: [],
      myRole: [],
      multipleSelection: [],
      roleId: []

    }
  },
  mounted() {
    this.queryAllRole()
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    queryAllRole() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/role/queryAllRole', {
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.role = res.data
          currThis.$axios.get('http://localhost:8080/role/queryUserMyRole', {
            params: {
              uid: currThis.userId
            },
            // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
            headers: { 'AUTHORIZATION': getToken() }
          })
            .then(res => {
              currThis.myRole = res.data
              this.role.forEach((row) => {
                this.myRole.forEach((myRoles, i) => {
                  if (row.roleId === currThis.myRole[i].roleId) {
                    this.$refs.multipleTable.toggleRowSelection(row)
                  }
                })
              })
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    },

    updateUserRole() {
      const currThis = this
      currThis.roleId.length = 0
      for (const i in this.multipleSelection) {
        currThis.roleId.push(currThis.multipleSelection[i].roleId)
      }
      currThis.$axios.get('http://localhost:8080/role/updateUserRole?userId=' + currThis.userId + '&rid=' + currThis.roleId + '', {
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => currThis.$emit('updateUserRoleSuccessClick', res.data))
        .catch(error => console.log(error))
    },

    // 重置表单内容
    resetForm(user) {
      this.$refs[user].resetFields()
    }
  }
}
</script>
