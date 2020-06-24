<template>
  <div>
    <el-table ref="multipleTable" :data="role" style="width: 100%">

      <el-table-column label="角色名称" width="120">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
      </el-table-column>

      <el-table-column prop="name" label="角色描述" width="120">
        <template slot-scope="scope">{{ scope.row.roleDesc }}</template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" round @click="addRole">添加角色</el-button>
          <el-button type="primary" round @click="updateRole(scope.row)">编辑角色</el-button>
          <el-button type="info" round @click="editRolePermission(scope.row)">设置权限</el-button>
          <el-button type="danger" round @click="deleteRole(scope.row)">删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加角色信息" :visible.sync="addRoleVisible">
      <addRole v-if="addRoleVisible" @addSuccessClick="addSuccessClick" />
    </el-dialog>

    <el-dialog title="修改角色信息" :visible.sync="updateRoleVisible">
      <updateRole v-if="updateRoleVisible" :role-id="roleId" @updateSuccessClick="updateSuccessClick" />
    </el-dialog>

    <el-dialog width="25%" title="设置角色权限" :visible.sync="editRolePermissionVisible">
      <editRolePermission v-if="editRolePermissionVisible" :role-id="roleId" @updateRolePermissionSuccessClick="updateRolePermissionSuccessClick" />
    </el-dialog>
  </div>
</template>

<script>
import addRole from '@/views/components/roleManage/addRole'
import updateRole from '@/views/components/roleManage/updateRole'
import editRolePermission from '@/views/components/roleManage/editRolePermission'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'RoleManage',
  components: {
    addRole,
    updateRole,
    editRolePermission
  },
  data() {
    return {
      addRoleVisible: false,
      updateRoleVisible: false,
      editRolePermissionVisible: false,
      roleId: 0,
      role: []
    }
  },
  mounted() {
    this.queryAllRole()
  },
  methods: {
    // 添加角色
    addRole() {
      const currThis = this
      currThis.addRoleVisible = !currThis.addRoleVisible
    },
    // 监听添加角色的回调函数
    addSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.$message.success(returnJson.message)
        currThis.addRoleVisible = !currThis.addRoleVisible
        currThis.queryAllRole()
      } else {
        currThis.addRoleVisible = !currThis.addRoleVisible
        currThis.queryAllRole()
        currThis.$message.error(returnJson.message)
      }
    },
    // 编辑角色
    updateRole(role) {
      const currThis = this
      currThis.updateRoleVisible = !currThis.updateRoleVisible
      currThis.roleId = role.roleId
    },
    // 监听修改角色的回调函数
    updateSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.$message.success(returnJson.message)
        currThis.updateRoleVisible = !currThis.updateRoleVisible
        currThis.queryAllRole()
      } else {
        currThis.$message.error(returnJson.message)
        currThis.updateRoleVisible = !currThis.updateRoleVisible
        currThis.queryAllRole()
      }
    },
    // 设置角色权限
    editRolePermission(role) {
      const currThis = this
      currThis.editRolePermissionVisible = !currThis.editRolePermissionVisible
      currThis.roleId = role.roleId
    },
    // 设置角色权限的回调函数
    updateRolePermissionSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.editRolePermissionVisible = !currThis.editRolePermissionVisible
        currThis.queryAllRole()
        currThis.$message.success(returnJson.message)
      } else {
        currThis.editRolePermissionVisible = !currThis.editRolePermissionVisible
        currThis.queryAllRole()
        currThis.$message.error(returnJson.message)
      }
    },
    // 删除角色
    deleteRole(role) {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/role/deleteRole', {
        params: {
          roleId: role.roleId
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          const returnJson = res.data
          if (returnJson.code === 200) {
            currThis.$message.success(returnJson.message)
          } else {
            currThis.$message.error(returnJson.message)
          }
          currThis.queryAllRole()
        })
        .catch(error => console.log(error))
    },
    // 查询所有角色信息
    queryAllRole() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/role/queryAllRole', {
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.role = res.data
        })
        .catch(error => console.log(error))
    }
  }
}
</script>
