<template>
  <div>
    <el-form ref="addformTable" :rules="CommodityList.yanzheng" :model="CommodityList">
      <el-table
        ref="addSeckillCommodityTable"
        :data="CommodityList.CommodityListData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >

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

        <el-table-column label="秒杀价格" align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="'CommodityListData.' + scope.$index + '.seckillMoney'"
              :rules="CommodityList.yanzheng.seckillMoney"
            >
              <el-input v-model="scope.row.seckillMoney" class="light-blue-theme" placeholder="秒杀价格" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="秒杀数量" align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="'CommodityListData.' + scope.$index + '.seckillNumber'"
              :rules="CommodityList.yanzheng.seckillNumber"
            >
              <el-input v-model="scope.row.seckillNumber" class="light-blue-theme" placeholder="秒杀数量" @keyup="seckillNumberjt(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="剩余数量" align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="'CommodityListData.' + scope.$index + '.seckillNumber'"
              :rules="CommodityList.yanzheng.seckillNumber"
            >
              <el-input v-model="scope.row.seckillNumber" class="light-blue-theme" placeholder="秒杀数量" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="限购数量" align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="'CommodityListData.' + scope.$index + '.limitNumber'"
              :rules="CommodityList.yanzheng.limitNumber"
            >
              <el-input v-model="scope.row.limitNumber" class="light-blue-theme" placeholder="限购数量" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column v-if="'isShow'+scope.$index + '.sort'" label="排序" align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="'CommodityListData.' + scope.$index + '.sort'"
              :rules="CommodityList.yanzheng.sort"
            >
              <el-input v-model="scope.row.sort" class="light-blue-theme" placeholder="排序" />
            </el-form-item>
          </template>
        </el-table-column>

      </el-table>
      <el-form-item>
        <el-button type="primary" @click="addformTables('addformTable')">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import qs from 'qs'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'AddSeckillCommodity',
  props: ['commodityId', 'seckillid'],
  data() {
    return {
      CommodityList: {
        yanzheng: {
          seckillMoney: [
            { required: true, message: '请输入秒杀价格', trigger: 'blur' }
          ],
          seckillNumber: [
            { required: true, message: '请输入秒杀数量', trigger: 'blur' }
          ],
          limitNumber: [
            { required: true, message: '请输入限购数量', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请输入排序', trigger: 'blur' }
          ]
        },
        multipleSelection: [],
        CommodityListData: []
      }

    }
  },
  mounted() {
    // 页面一加载完毕调用这个方法进行渲染商品
    this.queryInCommodityId()
  },

  methods: {
    // 查询所有的商品 添加到活动秒杀商品中
    queryInCommodityId() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/seckillcommodity/queryInCommodityId', {
        params: {
          commodityId: currThis.commodityId
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => currThis.CommodityList.CommodityListData = res.data)
        .catch(error => console.log(error))
    },

    // 当复选框发生改变把id传入multipleSelection 数组中
    handleSelectionChange(val) {
      this.CommodityList.multipleSelection = val
    },

    addformTables(addformTable) {
      this.$refs[addformTable].validate((valid) => {
        if (valid) {
          const currThis = this
          currThis.$axios.post('http://localhost:8080/seckillcommodity/addSeckillCommodity?&seckillId=' + currThis.seckillid,
            currThis.CommodityList.CommodityListData,
            // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
            {
              headers: { 'AUTHORIZATION': getToken() }
            }
          )
            .then(res => currThis.$emit('addSuccessClick', res.data))
            .catch(error => console.log(error))
        } else {
          return false
        }
      })
    }
  }
}
</script>
