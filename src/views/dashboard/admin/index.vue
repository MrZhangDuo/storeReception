<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { getToken } from '@/utils/auth'
// 折线图数据
const lineChartData = {
  vipCount: {
    lastWeek: [],
    thisWeek: []
  },
  commoditiCount: {
    lastWeek: [],
    thisWeek: []
  },
  moneyCount: {
    lastWeek: [],
    thisWeek: []
  },
  shoppingsCount: {
    lastWeek: [],
    thisWeek: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.vipCount
    }
  },
  mounted() {
    this.customerCountBZ()
    this.customerCountSZ()
    this.ordersMoneyCountBZ()
    this.ordersMoneyCountSZ()
    this.ordersCountBZ()
    this.ordersCountSZ()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    customerCountBZ() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/customer/customerCountBZ', {
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => lineChartData.vipCount.thisWeek = res.data)
        .catch(err => console.log(err))
    },
    customerCountSZ() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/customer/customerCountSZ', {
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => lineChartData.vipCount.lastWeek = res.data)
        .catch(err => console.log(err))
    },
    ordersMoneyCountBZ() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/orders/ordersMoneyCountBZ', {
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => lineChartData.moneyCount.thisWeek = res.data)
        .catch(err => console.log(err))
    },
    ordersMoneyCountSZ() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/orders/ordersMoneyCountSZ', {
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => lineChartData.moneyCount.lastWeek = res.data)
        .catch(err => console.log(err))
    },
    ordersCountBZ() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/orders/ordersCountBZ', {
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => lineChartData.shoppingsCount.thisWeek = res.data)
        .catch(err => console.log(err))
    },
    ordersCountSZ() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/orders/ordersCountSZ', {
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => lineChartData.shoppingsCount.lastWeek = res.data)
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
