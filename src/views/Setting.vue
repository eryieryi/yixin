<template>
  <div class="setting-box">
    <s-header :name="'账号管理'"></s-header>
    <div class="input-item">
      <van-field v-model="state.nickName" label="昵称" />
      <van-field v-model="state.introduceSign" label="个性签名" />
      <van-field v-model="state.password" label="修改密码" />
    </div>
    <van-button round class="btn" type="danger" block @click="save">保存</van-button>
    <van-button round class="btn" type="danger" block @click="handleLogout">退出登录</van-button>
  </div>
</template>
<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import { getUserInfo, EditUserInfo, logout } from '@/service/user.js'
import { onMounted, reactive } from 'vue'
import md5 from 'js-md5'
import { showSuccessToast } from 'vant'
import { setLocal } from '@/common/js/utils.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const state = reactive({
  nickName: '',
  introduceSign: '',
  password: ''
})
onMounted(async () => {
  const { data } = await getUserInfo()
  state.nickName = data.nickName
  state.introduceSign = data.introduceSign
})
const save = async () => {
  const params = {
    introduceSign: state.introduceSign,
    nickName: state.nickName
  }
  if (state.password) {
    params.passwordMd5 = md5(state.password)
  }
  await EditUserInfo(params)
  showSuccessToast('保存成功')
  setTimeout(() => {
    router.go(-1)
  }, 500);
}
const handleLogout = async () => {
  const { resultCode } = await logout()
  if (resultCode == 200) {
    setLocal('token', '')
    // router.push({ path: '/home' })
    // router.go(0)
    window.location.href = '/home'
  }
}
</script>
<style lang="less" scoped>
.setting-box {
  .btn {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>