<template>
  <div>
    <el-table
      ref="addSeckillCommodityTable"
      :data="CommodityList"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >

      <el-table-column v-model="multipleSelection" type="selection" align="center" />

      <el-table-column label="商品名称" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.comName }}</template>
      </el-table-column>

      <el-table-column prop="name" label="货号" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.comNo }}</template>
      </el-table-column>

      <el-table-column prop="name" label="价格" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.comPrice }}</template>
      </el-table-column>

      <el-table-column prop="name" label="商品总库存" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.comStock }}</template>
      </el-table-column>

    </el-table>
    <el-button type="primary" @click="addformTables">确定加入商品</el-button>

    <el-dialog title="编辑数量" append-to-body :visible.sync="addSeckillCommodity1Visible">
      <addSeckillCommodity1
        v-if="addSeckillCommodity1Visible"
        :seckillid="seckillids"
        :commodity-id="commodityId"
        @addSuccessClick="addSuccessClick"
      />
    </el-dialog>
  </div>
</template>
<script>
import addSeckillCommodity1 from '@/views/components/operate/addSeckillCommodity1'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'AddSeckillCommodity',
  components: {
    addSeckillCommodity1
  },
  props: ['seckillid'],
  data() {
    return {
      CommodityList: [],
      multipleSelection: [],
      commodityIds: [],
      commodityId: '',
      seckillids: 0,
      addSeckillCommodity1Visible: false
    }
  },
  mounted() {
    // 页面一加载完毕调用这个方法进行渲染商品
    this.queryAllCommodity()
  },

  methods: {
    // 查询所有的商品 添加到活动秒杀商品中
    queryAllCommodity() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/commodity/selectCommodityInfo.do', {
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }})
        .then(res => currThis.CommodityList = res.data)
        .catch(error => console.log(error))
    },

    // 当复选框发生改变把id传入multipleSelection 数组中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    addformTables() {
      const currThis = this
      currThis.addSeckillCommodity1Visible = !currThis.addSeckillCommodity1Visible
      for (const i in currThis.multipleSelection) {
        currThis.commodityIds.push(currThis.multipleSelection[i].comId)
      }
      currThis.commodityId = currThis.commodityIds.join(',')
      currThis.seckillids = currThis.seckillid
    },

    addSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.addSeckillCommodity1Visible = !currThis.addSeckillCommodity1Visible
        currThis.$message.success(returnJson.message)
        currThis.$emit('addSuccessClick', returnJson)
      } else {
        currThis.editUserRoleVisible = !currThis.editUserRoleVisible
        currThis.$message.error(returnJson.message)
        currThis.$emit('addSuccessClick', res.data)
      }
    }

  }
}
</script>
