<template>
  <div>
    <el-divider /><!--分割线 -->

    <el-col :span="4">
      <el-badge :value="allnumber" type="primary">
        <el-button size="small">全部商品</el-button>
      </el-badge>
    </el-col>
    <el-col :span="4">
      <el-badge :value="putnumber" type="primary">
        <el-button size="small">已上架</el-button>
      </el-badge>
    </el-col>
    <el-col :span="4">
      <el-badge :value="outnumber" type="primary">
        <el-button size="small">未上架</el-button>
      </el-badge>
    </el-col>
    <el-col :span="4">
      <el-badge :value="checknumber" type="primary">
        <el-button size="small">待审核</el-button>
      </el-badge>
    </el-col>
    <el-col :span="4">
      <el-badge :value="notpassnumber" type="primary">
        <el-button size="small">已通过</el-button>
      </el-badge>
    </el-col>

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
      :data="commodityInfo"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="商品编号"
        width="120"
      />
      <el-table-column
        prop="comNo"
        label="商品货号"
        width="180"
      />
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
        label="SKU库存"
        width="120"
      >
        <template slot-scope="scope">
          <el-button type="primary" plain @click="gotoInfo(scope.row)"><i class="el-icon-edit-outline" /></el-button>
        </template>
      </el-table-column>

      <el-table-column label="商品标签" width="160">
        <template slot-scope="scope"> 是否上架
          <el-switch
            v-model="scope.row.comLabel"
            active-color="#13ce66"
            inactive-color="#CCCCCC"
            active-value="上架"
            inactive-value="未上架"
            @change="changeSwich(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="comSales"
        label="商品销量"
        width="120"
      />

      <el-table-column
        prop="comState"
        label="审核状态"
        width="120"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.comState==1?'审核通过':'待审核' }}</div>
          <el-link type="success" @click="selectAudit(scope.row)">审核详情</el-link>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">  <!-- scope.row:获取当前行的信息 -->
          <el-button type="danger" plain size="mini" @click="deleteCom(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="查看商品审核信息" :visible.sync="centerDialogVisible" width="50%" center>
      <span>
        <template>
          <el-table :data="AuditInfo" style="width: 100%">
            <el-table-column prop="aTime" label="审核时间" width="180" />
            <el-table-column prop="aPerson" label="审核人员" width="180" />
            <el-table-column prop="comState" label="审核结果" width="180" />
            <el-table-column prop="comDetail" label="反馈详情" width="180">
              <!-- <template slot-scope="scope">
                  {{scope.row.comDetail==""?"审核通过":scope.row.comDetail}}
               </template> -->
            </el-table-column>
          </el-table>
        </template>
      </span>
    </el-dialog>

    <el-form :model="formInfo">
      <el-dialog title="SKU库存信息" :visible.sync="isshow" width="70%" center>
        <el-table :data="formInfo.goto" style="width: 100%">
          <el-table-column label="编号" width="190" align="center">
            <template slot-scope="scope">{{ scope.row.comSku }}</template>
          </el-table-column>
          <el-table-column label="尺码" width="120" align="center">
            <template slot-scope="scope">{{ scope.row.sizeName }}</template>
          </el-table-column>
          <el-table-column label="颜色" width="120" align="center">
            <template slot-scope="scope">{{ scope.row.colorName }}</template>
          </el-table-column>

          <el-table-column label="销售价格" width="140" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'goto.' + scope.$index + '.comPrice'">
                <el-input v-model="scope.row.comPrice" placeholder="销售价格" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="商品库存" width="140" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'goto.' + scope.$index + '.repertoryNumber'">
                <el-input v-model="scope.row.repertoryNumber" placeholder="商品库存" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="库存预警值" width="140" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'goto.' + scope.$index + '.comWarning'">
                <el-input v-model="scope.row.comWarning" placeholder="库存预警值" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="updateGoto(scope.row,scope.$index)">修改</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-dialog>
    </el-form>

  <!-- <div class="block"> -->
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
  data() {
    return {
      isshow: false,
      // currentPage: 1,
      centerDialogVisible: false,
      dialogVisible1: false,
      comLabel: '上架',
      allnumber: '',
      putnumber: '',
      outnumber: '',
      checknumber: '',
      notpassnumber: '',
      commodityInfo: [],
      AuditInfo: [],
      formInfo: {
        goto: []
      },
      selectcom: {}
    }
  },
  mounted() {
    this.selectcommodity()
    this.selectAllNum()
    this.selectPutNum()
    this.selectOutNum()
    this.selectCheckNum()
    this.selectNotPassNum()
  },

  methods: {
    open() {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },

    /* 查询所有商品数量*/
    selectAllNum() {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectAllNum.do')
        .then(res => {
          that.allnumber = res.data
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    /* 查询已上架商品数量*/
    selectPutNum() {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectPutNum.do')
        .then(res => {
          that.putnumber = res.data
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    /* 查询未上架商品数量*/
    selectOutNum() {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectOutNum.do')
        .then(res => {
          that.outnumber = res.data
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    /* 查询待审核商品数量*/
    selectCheckNum() {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectCheckNum.do')
        .then(res => {
          that.checknumber = res.data
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    /* 查询未通过商品数量*/
    selectNotPassNum() {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectNotPassNum.do')
        .then(res => {
          that.notpassnumber = res.data
        })
        .catch(err => {
          console.log(err.data)
        })
    },

    /* 查询商品的所有信息*/
    selectcommodity() {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/selectCommodityInfo.do')
        .then(res => {
          that.commodityInfo = res.data
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    /* 改变Swich开关值*/
    changeSwich(off) {
      const that = this
      this.$axios.get('http://localhost:8080/commodity/updateLable.do', {
        params: off
      })
        .then(res => {
          console.log('修改成功')
          that.selectcommodity()
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 删除商品信息 */
    deleteCom(cids) {
      // const that = this;
      this.$axios.get('http://localhost:8080/commodity/deleteCom.do', {
        params: {
          cid: cids.comId
        }
      })
        .then(res => {
          console.log('删除成功')
        })
        .catch(err => {
          console.log(err)
        })
    },

    //  分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },

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
          that.commodityInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 查询审核信息
    selectAudit(ids) {
      const that = this
      this.centerDialogVisible = !this.centerDialogVisible

      this.$axios.get('http://localhost:8080/commodity/selectAuditById.do', {
        params: {
          comId: ids.comId
        }
      })
        .then(res => {
          that.AuditInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 查询sku库存时弹框 */
    gotoInfo(rowsInfo) {
      const that = this
      that.isshow = !that.isshow

      this.$axios.get('http://localhost:8080/Repertory/selectGoTo.do', {
        params: {
          comId: rowsInfo.comId
        }
      })
        .then(res => {
          that.formInfo.goto = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 修改商品的sku信息 */
    updateGoto(e, index) {
      // console.log("2121321321321321321544516546")
      console.log(e)
      const that = this
      that.isshow = !that.isshow
      this.$axios.get('http://localhost:8080/Repertory/updatGoTo.do', {
        params: {
          comPrice: e.comPrice,
          repertoryNumber: e.repertoryNumber,
          comWarning: e.comWarning,
          comSku: e.comSku
        }
      })
        .then(res => {
          console.log('修改成功')
        })
        .catch(err => {
          console.log(err)
        })
    }

  }

}

</script>

