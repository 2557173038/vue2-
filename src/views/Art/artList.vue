<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="data in this.cateList"
                :label="data.cate_name"
                :value="data.id"
                :key="data.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"

    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"

      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <!-- 文章分类 -->
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <!-- 因为整个标单要发给后台，去提前看眼vue代码里绑定是值需要什么，发现接口文档要的是分类id -->
            <el-option
              v-for="data in this.cateList"
              :label="data.cate_name"
              :value="data.id"
              :key="data.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 文章内容 -->
        <el-form-item lable="文章内容" prop="content">
          <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
        </el-form-item>
        <!-- 文章封面 -->
        <el-form-item label="文章封面"  prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFileRef"
            @change="changeCoverFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <!-- 文章发布 -->
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="pubArticleFn('草稿')"
            >存为草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// webpack会把图片变为一个base64字符串/在打包后的图片临时地址
// 标签和样式中，引入图片文件，直接写静态路径(把路径放在js的发vue变量再赋予是不行的)
// 原因：webpack在分析标签的时候，如果src的值是一个相对路径，他回去帮我们去找到那个路径文件并一起打包
// 打包的时候，会分析文件的大小。小图片转成base64字符串再赋值给src，如果是大图片拷贝图片换个路径给img(运行时)

// vue变量中路径，赋予给标签，都会当作普通的字符串使用
// 以前：我们写的路径是在vscode看着文件夹写的(以前好使的原因，用live serve/磁盘双击打开。他都能通过你的相对路径，在指定的文件夹下，找到图片文件的真身 )
// 现在：写的模板代码，是要被webpack翻译处理转换的，你vscode里的代码，转换后打包到内存中/dist下，相对路径就会变化，运行时你写的固定路径字符串就找不到那个文件真身了
// 解决：js引入图片，就用import引入，让webpack把他当作模块数据，是装换成打包后的图片路径还是baes64字符串
// 注意：只有路径本地图片需要注意，如果你是一个http://外链的图片地址，就可以直接使用
// 之间标签里写也行，或者用js变量保存后赋予标签，都OK、因为运行时，游览器发现src地址是外链就不找相对路径的文件夹了
import imgObj from '../../assets/images/cover.jpg'
import { updateArtCateListAPI, updateArtListAPI } from '@/api'
export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      pubForm: {
        // 发布文章-表单的数据对象
        title: '', // 文章标题
        cate_id: '', // 文章分类id
        content: '', // 发布内容
        cover_img: '', // 封面图片(保存的是文件)
        state: ''
      },
      pubFormRules: {
        // 发布文章-表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' }
        ],
        // content对应quill-editor富文本编辑器，它不是el提供表单标签
        // 原因：
        // el-input等输入框在blur事件时进行校验
        // 下拉菜单，单选框，复选框，是在change事件进行校验
        // 解决：
        // 自己来给quill-editor绑定change事件(在文档里查到的)
        // 在事件处理函数中用el-from组件对象内，调用某个校验规则再重新执行(validateField)
        content: [
          { required: true, message: '请选择文章内容', trigger: 'change' }
        ],
        cover_img: [
          { required: true, message: '请选择图片', trigger: 'blur' }
        ]
      },
      pubDialogVisible: false, // 控制发布文章对话框出现/隐藏(true/false)
      cateList: [] // 保存文章分类列表
    }
  },
  created () {
    // 请求分类数据
    this.getCateListFn()
  },
  methods: {
    // 发表文章->点击事件-让对话框出现
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 发布文章-对话框-关闭前的回调
    // 注意:只有dialog自带的右上角的x，和按下esc按键，和点击透明蒙层关闭才会走这里
    async handleClose (done) {
      // done的作用：调用才会放行让对话框关闭
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // 捕获确认框promise对象里选择取消时，拒绝状态结果cancel字符串
      console.log(confirmResult)
      // $confirm内部虽然是一个确认提示框，但是它借用了promise语法来管理，点击确定他的状态为兑现成功返回confirm，如果用户点击了取消按钮，此promise对象状态为拒绝状态，返回cancel字符串

      // 知识点回顾:
      // 1.await 只能用在async修饰的函数内
      // async修饰：就是在当前函数名左边加async关键字，如果没有函数名，在形参左边加saync
      // 原因：async修饰的函数就是异步函数，如果此函数被调用，总是返回一个全新的promise对象
      // 而且本次函数调用因为是异步函数，所以外面的同步代码继续执行，而await暂停代码只能暂停saync函数内的，等待await后面异步结果
      // 2.await只能拿到成功的结果并放行往下走，如果失败内部回向游览器控制台抛出错误并不会让await往下走代码
      // 3.await后面的promise的对象拒绝状态(错误)如何捕获呢？
      // 方法1:try{} catch(err){}
      // 方法2：用promise的链式调用，而且在catch里return的非promise拒绝状态的对象值，都会当作成功的结果返回给原地新的promise对象结果

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    async getCateListFn () {
      const { data: res } = await updateArtCateListAPI()
      this.cateList = res.data
    },
    // 选择封面点击事件->让文件选择窗口出现
    selCoverFn () {
      this.$refs.iptFileRef.click() // 用js代码模拟一次点击事件动作
    },
    // 用户选择了封面文件
    changeCoverFn (e) {
      // e.target 拿到触发事件的那个标签(input标签对象本身)
      // e.target.files 拿到选择的文件数组
      const files = e.target.files

      if (files.length === 0) {
        // 用户没有选择图片 把cover_img置空
        this.pubForm.cover_img = null

        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
        // 用户选择了图片，把文件直接保存到表单对象的属性里
        this.pubForm.cover_img = files[0]
        // 把图片文件显示到img标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }

      // 让表单单独校验封面的规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 表单里(点击发布/存为草稿)按钮点击事件——>准备调用后端接口
    pubArticleFn (str) {
      // str值 '已发布'，或者 '草稿' (后端要求的参数值)
      this.pubForm.state = str
      // 兜底校验
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          // 通过
          // console.log(this.pubForm)
          const fd = new FormData() // 准备一个表单数据对象的容器，fromData是H5新出的专门为了装文件内容和其他参数的一个容器
          // fd.append('参数名'，值)
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await updateArtListAPI(fd)
          //
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)

          // 关闭对话框
          this.pubDialogVisible = false
        } else {
          return false // 阻止默认行为
        }
      })
    },
    // 富文本编辑器内容改变触发此事件方法
    contentChangeFn () {
      // 目标： 如何让el-from校验，只校验content这个规则？
      // 调用el-from的校验规则
      this.$refs.pubFormRef.validateField('content')
    },
    // 新增文章-对话框关闭->清空表单
    dialogCloseFn () {
      this.$refs.pubFormRef.resetFields()
      // 我们需要手动给封面标签重新设置一个值，因为他没有受到v-modul影响
      this.$refs.imgRef.setAttribute('src', imgObj)
    }
  }
}
</script>

  <style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>
