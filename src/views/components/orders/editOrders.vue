<template>
  <div>
    <el-form ref="ordersTable" :model="orders" :rules="yanzheng" label-width="100px" class="demo-ruleForm">
      <el-form-item label="订单编号">
        <el-input v-model="orders.orderNo" disabled="false" placeholder="活动标题" />
      </el-form-item>
      <el-form-item label="收货人" prop="orderPeople">
        <el-input v-model="orders.orderPeople" placeholder="活动标题" />
      </el-form-item>
      <el-form-item label="收货地址" prop="orderAddress">
        <el-input v-model="orders.orderAddress" placeholder="活动标题" />
      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="editOrders('ordersTable')">确定修改</el-button>
        <el-button @click="resetForm('ordersTable')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'EditOrder',
  props: ['orderid'],
  data() {
    return {
      orders: {},
      yanzheng: {
        orderPeople: [
          { required: true, message: '请输入收货人', trigger: 'blur' }
        ],
        orderAddress: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.queryOrdersById()
  },

  methods: {
    queryOrdersById() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/orders/queryOrderById', {
        params: {
          orderId: currThis.orderid
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => { currThis.orders = res.data })
        .catch(error => console.log(error))
    },

    editOrders(order) {
      const currThis = this
      let orderTimes = ''
      currThis.$refs[order].validate((valid) => {
        if (valid) {
          if (currThis.orders.orderTime != null) {
            orderTimes = currThis.$moment(currThis.orders.orderTime).format('YYYY-MM-DDTHH:mm:ss')
            currThis.orders.orderTime = null
          }
          currThis.$axios.get('http://localhost:8080/orders/updateOrderById?orderTimes=' + orderTimes, {
            params: currThis.orders,
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
    resetForm(ordersTable) {
      this.$refs[ordersTable].resetFields()
    }
  }
}
</script>
