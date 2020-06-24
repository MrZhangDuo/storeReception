<template>
  <div>
    <!-- --------------------模糊查询开始-------------------------------------------------------------------------- -->
    <el-card class="box-card">
      <el-form ref="Seckill" :inline="true" :model="selectSeckill" class="demo-form-inline">
        <el-form-item label="活动标题">
          <el-input v-model="selectSeckill.seckillTitle" placeholder="活动标题" />
        </el-form-item>

        <el-form-item label="活动状态">
          <el-select v-model="selectSeckill.seckillStatus" placeholder="活动状态">
            <el-option label="上架" value="1" />
            <el-option label="下架" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-col :span="11">
            <el-date-picker v-model="selectSeckill.startTime" type="date" placeholder="选择日期" />
          </el-col>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-col :span="11">
            <el-date-picker v-model="selectSeckill.endTime" type="date" placeholder="选择日期" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryAllSecill">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" round @click="addSeckill">添加活动</el-button>
    </el-card>
    <!-- --------------------模糊查询结束-------------------------------------------------------------------------- -->

    <!-- --------------------查询表格开始-------------------------------------------------------------------------- -->
    <el-table
      :data="secillList"
    >

      <el-table-column label="编号" width="100%">
        <template slot-scope="scope">
          {{ scope.row.seckillId }}
        </template>
      </el-table-column>

      <el-table-column label="活动标题" width="100%">
        <template slot-scope="scope">
          {{ scope.row.seckillTitle }}
        </template>
      </el-table-column>

      <el-table-column label="活动状态" width="100%">
        <template slot-scope="scope">
          {{ scope.row.seckillStatus ? "正在进行中":"已结束" }}
        </template>
      </el-table-column>

      <el-table-column label="开始时间" width="160%">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>

      <el-table-column label="结束时间" width="160%">
        <template slot-scope="scope">
          {{ scope.row.endTime }}
        </template>
      </el-table-column>

      <el-table-column label="上架商品(种)" width="100%">
        <template slot-scope="scope">
          {{ scope.row.seckillComNum }}
        </template>
      </el-table-column>

      <el-table-column label="上架/下架" width="140%">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.seckillStatus"
            inactive-text="下架"
            active-text="上架"
            @change="setStatus(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" round @click="queryByIdCommodity(scope.row)">商品活动</el-button>
          <el-button type="primary" round @click="editSeckill(scope.row)">编辑活动</el-button>
          <el-button type="danger" round @click="deleteCommodity(scope.row)">删除活动</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- --------------------查询表格结束-------------------------------------------------------------------------- -->

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

    <!-- --------------------操作弹出框开始------------------------------------------------------------------------ -->
    <el-dialog title="商品信息" :visible.sync="activityCommodityVisible">
      <activityCommodity v-if="activityCommodityVisible" :seckillid="seckillId" />
    </el-dialog>

    <el-dialog title="活动编辑" :visible.sync="editCommodityVisible">
      <editCommodity v-if="editCommodityVisible" :seckillid="seckillId" @updateSuccessClick="updateSuccessClick" />
    </el-dialog>

    <el-dialog title="添加活动" :visible.sync="addCommodityVisible">
      <addSeckill v-if="addCommodityVisible" :seckillid="seckillId" @addSuccessClick="addSuccessClick" />
    </el-dialog>
    <!-- --------------------操作弹出框结束------------------------------------------------------------------------ -->
  </div>
</template>
<script>
import activityCommodity from '@/views/components/operate/activityCommodity'
import editCommodity from '@/views/components/operate/editCommodity'
import addSeckill from '@/views/components/operate/addSeckill'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'SeckillTable',
  components: {
    activityCommodity,
    editCommodity,
    addSeckill
  },
  data() {
    return {
      activityCommodityVisible: false, // 查询商品活动的弹出框
      editCommodityVisible: false, // 编辑商品活动的弹出框
      addCommodityVisible: false, // 添加活动的弹出框
      seckillId: 0, // 查询商品活动ID
      secillList: [], // 渲染表格
      selectSeckill: {}, // 模糊查询
      currentPage: 1, // 分页用的
      pageSize: 1, // 分页用的
      totalNum: 0 // 分页用的
    }
  },
  mounted() {
    this.queryAllSecill()
  },
  methods: {
    // 查询所有的秒杀活动 以及模糊查询
    queryAllSecill() {
      const currThis = this
      let startTimes = ''
      let endTimes = ''
      if (currThis.selectSeckill.startTime != null && currThis.selectSeckill.endTime != null) {
        startTimes = currThis.$moment(currThis.selectSeckill.startTime).format('YYYY-MM-DDTHH:mm:ss')
        endTimes = currThis.$moment(currThis.selectSeckill.endTime).format('YYYY-MM-DDTHH:mm:ss')
      }
      currThis.$axios.get('http://localhost:8080/seckill/queryAllSeckill', {
        params: {
          seckillTitle: currThis.selectSeckill.seckillTitle,
          seckillStatus: currThis.selectSeckill.seckillStatus,
          startTimes: startTimes,
          endTimes: endTimes,
          currentPage: currThis.currentPage,
          pageSize: currThis.pageSize
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => {
          currThis.secillList = res.data.records
          currThis.totalNum = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加活动 打开弹出框
    addSeckill() {
      this.addCommodityVisible = !this.addCommodityVisible
    },
    // 添加活动回调事件
    addSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.addCommodityVisible = !currThis.addCommodityVisible
        currThis.$message.success(returnJson.message)
      } else {
        currThis.addCommodityVisible = !currThis.addCommodityVisible
        currThis.$message.error(returnJson.message)
      }
      currThis.queryAllSecill()
    },
    // 删除活动删除事件
    deleteCommodity(seckill) {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/seckill/deleteSeckillById', {
        params: {
          seckillId: seckill.seckillId
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
          currThis.queryAllSecill()
        })
        .catch(error => console.log(error))
    },
    // 当我点击编辑活动调用的方法
    editSeckill(seckill) {
      const currThis = this
      currThis.editCommodityVisible = !currThis.editCommodityVisible
      currThis.seckillId = seckill.seckillId
    },
    // 编辑活动的回调事件
    updateSuccessClick(returnJson) {
      const currThis = this
      if (returnJson.code === 200) {
        currThis.editCommodityVisible = !currThis.editCommodityVisible
        currThis.$message.success(returnJson.message)
      } else {
        currThis.editCommodityVisible = !currThis.editCommodityVisible
        currThis.$message.error(returnJson.message)
      }
      currThis.queryAllSecill()
    },
    // 当我点击商品活动调用的方法
    queryByIdCommodity(seckill) {
      const currThis = this
      currThis.activityCommodityVisible = !currThis.activityCommodityVisible
      currThis.seckillId = seckill.seckillId
    },
    // 每页条数
    handleSizeChange(pageSize) {
      const currThis = this
      currThis.pageSize = pageSize
      currThis.queryAllSecill()
    },
    // 当前页
    handleCurrentChange(currentSize) {
      const currThis = this
      currThis.currentPage = currentSize
      currThis.queryAllSecill()
    },
    // 重置表单并刷新页面
    resetForm() {
      this.selectSeckill.seckillTitle = ''
      this.selectSeckill.seckillStatus = ''
      this.selectSeckill.startTime = this.$options.data().startTime
      this.selectSeckill.endTime = this.$options.data().endTime
      this.queryAllSecill()
    }
  }
}
</script>
