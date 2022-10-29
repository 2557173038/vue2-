<template>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>更换头像</span>
      </div>
      <div>
        <!-- 图片，用来展示用户选择的头像 -->
        <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
        <img v-else :src="this.avatar">

        <!-- 按钮区域 -->
        <div class="btn-box">
          <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
          <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
          <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''"  @click="toAvatar">上传头像</el-button>
        </div>
      </div>
    </el-card>
  </template>
<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: '' // 保存图片链接/base64字符串
    }
  },
  methods: {
    // 点击事件-->选择图片
    // 目的：为了让input【type=file】标签，让他再用js代码来触发他的点击事件(导致末默认行为给一个文件选择窗口)
    // 原因：input[type=file]他是原生标签，样式不好改
    // 解决：移花接木
    chooseImg () {
      this.$refs.iptRef.click()
    },
    // 选择图片确定了
    onFileChange (e) { // e原生的事件对象
      // 获取用户选择的文件列表(伪数组)
      const files = e.target.files // 拿到用户选择的文件数组
      if (files.lenght === 0) {
        // 没有选择图片
        this.avatar = ''
      } else {
        console.log(files[0])
        // 文件->内存临时地址，(这个地址只能在js内存里用不能发给后台)
        // 语法：URL.createObjectURL(文件)
        // 返回值:内存临时地址
        // this.avatar = URL.createObjectURL(files[0])

        // 2:文件->base64字符串(此字符串地址可以发给后台的)
        const fr = new FileReader() // 拿到用户选择的文件
        fr.readAsDataURL(files[0])// 传入文件对象开始读
        fr.onload = (e) => { // onload等待把文件读成base64字符串后会触发onload事件函数
          // e.target.result的值就是读完的结果
          this.avatar = e.target.result
          // updateUserAvatarAPI(this.avatar)
        }
      }
    },
    async toAvatar () {
    // 开始上传头像
      const res = await updateUserAvatarAPI(this.avatar)
      console.log(res)
      if (res.data.code !== 0) {
        return this.$message.error(res.data.message)
      }
      this.$message.success(res.data.message)
      // 重新让vuex获取下最新的用户数据
      this.$store.dispatch('getUserInfoActions')
    }
  }

}
</script>

  <style lang="less" scoped>
  .btn-box {
    margin-top: 10px;
  }
  .preview {
    object-fit: cover;
  }
  .the_img{
      width: 350px;
      height: 350px;
  }
  </style>
