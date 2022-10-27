<template>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>更换头像</span>
      </div>
      <div>
        <!-- 图片，用来展示用户选择的头像 -->
        <img class="the_img" src="../../assets/images/avatar.jpg" alt="" />

        <!-- 按钮区域 -->
        <div class="btn-box">
          <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
          <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
          <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''">上传头像</el-button>
        </div>
      </div>
    </el-card>
  </template>
<script>
// import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    chooseImg () {
      // 点击事件-->选择图片
      this.$refs.iptRef.click()
    },
    onFileChange (e) {
      // 获取用户选择的文件列表（伪数组）
      const files = e.target.files
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = ''
      } else {
        // 选择了图片
        console.log(files[0])
      }
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
