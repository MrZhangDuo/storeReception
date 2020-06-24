<template>
  <div>
    <!-- --------------------模糊查询开始-------------------------------------------------------------------------- -->
    <el-card class="box-card">
      <el-form ref="selectCustomerTable" :inline="true" :model="selectCustomer" class="demo-form-inline">
        <el-form-item label="用户账号">
          <el-input v-model="selectCustomer.custAccount" placeholder="收货人" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="selectCustomer.custName" placeholder="收货人" />
        </el-form-item>

        <el-form-item label="注册时间">
          <el-col :span="11">
            <el-date-picker v-model="selectCustomer.zcTimes" type="date" placeholder="选择日期" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryAllCustomer">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- --------------------模糊查询结束-------------------------------------------------------------------------- -->
    <el-table
      size="medium"
      border
      :data="customerList"
      style="width: 110%"
    >

      <el-table-column label="客户ID" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.custId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="客户账号" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.custAccount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="客户昵称" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.custName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员登记" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.vipGrade }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消费金额" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderMony }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单数量" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderCount }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="账号启用状态" width="100%">
			<template slot-scope="scope">
				<span style="margin-left: 10px">{{ scope.row.accountStatus}}</span>
			</template>
		</el-table-column> -->

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" round>查看</el-button>
          <el-button type="primary" round>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- --------------------分页开始------------------------------------------------------------------------------ -->
    <el-pagination
      background
      :current-page="currentPage"
      :page-sizes="[1,2,3]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- --------------------分页结束------------------------------------------------------------------------------ -->
  </div>
</template>
<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'CustomerTable',
  // data()函数 定义一些数据 必须要返回一个对象类型
  data() {
	  return {
      customerList: [], /* 接受订单数据  */
      selectCustomer: {}, // 模糊查询
      currentPage: 1, // 分页用的
      pageSize: 1, // 分页用的
      totalNum: 0 // 分页用的
	  }
  },
  // 当vue初始化完成之后调用mounted方法 优先执行
  // 这里是渲染表格
  mounted() {
    this.queryAllCustomer()
  },
  // 定义一些方法 vue所有的方法基本都放在methods里面
  methods: {
	  // 查询所有的订单信息
	  queryAllCustomer() {
      const currThis = this
      let zcTimes = ''
      if (currThis.selectCustomer.zcTimes != null) {
        zcTimes = currThis.$moment(currThis.selectCustomer.zcTimes).format('YYYY-MM-DD')
      }
      currThis.$axios.get('http://localhost:8080/customer/queryAllCustomer', {
        params: {
          currentPage: currThis.currentPage,
          pageSize: currThis.pageSize,
          custAccount: currThis.selectCustomer.custAccount,
          custName: currThis.selectCustomer.custName,
          zcTimes: zcTimes
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.customerList = res.data.records
          currThis.totalNum = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
	  },
	  // 每页条数
	  handleSizeChange(pageSize) {
      const currThis = this
      currThis.pageSize = pageSize
      currThis.queryAllCustomer()
	  },
	  // 当前页
	  handleCurrentChange(currentSize) {
      const currThis = this
      currThis.currentPage = currentSize
      currThis.queryAllCustomer()
	  },
	  // 重置表单并刷新页面
	  resetForm() {
      this.selectCustomer.custAccount = ''
      this.selectCustomer.custName = ''
      this.selectCustomer.zcTimes = this.$options.data().zcTimes
      this.queryAllCustomer()
	  }
  }
}
</script>
