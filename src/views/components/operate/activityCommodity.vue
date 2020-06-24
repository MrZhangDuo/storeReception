<template>
  <div>
    <el-card class="box-card">
      <el-form ref="SeckillCommodityTable" :inline="true" :model="selectSeckillCommodity" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="selectSeckillCommodity.comName" placeholder="商品名称" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="querySeckilCommodity">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" round @click="addSeckillCommodity">商品添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table
      :data="seckillcommodity"
    >

      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.secComId }}
        </template>
      </el-table-column>

      <el-table-column
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

      <el-table-column label="秒杀价格" align="center">
        <template slot-scope="scope">
          {{ scope.row.seckillMoney }}
        </template>
      </el-table-column>

      <el-table-column label="秒杀数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.seckillNumber }}
        </template>
      </el-table-column>

      <el-table-column label="剩余数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.surplusNumber }}
        </template>
      </el-table-column>

      <el-table-column label="限购数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.limitNumber }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" round @click="deleteSeckillCommodity(scope.row)">商品删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加秒杀商品" append-to-body :visible.sync="addSeckillCommodityVisible">
      <addSeckillCommodity v-if="addSeckillCommodityVisible" :seckillid="seckillids" @addSuccessClick="addSuccessClick" />
    </el-dialog>

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
import addSeckillCommodity from '@/views/components/operate/addSeckillCommodity'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'ActivityCommodity',
  components: {
    addSeckillCommodity
  },
  props: ['seckillid'],
  data() {
    return {
      addSeckillCommodityVisible: false,
      seckillcommodity: [],
      selectSeckillCommodity: {},
      seckillids: 0,
      currentPage: 1, // 分页用的
      pageSize: 1, // 分页用的
      totalNum: 0 // 分页用的
    }
  },
  mounted() {
    this.querySeckilCommodity()
  },

  methods: {
    // 查询某个活动下的所有商品
    querySeckilCommodity() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/seckillcommodity/queryAllSeckillCommodity', {
        params: {
          seckillId: currThis.seckillid,
          comName: currThis.selectSeckillCommodity.comName,
          currentPage: currThis.currentPage,
          pageSize: currThis.pageSize
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.seckillcommodity = res.data.records
          currThis.totalNum = res.data.total
        })
        .catch(error => console.log(error))
    },

    // 给当前的活动添加秒杀的商品
    addSeckillCommodity() {
      this.addSeckillCommodityVisible = !this.addSeckillCommodityVisible
      this.seckillids = this.seckillid
    },

    // 删除秒杀商品
    deleteSeckillCommodity(seckillcommodity) {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/seckillcommodity/deleteSeckillCommodity', {
        params: {
          secComId: seckillcommodity.secComId
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
          currThis.querySeckilCommodity()
        })
        .catch(error => console.log(error))
    },

    addSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.addSeckillCommodityVisible = !currThis.addSeckillCommodityVisible
        currThis.querySeckilCommodity()
        currThis.$message.success(returnJson.message)
      } else {
        currThis.editUserRoleVisible = !currThis.editUserRoleVisible
        currThis.querySeckilCommodity()
        currThis.$message.error(returnJson.message)
      }
    },

    // 每页条数
    handleSizeChange(pageSize) {
      const currThis = this
      currThis.pageSize = pageSize
      currThis.querySeckilCommodity()
    },

    // 当前页
    handleCurrentChange(currentSize) {
      const currThis = this
      currThis.currentPage = currentSize
      currThis.querySeckilCommodity()
    },

    // 重置表单并刷新页面
    resetForm() {
      this.selectSeckillCommodity.comName = ''
      this.querySeckilCommodity()
    }

  }
}
</script>
