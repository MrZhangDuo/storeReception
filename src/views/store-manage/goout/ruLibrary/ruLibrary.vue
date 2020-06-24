<template>
  <div>
    <el-form :inline="true" :model="selectgoout" class="demo-form-inline">
      <el-form-item label="商品名称">
        <el-input v-model="selectgoout.comName" placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="商品货号">
        <el-input v-model="selectgoout.comNo" placeholder="请选择商品货号" />
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker v-model="selectgoout.gooutTime" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="likeSelectGoOut()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="GoOutInfo"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="编号"
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
      >
        <template slot-scope="scope">
          {{ scope.row.comName }}
          <br>
          {{ scope.row.comBrand }}
        </template>
      </el-table-column>
      <el-table-column
        prop="comNo"
        label="商品货号/属性"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.comNo }}
          <br>
          {{ scope.row.colorName }}/{{ scope.row.sizeName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="商品订单号"
        width="200"
      />
      <el-table-column
        prop="repertoryNumber"
        label="库存"
        width="120"
      >
        <template slot-scope="scope">
          入库：+{{ scope.row.gooutNumber }}
          <br>
          剩余:{{ scope.row.repertoryNumber }}
        </template>
      </el-table-column>
      <el-table-column
        prop="handleType"
        label="操作类型"
        width="120"
      />
      <el-table-column
        prop="gooutPerson"
        label="操作信息"
        width="190"
      >
        <template slot-scope="scope">
          {{ scope.row.gooutPerson }}
          <br>
          {{ scope.row.gooutTime }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: 'RuLibrary',
  data() {
    return {
      GoOutInfo: [],
      selectgoout: {}

    }
  },
  mounted() {
    this.selectcommodity()
  },

  methods: {

    /* 查询入库商品的所有信息*/
    selectcommodity() {
      const that = this
      this.$axios.get('http://localhost:8080/Repertory/selectGo.do')
        .then(res => {
          that.GoOutInfo = res.data
        })
        .catch(err => {
          console.log(err.data)
        })
    },

    /* 入库商品模糊查询 */
    likeSelectGoOut() {
      const that = this
      let goTime = ''
      if (that.selectgoout.gooutTime != null) {
        goTime = that.$moment(that.selectgoout.gooutTime).format('YYYY-MM-DD')
      }
      console.log(goTime)
      this.$axios.get('http://localhost:8080/Repertory/selectLikeGo.do', {
        params: {
          comName: that.selectgoout.comName,
          comNo: that.selectgoout.comNo,
          gooutTime: goTime
        }
      })
        .then(res => {
          that.GoOutInfo = res.data
          console.log('efresf')
        })
        .catch(err => {
          console.log(err.data)
        })
    }
  }
}
</script>

<style>

</style>
