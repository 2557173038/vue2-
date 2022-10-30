<template>
  <div>
    <!-- 预览文章分类 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="dialogVisible = true"
          >添加分类</el-button
        >
      </div>
      <!-- 分类数据表格 -->
      <el-table :data="cateList" style="width: 100%" border stripe>
        <!-- type是table-column内置属性，你告诉他用index，意思就第一个单元格用索引值-->
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加文章分类的对话框 -->
    <!-- .sync 给所在标签绑定：props属性名=vue变量 @updata:props属性名=val =>vue变量=val -->
    <!-- 双向数据绑定：(父vue变量要传给自组件，自组件传出的值也要自动绑定到父vue变量) -->
    <!-- v-moudl本质：给所在标签绑定：value=vue变量 @input=val=>vue变量=val -->
    <!-- 运行时如下 -->
    <!-- <标签：:value=Vue变量 @input= val => vue变量 = val <标签>-->
    <!-- vue2里面一个标签v-modul只能用一次 vue3可以用多次 -->
    <el-dialog title="添加文章分类" :visible.sync="dialogVisible" width="30%" @close="dialogCloseFn">
      <!-- 添加的表单 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            v-model="addForm.cate_name"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            v-model="addForm.cate_alias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateArtCateListAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [],
      dialogVisible: false, // 控制文章分类对话框-出现(true)/隐藏(false)

      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取-文章分类列表
    this.getArtCateFn()
  },
  methods: {
    // 获取文章分类列表
    async getArtCateFn () {
      const res = await updateArtCateListAPI()
      console.log(res)
      this.cateList = res.data.data
    },
    // 添加分类按钮点击事件->为了让对话框出现
    addCateRightFn () {
      this.dialogVisible = true
    },

    // 对话框确定按钮->点击事件->让对话框消失/掉用保存文章分类接口
    confirmFn () {
      this.dialogVisible = false
    },
    // 对话框取消按钮->点击事件
    canceFn () {
      this.dialogVisible = false
    },
    // 对话框-关闭时的回调-清空表单
    dialogCloseFn () {
      this.$refs.addRef.resetFields()
    }

  }
}

</script>

  <style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
