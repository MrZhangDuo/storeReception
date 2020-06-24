<template>
  <div>
    <el-card class="box-card">
      <el-form ref="user" :inline="true" :model="user" class="demo-form-inline">
        <el-form-item label="用户姓名">
          <el-input v-model="user.userName" placeholder="用户姓名" />
        </el-form-item>

        <el-form-item label="用户账号">
          <el-input v-model="user.userAccount" placeholder="用户账号" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryAllUser">查询</el-button>
          <el-button @click="resetForm('user')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="success" round @click="addUser">添加用户</el-button>
    </el-card>

    <el-table :data="userList" align="center">
      <el-table-column label="用户账号" align="center" min-width="30%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userAccount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户邮箱" align="center" min-width="30%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userEmail }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户密码" align="center" min-width="30%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userPass }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户姓名" align="center" min-width="30%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户头像" align="center" min-width="33%">
        <template slot-scope="scope">
          <img :src="scope.row.userImg" class="avatar">
        </template>
      </el-table-column>

      <el-table-column label="是否可用" align="center" min-width="30%">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.userStatus"
            inactive-text="不可用"
            active-text="可用"
            @change="setStatus(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="100%">
        <template slot-scope="scope">
          <el-button type="primary" round @click="updateUser(scope.row)">编辑用户</el-button>
          <el-button type="info" round @click="editUserRole(scope.row)">设置角色</el-button>
          <el-button type="danger" round @click="deleteUser(scope.row)">删除用户</el-button>
          <!-- <el-button size="medium" type="success" @click="addUser" icon="el-icon-circle-plus" circle></el-button>
          <el-button size="medium" type="primary" @click="updateUser(scope.row)" icon="el-icon-edit" circle></el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page="currentPage"
      :page-sizes="[10,15,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="添加客户信息" :visible.sync="addUserVisible">
      <addUser v-if="addUserVisible" @addSuccessClick="addSuccessClick" />
    </el-dialog>
    <el-dialog title="修改客户信息" :visible.sync="updateUserVisible">
      <updateUser v-if="updateUserVisible" :user-id="userId" @updateSuccessClick="updateSuccessClick" />
    </el-dialog>
    <el-dialog title="设置用户角色" :visible.sync="editUserRoleVisible">
      <editUserRole v-if="editUserRoleVisible" :user-id="userId" @updateUserRoleSuccessClick="updateUserRoleSuccessClick" />
    </el-dialog>
  </div>
</template>
<script>
import addUser from '@/views/components/userManage/addUser'
import updateUser from '@/views/components/userManage/updateUser'
import editUserRole from '@/views/components/userManage/editUserRole'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'QueryAllUser',
  components: {
    addUser,
    updateUser,
    editUserRole
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,

      userList: [],
      addUserVisible: false,
      updateUserVisible: false,
      editUserRoleVisible: false,
      userId: 0,
      user: {}
    }
  },
  mounted() {
    this.queryAllUser()
  },
  methods: {
    // 查询所有的用户
    queryAllUser() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/user/queryAllUser', {
        params: {
          userName: currThis.user.userName,
          userAccount: currThis.user.userAccount,
          startPage: currThis.currentPage,
          total: currThis.pageSize
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.userList = res.data.records
          currThis.totalNum = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 编辑用户的角色
    editUserRole(user) {
      this.editUserRoleVisible = !this.editUserRoleVisible,
      this.userId = user.userId
    },

    // 修改用户角色成功的回调
    updateUserRoleSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.editUserRoleVisible = !currThis.editUserRoleVisible
        currThis.queryAllUser()
        currThis.$message.success(returnJson.message)
      } else {
        currThis.editUserRoleVisible = !currThis.editUserRoleVisible
        currThis.queryAllUser()
        currThis.$message.error(returnJson.message)
      }
    },

    // 删除用户
    deleteUser(user) {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/user/deleteUser', {
        params: {
          userId: user.userId
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          const returnJson = res.data
          if (returnJson.code === 200) {
            this.$message.success(returnJson.message)
          } else {
            currThis.$message.error(returnJson.message)
          }
          currThis.queryAllUser()
        })
        .catch(error => console.log(error))
    },

    // 修改用户
    updateUser(user) {
      this.updateUserVisible = !this.updateUserVisible,
      this.userId = user.userId
    },

    // 修改用户成功的回调
    updateSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.updateUserVisible = !currThis.updateUserVisible
        currThis.queryAllUser()
        currThis.$message.success(returnJson.message)
      } else {
        currThis.updateUserVisible = !currThis.updateUserVisible
        currThis.queryAllUser()
        currThis.$message.error(returnJson.message)
      }
    },

    // 添加用户
    addUser() {
      this.addUserVisible = !this.addUserVisible
    },

    // 添加用户成功的回调
    addSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.addUserVisible = !currThis.addUserVisible
        currThis.queryAllUser()
        currThis.$message.success(returnJson.message)
      } else {
        currThis.addUserVisible = !currThis.addUserVisible
        currThis.queryAllUser()
        currThis.$message.error(returnJson.message)
      }
    },

    // 每页条数
    handleSizeChange(pageSize) {
      const currThis = this
      currThis.pageSize = pageSize
      currThis.queryAllUser()
    },
    // 当前页
    handleCurrentChange(currentSize) {
      const currThis = this
      currThis.currentPage = currentSize
      currThis.queryAllUser()
    },

    // 重置表单内容
    resetForm(user) {
      const currThis = this
      currThis.user.userName = ''
      currThis.user.userAccount = ''
      currThis.queryAllUser()
    },

    // 修改账号状态
    setStatus(user) {
      const currThis = this
	    currThis.$axios.get('http://localhost:8080/user/updateUser', {
        params: user,
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
          currThis.queryAllUser()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
