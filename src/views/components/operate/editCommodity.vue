<template>
  <div>
    <el-form ref="seckill" :model="seckill" :rules="yanzheng" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动标题" prop="seckillTitle">
        <el-input v-model="seckill.seckillTitle" placeholder="活动标题" />
      </el-form-item>

      <el-form-item label="开始时间" prop="startTime">
        <el-col :span="11">
          <el-date-picker
            v-model="seckill.startTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="结束时间" prop="endTime">
        <el-col :span="11">
          <el-date-picker
            v-model="seckill.endTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-col>
      </el-form-item>

      <el-form-item size="large">
        <el-button type="primary" @click="editCommodity('seckill')">确定修改</el-button>
        <el-button @click="resetForm('seckill')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'EditCommodity',
  props: ['seckillid'],
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      seckill: {},
      yanzheng: {
        seckillTitle: [
          { required: true, message: '请输入活动标题', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.querySckillById()
  },

  methods: {
    querySckillById() {
      const currThis = this
      currThis.$axios.get('http://localhost:8080/seckill/querySeckillById', {
        params: {
          seckillId: currThis.seckillid
        },
        // 往后台发送请求所带的 token 告诉shiro 当前用户已认证
        headers: { 'AUTHORIZATION': getToken() }
      })
        .then(res => { currThis.seckill = res.data })
        .catch(error => console.log(error))
    },

    editCommodity(seckill) {
      this.$refs[seckill].validate((valid) => {
        const currThis = this
        if (valid) {
          let startTimes = ''
          let endTimes = ''
          if (currThis.seckill.startTime != null && currThis.seckill.endTime != null) {
            startTimes = currThis.$moment(currThis.seckill.startTime).format('YYYY-MM-DDTHH:mm:ss')
            endTimes = currThis.$moment(currThis.seckill.endTime).format('YYYY-MM-DDTHH:mm:ss')
          }
          currThis.$axios.get('http://localhost:8080/seckill/updateSeckillById', {
            params: {
              seckillId: currThis.seckill.seckillId,
              seckillTitle: currThis.seckill.seckillTitle,
              seckillStatus: currThis.seckill.seckillStatus,
              startTimes: startTimes,
              endTimes: endTimes
            },
            headers: { 'AUTHORIZATION': getToken() }
          })
            .then(res => currThis.$emit('updateSuccessClick', res.data))
            .catch(error => console.log(error))
        } else {
          return false
        }
      })
    },

    // 重置表单内容
    resetForm(user) {
      this.$refs[user].resetFields()
    }
  }
}
</script>
