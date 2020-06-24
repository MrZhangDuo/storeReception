<template>
  <div>
    <el-radio-group v-model="labelPosition" size="small">
      <el-radio-button label="left">左对齐</el-radio-button>
      <el-radio-button label="right">右对齐</el-radio-button>
      <el-radio-button label="top">顶部对齐</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px;" />

    <el-form :label-position="labelPosition" width="80px" :model="commoditys">
      <div class="orientation">
        <el-form-item label="商品名称">
          <el-input v-model="commoditys.commodity.comName" class="inputs" />
        </el-form-item>
        <el-form-item label="商品品牌">
          <el-input v-model="commoditys.commodity.comBrand" class="inputs" />
        </el-form-item>

        <div style="color:red"> 尺码：</div>
        <el-checkbox-group v-model="sizesCheckedList" class="group1">
          <el-checkbox v-for="item in sizesAcceptCheck" :key="item.sizeId" :label="item.sizeName">{{ item.sizeName }}</el-checkbox>
        </el-checkbox-group>

        <el-form-item class="SAndC">
          <el-input v-model="sizeName" class="check1" />
          <el-button type="success" plain @click="addSize">添加尺寸</el-button>
        </el-form-item>

        <div style="color:red"> 颜色：</div>
        <el-checkbox-group v-model="ColorsCheckedList" class="group1">
          <el-checkbox v-for="item in ColorsAcceptCheck" :key="item.colorId" :label="item.colorName">{{ item.colorName }}</el-checkbox>
        </el-checkbox-group>

        <el-form-item class="SAndC">
          <el-input v-model="colorName" class="check1" />
          <el-button type="success" plain @click="addColor">添加颜色</el-button>
        </el-form-item>
        <el-button type="success" plain class="queren" @click="sizeAndColor()">确认尺码及颜色</el-button>
      </div>

      <el-table v-show="isshow" :data="commoditys.sizeAndColors" border style="width: 100%">

        <el-table-column label="尺码" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.sizeName }}</template>
        </el-table-column>
        <el-table-column label="颜色" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.colorName }}</template>
        </el-table-column>

        <el-table-column label="销售价格" width="200" align="center">
          <template slot-scope="scope">
            <el-form-item :prop="'sizeAndColors.' + scope.$index + '.comPrice'">
              <el-input v-model="scope.row.comPrice" placeholder="销售价格" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="商品库存" width="170" align="center">
          <template slot-scope="scope">
            <el-form-item :prop="'sizeAndColors.' + scope.$index + '.repertoryNumber'">
              <el-input v-model="scope.row.repertoryNumber" placeholder="商品库存" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="库存预警值" width="170" align="center">
          <template slot-scope="scope">
            <el-form-item :prop="'sizeAndColors.' + scope.$index + '.comWarning'">
              <el-input v-model="scope.row.comWarning" placeholder="库存预警值" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="success" plain @click="deleteCommodity(scope.row)">删除</el-button>
          </template>
        </el-table-column>

        <el-table-column fixed label="图片" width="180">
          <template slot-scope="scope">
            <el-form-item :prop="'sizeAndColors.' + scope.$index + '.comImg'">
              <el-upload
                ref="upload"
                action="http://localhost:8080/commodity/uploadImage.do"
                name="picture"
                list-type="picture-card"
                :limit="2"
                :file-list="fileList"
                :on-exceed="onExceed"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </template>

        </el-table-column>
      </el-table>

      <el-form-item>
        <div align="center">
          <el-button type="primary" plain>取消</el-button>
          <el-button type="success" plain @click="addCommodity">添加</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Addcommodity',

  data() {
    return {
      sizeName: '',
      colorName: '',
      labelPosition: 'right',
      isshow: false,
      dataInfo: [],
      commoditys: {
        commodity: {},
        sizeAndColors: []
      },
      sizesCheckedList: [],
      sizesAcceptCheck: [],
      ColorsCheckedList: [],
      ColorsAcceptCheck: [],
      // 文件上传的参数
      dialogImageUrl: '',
      dialogVisible: false,
      // 图片列表（用于在上传组件中回显图片）
      fileList: [{ name: '', url: '' }]
    }
  },

  mounted() {
    this.selectColors()
    this.selectSizes()
  },

  methods: {

    /* 交叉匹配选中的颜色和尺寸 */
    sizeAndColor() {
      const that = this
      that.isshow = !that.isshow
      that.commoditys.sizeAndColors.length = 0 /* 要将集合设置为0，否则循环时会叠加数据 */

      for (let i = 0; i < that.sizesCheckedList.length; i++) { /* 先循环选中的尺寸 */
        for (let j = 0; j < that.ColorsCheckedList.length; j++) { /* 循环颜色 */
          that.commoditys.sizeAndColors.push({ /* 将循环的数据放入集合中 */
            sizeName: that.sizesCheckedList[i],
            colorName: that.ColorsCheckedList[j]
          })
        }
      }
    },

    // 文件上传成功的钩子函数
    handleSuccess(res, file) {
      this.$message({
        type: 'info',
        message: '图片上传成功',
        duration: 6000
      })
      if (file.response.success) {
        this.editor.picture = file.response.message // 将返回的文件储存路径赋值picture字段
      }
    },
    // 删除文件之前的钩子函数
    handleRemove(file, fileList) {
      this.$message({
        type: 'info',
        message: '已删除原有图片',
        duration: 6000
      })
    },
    // 点击列表中已上传的文件事的钩子函数
    handlePreview(file) {
    },
    // 上传的文件个数超出设定时触发的函数
    onExceed(files, fileList) {
      this.$message({
        type: 'info',
        message: '最多只能上传一个图片',
        duration: 6000
      })
    },
    // 文件上传前的前的钩子函数
    // 参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    },

    /* 查询所有颜色 */
    selectColors() {
      const that = this
      this.$axios.get('http://localhost:8080/SizeAndColor/selectAllColor.do')
        .then(res => {
          that.ColorsAcceptCheck = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 查询所有尺寸 */
    selectSizes() {
      const that = this
      this.$axios.get('http://localhost:8080/SizeAndColor/selectAllSize.do')
        .then(res => {
          that.sizesAcceptCheck = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 添加库存信息 */
    addCommodity() {
      const that = this
      that.$axios.post('http://localhost:8080/commodity/addCommodity.do',
        that.commoditys
      )
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },

    /* 删除未添加的一行信息 */
    deleteCommodity(infos) {
      const that = this
      that.commoditys.sizeAndColors.splice(infos.comSKU, 1)
    },

    /* 添加 尺寸*/
    addSize() {
      const that = this
      that.$axios.post('http://localhost:8080/SizeAndColor/addSize.do',
        {
          sizeName: that.sizeName
        }
      )
        .then(res => {
          console.log(res.data)
          that.sizeName = ''
          this.selectSizes()
        })
        .catch(err => {
          console.log(err)
        })
    },
    /* 添加颜色*/
    addColor() {
      const that = this
      that.$axios.post('http://localhost:8080/SizeAndColor/addColor.do',
        {
          colorName: that.colorName
        }
      )
        .then(res => {
          console.log(res.data)
          that.colorName = ''
          this.selectColors()
        })
        .catch(err => {
          console.log(err)
        })
    }

  }

}

</script>

<style>
   .inputs{
     width: 370px;
   }
   .check1{
      width:70px;
   }

   .orientation{
     margin-left: 410px;
   }

   .queren{
    margin-left: 180px;
   }
   .group1{
     margin-left: 75px;
   }
   .SAndC{
     margin-left: 500px;
     line-height: 5000px;
   }
</style>
