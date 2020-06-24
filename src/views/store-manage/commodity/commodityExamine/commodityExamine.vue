<template>
  <div>
    <h2>这是商品审核页面</h2>
    <el-form :inline="true" :model="selectcom" class="demo-form-inline">
      <el-form-item label="商品名称">
        <el-input v-model="selectcom.comName" placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="商品货号">
        <el-input v-model="selectcom.comNo" placeholder="请选择商品货号" />
      </el-form-item>
      <el-form-item label="商品品牌">
        <el-input v-model="selectcom.comBrand" placeholder="请选择商品品牌" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="selectlike()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="checkCommodity"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="comNo"
        label="商品货号"
        width="180"
      />
      <!-- <el-table-column
        fixed
        prop="comNumber"
        label="商品编号"
        width="180"
      /> -->
      <el-table-column
        prop="comImg"
        label="商品图片"
        width="160"
      />
      <el-table-column
        prop="comName"
        label="商品名称"
        width="160"
      />
      <el-table-column
        prop="comBrand"
        label="商品品牌"
        width="160"
      />
      <el-table-column
        prop="comLabel"
        label="标签"
        width="120"
      />
      <el-table-column
        prop="comSales"
        label="销量"
        width="120"
      />

      <el-table-column
        prop="comState"
        label="审核状态"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.comState==1?'审核通过':'待审核' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">  <!-- scope.row:获取当前行的信息 -->
          <el-button type="danger" plain size="mini" @click="Audit(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="商品审核"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <el-form :inline="true" :model="selectInfo" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="selectInfo.comName" :disabled="true" placeholder="商品名称" />
        </el-form-item>
        <el-form-item label="商品品牌">
          <el-input v-model="selectInfo.comBrand" :disabled="true" placeholder="商品品牌" />
        </el-form-item>
        <el-form-item label="商品审核">
          <el-radio v-model="selectInfo.comState" :label="1">审核通过</el-radio>
          <el-radio v-model="selectInfo.comState" :label="2">审核不通过</el-radio>
        </el-form-item>

        <el-form-item label="反馈详情">
          <el-input v-model="selectInfo.comDetail" type="textarea" :rows="2" placeholder="反馈详情" />
        </el-form-item>
        <el-form-item>
          <template slot-scope="scope">
            <el-button type="primary" plain @click="checkedsInfo(scope.row)">确定</el-button>
          </template>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!--
  <div class="block"> -->
    <!--total:总条数  -->
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync = "currentPage"
      :page-sizes="[3, 7, 10, 15]"
      :page-size="3"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allnumber">
    </el-pagination>
  </div> -->
  </div>
</template>

<script>
export default {
  name: 'CommodityExamine',
  data() {
    return {
      selectcom: {},
      centerDialogVisible: false,
      currentPage: 1,
      checkCommodity: [],
      selectInfo: {},
      addAudit: {
        aComid: '',
        aState: '',
        aDetails: ''
      }
    }
  },

  mounted() {
    this.selectAllCkeckInfo()
  },

  methods: {

    selectlike(formsLike) {
      var that = this

      this.$axios.get('http://localhost:8080/commodity/selectLikeInfo.do', {
        params: {
          comName: that.selectcom.comName,
          comNo: that.selectcom.comNo,
          comBrand: that.selectcom.comBrand
        }
      })
        .then(res => {
          that.checkCommodity = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    selectAllCkeckInfo() {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectCheckCommodity.do')
        .then(res => {
          that.checkCommodity = res.data
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },

    Audit(id) {
      this.centerDialogVisible = !this.centerDialogVisible
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectCommodityById.do', {
        params: {
          comId: id.comId
        }
      })
        .then(res => {
          that.selectInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    checkedsInfo() {
      this.centerDialogVisible = !this.centerDialogVisible
      const that = this
      this.$axios.get('http://localhost:8080/commodity/updateCheckCommodity.do', {
        params: {
          comId: that.selectInfo.comId,
          comState: that.selectInfo.comState,
          comDetail: that.selectInfo.comDetail
        }
      })
        .then(res => {
          that.selectAllCkeckInfo()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>

</style>
