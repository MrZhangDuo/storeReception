<template>
  <div>
    <el-container>
      <el-aside width="400px">
        <div>
          <el-avatar size="large" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        </div>
        <div>
          <span style="font-family: '微软雅黑',font-weight:400;color:'#999999'">评论人：</span>
          <span style="font-family: '微软雅黑',font-weight:400;color:'#999999'">{{ EvaInfoById.evaUesrname }}</span>
        </div>
        <div>
          <span style="font-family: '微软雅黑',font-weight:400;color:'#999999'">商品：</span>
          <span style="font-family: '微软雅黑',font-weight:400;color:'#999999'">{{ EvaInfoById.evaComname }}</span>
        </div>
        <div>
          <span style="font-family: '微软雅黑',font-weight:400;color:'#999999'">日期：</span>
          <span style="font-family: '微软雅黑',font-weight:400;color:'#999999'" value-format="yyyy-MM-dd hh:mm:ss">{{ EvaInfoById.evaTime }}</span>
        </div>
      </el-aside>
      <el-main>
        <el-button type="primary" plain @click="fanhui()"><i class="el-icon-arrow-left">返回</i></el-button>
        <!-- <router-link :to="{name:'CommodityE'}"></router-link> -->
        <i class="el-icon-star-on" style="color:#CCCC33">收藏</i>
        <i class="el-icon-view" style="color:#99FFCC">阅读</i>
        <el-divider />
        <div style="color:#CC99CC">{{ EvaInfoById.evaEvaluate }}</div>
        <br><br> <br>

        <i class="el-icon-s-custom" style="font-family: '微软雅黑',font-weight:400;color:'#FFFFF'">回复评价</i>
        <el-divider />
        <el-form :model="formInfo" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="formInfo.sonPerson" />
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="formInfo.sonEmail" />
          </el-form-item>
          <el-form-item label="回复内容">
            <el-input v-model="formInfo.sonContent" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="pinglun()">确认评论</el-button>
          </el-form-item>
        </el-form>
        <br><br>

        <i class="el-icon-user">全部评论 </i>

        <el-divider />
        <template>
          <div v-for="(item,index) in EvaSonById" :key="index">
            <el-avatar size="large" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div style="color:#00CC99">{{ item.sonPerson }}</div>  <br>
            <div style="color:#66FFCC"> 回复{{ item.evaUesrname }}：</div>{{ item.sonContent }} <br>
            <div style="color:#CCFF99">{{ item.sonTime }}</div>
            <el-divider><i class="el-icon-coffee" /></el-divider>
          </div>
        </template>
      </el-main>
    </el-container>

  </div>
</template>

<script>
export default {
  name: 'CommentArea',

  data() {
    return {
      EvaInfoById: {},
      EvaSonById: [],
      formInfo: {}
    }
  },
  mounted() {
    this.SelectEvaInfo()
    this.SelectSonInfo()
  },
  methods: {

    /* 查询父评论的信息 */
    SelectEvaInfo(evaId) {
      const that = this
      this.$axios.get('http://localhost:8080/Evaluate/SelectById.do', {
        params: {
          evaId: that.$route.params.evaId
        }
      })
        .then(res => {
          that.EvaInfoById = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 查询所有子评论的信息 */
    SelectSonInfo(evaId) {
      const that = this
      this.$axios.get('http://localhost:8080/Evaluate/selectSonInfo.do', {
        params: {
          evaId: that.$route.params.evaId
        }
      })
        .then(res => {
          this.EvaSonById = res.data
          // for(let i=0;i<that.EvaSonById.length;i++){
          //     this.EvaSonById=this.EvaSonById[i].EvaSonById
          // }
          console.log(this.EvaSonById)
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 添加管理员的评论信息 */
    pinglun() {
      const that = this
      this.$axios.get('http://localhost:8080/Evaluate/addMassageInfo.do', {
        params: {
          sonPerson: that.formInfo.sonPerson,
          sonEmail: that.formInfo.sonEmail,
          sonContent: that.formInfo.sonContent,
          evaId: that.$route.params.evaId
        }
      })
        .then(res => {
          console.log(that.$route.params.evaId)
        })
        .catch(err => {
          console.log(err)
        })
    },

    fanhui() {
      this.$router.push({ name: 'commodityEvaluate' }) // 跳转页面
    }

  }

}

</script>
