<template>
  <div>
    <!-- --------------------模糊查询开始-------------------------------------------------------------------------- -->
    <el-card class="box-card">
      <el-form ref="Seckill" :inline="true" :model="selectOrders" class="demo-form-inline">
        <el-form-item label="收货人">
          <el-input v-model="selectOrders.orderPeople" placeholder="收货人" />
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="selectOrders.orderStatus" placeholder="活动状态">
            <el-option label="待发货" value="待发货" />
            <el-option label="待付款" value="待付款" />
            <el-option label="退货中" value="退货中" />
            <el-option label="退款中" value="退款中" />
            <el-option label="已发货" value="已发货" />
            <el-option label="已付款" value="已付款" />
            <el-option label="确认收货" value="确认收货" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryAllorders">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- --------------------模糊查询结束-------------------------------------------------------------------------- -->
    <el-table
      size="medium"
      border
      :data="ordersList"
      style="width: 110%"
    >
      <el-table-column label="订单编号" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="收货人" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderPeople }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单地址" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderAddress }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单时间" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单金额" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderMony }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单数量" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="100%"
        label="商品名称"
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

      <el-table-column label="订单状态" width="100%">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.orderStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" round @click="editSeckill(scope.row)">编辑订单</el-button>
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

    <el-dialog title="活动编辑" :visible.sync="editOrdersVisible">
      <editOrders v-if="editOrdersVisible" :orderid="orderId" @updateSuccessClick="updateSuccessClick" />
    </el-dialog>
  </div>
</template>
<script>
import editOrders from '@/views/components/orders/editOrders'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'OrderTable',
  components: {
    editOrders
  },
  // data()函数 定义一些数据 必须要返回一个对象类型
  data() {
    return {
      ordersList: [], /* 接受订单数据  */
      selectOrders: {}, // 模糊查询
      currentPage: 1, // 分页用的
      pageSize: 1, // 分页用的
      totalNum: 0, // 分页用的
      editOrdersVisible: false,
      orderId: 0

    }
  },
  // 当vue初始化完成之后调用mounted方法 优先执行
  // 这里是渲染表格
  mounted() {
    this.queryAllorders()
  },
  // 定义一些方法 vue所有的方法基本都放在methods里面
  methods: {
    // 当我点击编辑活动调用的方法
    editSeckill(orders) {
      const currThis = this
      currThis.editOrdersVisible = !currThis.editOrdersVisible
      currThis.orderId = orders.orderId
    },
    // 编辑活动的回调事件
    updateSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.editOrdersVisible = !currThis.editOrdersVisible
        currThis.$message.success(returnJson.message)
      } else {
        currThis.editOrdersVisible = !currThis.editOrdersVisible
        currThis.$message.error(returnJson.message)
      }
      currThis.queryAllorders()
    },
    // 查询所有的订单信息
    queryAllorders() {
      const currThis = this
			  currThis.$axios.get('http://localhost:8080/orders/queryAllOrders', {
        params: {
          currentPage: currThis.currentPage,
          pageSize: currThis.pageSize,
          orderPeople: currThis.selectOrders.orderPeople,
          orderStatus: currThis.selectOrders.orderStatus
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.ordersList = res.data.records
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
      currThis.queryAllorders()
    },

    // 当前页
    handleCurrentChange(currentSize) {
      const currThis = this
      currThis.currentPage = currentSize
      currThis.queryAllorders()
    },
    // 重置表单并刷新页面
    resetForm() {
      this.selectOrders.orderPeople = ''
      this.selectOrders.orderStatus = ''
      this.queryAllorders()
    }
  }
}
</script>
