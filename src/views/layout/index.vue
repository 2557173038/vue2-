<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../assets/images/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item
          >
          <el-menu-item index="1-3"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- 左侧边栏的用户信息 -->
      <!-- 侧边栏的用户信息区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/logo.png" alt="" v-else />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 侧边栏的导航菜单 -->
        <!-- 属性没有显示传值，默认值为true -->
        <!-- routrt:设置上（默认值为true）就会当你点击某菜单的时候，以index值作为路由切换 -->
        <el-menu
        :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
        <template v-for="item in menus">
          <!-- 首页 -->
          <el-menu-item v-if="!item.children" :index='item.indexPath' :key="item.indexPath">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </el-menu-item>
          <!-- 文章管理 -->
          <el-submenu v-else :index="item.indexPath" :key="item.indexPath">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item :index="data.indexPath" v-for="data in item.children" :key="data.indexPath">
              <i :class="data.icon"></i>
              <span>{{data.title}}</span>
            </el-menu-item>
          </el-submenu>

        </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <!-- 二级路由挂载点 -->
        <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>艾玛还挺牛</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 经验:在组件上绑定的所有事件（包括原生事件的名字click，input等等）
// 都是自定义事件，都需要组件内$emit来触发才行
// 万一组件内不支持这个原生事件民名字，
// 解决：@事件名.native='methods'里的方法名
// .native给组件内根标签，绑定这个原生的事件

import { mapGetters } from 'vuex'
import { getMenusInfoAPI } from '@/api'
export default {
  name: 'my-layout',
  data () {
    return {
      menus: [] // 保存侧边栏数据
    }
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  },

  methods: {
    // 退出登录->点击事件
    quitFn () {
      // 万一让用户的体验更好 来个确认的提示框
      this.$confirm('这就走了吗？, 不爱我了吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 他选择了确认
          // 清除vuex
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})

          // 强制跳转登录页面
          this.$router.push('/login')
        })
        .catch(() => {
          // 他选择了取消
        })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 请求侧边栏数据
    async getMenuListFn () {
      const res = await getMenusInfoAPI()
      this.menus = res.data.data
      // console.log(res)
    }
  },
  created () {
    // 请求侧边栏数据
    this.getMenuListFn()
  }
}
</script>

  <style lang="less" scoped>

.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

</style>
