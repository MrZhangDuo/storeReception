<template>
  <div>
    <el-card class="box-card">
      <el-form ref="selectRerurnsTable" :inline="true" :model="selectRerurns" class="demo-form-inline">
        <el-form-item label="服务单号">
          <el-input v-model="selectRerurns.orderNo" placeholder="服务单号" />
        </el-form-item>

        <el-form-item label="申请类型">
          <el-select v-model="selectRerurns.returnType" placeholder="活动状态">
            <el-option label="退(换)货" value="退货" />
            <el-option label="退款" value="退款" />
          </el-select>
        </el-form-item>

        <el-form-item label="申请状态">
          <el-select v-model="selectRerurns.applyforStatus" placeholder="活动状态">
            <el-option label="已处理" value="已处理" />
            <el-option label="待处理" value="待处理" />
            <el-option label="已拒绝" value="已拒绝" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryAllReturns">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table
      :data="returnsList"
    >

      <el-table-column label="服务单号" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column label="申请类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.returnType }}
        </template>
      </el-table-column>
      <el-table-column label="申请原因" align="center">
        <template slot-scope="scope">
          {{ scope.row.returnReason }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.applyforTime }}
        </template>
      </el-table-column>
      <el-table-column label="客户账号" align="center">
        <template slot-scope="scope">
          {{ scope.row.custAccount }}
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.returnMoney }}
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.applyforStatus }}
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.manageTime }}
        </template>
      </el-table-column>

      <el-table-column
        label="申请商品"
        align="center"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>货号: {{ scope.row.comNo }}</p>
            <p>价格: {{ scope.row.comPrice }}</p>
            <p>商品销量: {{ scope.row.comSales }}</p>
            <p>商品库存: {{ scope.row.comStock }}</p>
            <p>商品品牌: {{ scope.row.comBrand }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.comName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.applyforStatus == '待处理'" type="danger" round @click="agree(scope.row)">审核通过</el-button>
          <br>
          <el-button v-if="scope.row.applyforStatus == '待处理'" type="danger" round @click="refuse(scope.row)">审核拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  </div>
</template>
<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'ActivityCommodity',
  data() {
    return {
      currentPage: 1, // 分页用的
      pageSize: 1, // 分页用的
      totalNum: 0, // 分页用的
      selectRerurns: {}, // 模糊查询
      returnsList: [] // 所有退换(款)商品
    }
  },
  mounted() {
    this.queryAllReturns()
  },

  methods: {
    agree(returns) {
      const currThis = this
      this.$confirm('此操作将同意买家:"' + returns.returnType + '"!!原因是:"' + returns.returnReason + '", 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '您同意了买家"' + returns.returnType + '"!'
        })

        currThis.$axios.get('http://localhost:8080/returns/examine', {
          params: {
            orderId: returns.orderid, // 订单主键
            orderStatus: '' + returns.returnType + '中', // 修改同意后的状态
            returnId: returns.returnId, // 退换(款)货主键
            applyforStatus: '已同意'// 修改审核通过的状态
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
            currThis.queryAllReturns()
          })
          .catch(error => console.log(error))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消"' + returns.returnType + '"'
        })
      })
    },
    refuse(returns) {
      const currThis = this
      this.$confirm('此操作将拒绝买家:"' + returns.returnType + '"!!原因是:"' + returns.returnReason + '", 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '您已拒绝了买家"' + returns.returnType + '"!'
        })

        currThis.$axios.get('http://localhost:8080/returns/examine', {
          params: {
            returnId: returns.returnId, // 退换(款)货主键
            applyforStatus: '已拒绝'// 修改审核通过的状态
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
            currThis.queryAllReturns()
          })
          .catch(error => console.log(error))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消"' + returns.returnType + '"!'
        })
      })
    },
    // 查询退货(款)所有商品
    queryAllReturns() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/returns/queryAllReturns', {
        params: {
          currentPage: currThis.currentPage,
          pageSize: currThis.pageSize,
          orderNo: currThis.selectRerurns.orderNo,
          returnType: currThis.selectRerurns.returnType,
          applyforStatus: currThis.selectRerurns.applyforStatus
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.returnsList = res.data.records
          currThis.totalNum = res.data.total
        })
        .catch(error => console.log(error))
    },

    // 每页条数
    handleSizeChange(pageSize) {
      const currThis = this
      currThis.pageSize = pageSize
      currThis.queryAllReturns()
    },

    // 当前页
    handleCurrentChange(currentSize) {
      const currThis = this
      currThis.currentPage = currentSize
      currThis.queryAllReturns()
    },

    // 重置表单并刷新页面
    resetForm() {
      this.selectRerurns.orderNo = ''
      this.selectRerurns.returnType = ''
      this.selectRerurns.applyforStatus = ''
      this.queryAllReturns()
    }

  }
}
</script>
