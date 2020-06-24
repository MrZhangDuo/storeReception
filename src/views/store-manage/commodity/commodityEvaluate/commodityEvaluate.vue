<template>
  <div>
    <el-form :inline="true" :model="formEva" class="demo-form-inline">
      <el-form-item label="商品名称">
        <el-input v-model="formEva.evaComname" placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="formEva.evaUesrname" placeholder="请选择商品货号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="selectlikes()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="EvaInfo"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="编号"
        width="180"
      />
      <el-table-column
        prop="evaUesrname"
        label="用户昵称"
        width="160"
      />
      <el-table-column
        prop="evaComname"
        label="商品名称"
        width="160"
      />
      <el-table-column
        prop="evaEvaluate"
        label="评价"
        width="180"
      />

      <el-table-column prop="evaValue" label="评分">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.evaStar" :allow-half="true" disabled text-color="#ff9900" />
        </template>
      </el-table-column>
      <el-table-column
        prop="evaTime"
        label="评论时间"
        width="180"
      />

      <el-table-column label="是否显示" width="160">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.evaIstrue"
            active-color="#13ce66"
            inactive-color="#CCCCCC"
            active-value="显示"
            inactive-value="不显示"
            @change="changeSwich(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">    <!-- scope.row:获取当前行的信息 -->
          <el-button type="warning" plain size="mini" @click="LookEva(scope.row.evaId)">查看</el-button>  <!-- 跳转页面进行修改 方法二-->
          <!-- <el-button type="danger" plain size="mini" >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: 'CommodityE',
  data() {
    return {
      EvaInfo: [],
      formEva: {}

    }
  },

  mounted() {
    this.selectEva()
  },

  methods: {
    selectEva() {
      var that = this

      this.$axios.get('http://localhost:8080/Evaluate/selectEvaInfo.do')
        .then(res => {
          that.EvaInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 点击查看跳转页面 */
    LookEva(evaIds) {
      this.$router.push({ name: 'commentArea', params: { evaId: evaIds }}) // 跳转页面
    },

    /* 根据商品名称或用户昵称进行查询 */
    selectlikes() {
      var that = this
      this.$axios.get('http://localhost:8080/Evaluate/selectPingjiaLike.do', {
        params: {
          evaUesrname: that.formEva.evaUesrname,
          evaComname: that.formEva.evaComname
        }
      })
        .then(res => {
          console.log(res.data)
          that.EvaInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }

  }

}
</script>

