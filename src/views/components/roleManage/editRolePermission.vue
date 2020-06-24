<template>
  <div>
    <el-tree
      ref="tree"
      :data="Permission"
      show-checkbox
      node-key="id"
      :default-checked-keys="MyPermission"
      :props="defaultProps"
    />
    <el-form label-width="100px" class="demo-ruleForm">
      <el-form-item size="large">
        <el-button type="primary" @click="updateRolePermission(Permission)">分配角色</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'EditRolePermission',
  props: ['roleId'],
  data() {
    return {
      Permission: [],
      MyPermission: [],
      setPermission: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.queryAllPermission()
    this.queryMyPermission()
  },
  methods: {
    queryAllPermission() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/permission/queryAllPermission', {
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.Permission = res.data
        })
        .catch(error => console.log(error))
    },

    queryMyPermission() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/permission/queryMyPermission', {
        params: {
          roleid: currThis.roleId
        }
      })
        .then(res => {
          currThis.MyPermission = res.data
        })
        .catch(error => console.log(error))
    },

    updateRolePermission(Permission) {
      const currThis = this
      currThis.setPermission = currThis.$refs.tree.getCheckedKeys()/* .concat(currThis.$refs.tree.getHalfCheckedKeys()) */

      const url = '?roleid=' + currThis.roleId + '&permission=' + currThis.setPermission
      currThis.$axios.get('http://localhost:8080/permission/updateRolePermission' + url)
        .then(res => currThis.$emit('updateRolePermissionSuccessClick', res.data))
        .catch(error => console.log(error))
    }
  }
}
</script>
