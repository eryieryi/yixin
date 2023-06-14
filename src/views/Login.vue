<template>
    <div class="login">
        <s-header :name="state.type == 'login' ? '登录' : '注册'" :back="'/home'" />
        <img class="logo" src="https://s.yezgea02.com/1604045825972/newbee-mall-vue3-app-logo.png" alt="">
        <div v-if="state.type == 'login'" class="login-body">
            <van-form @submit="onSubmit">
                <van-field v-model="state.username" name="username" label="用户名" placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]" />
                <van-field v-model="state.password" type="password" name="password" label="密码" placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]" />
                <van-field v-model="state.verify" center clearable label="验证码" placeholder="输入验证码">
                    <template #button>
                        <vue-img-verify ref="verifyRef"></vue-img-verify>
                    </template>
                </van-field>
                <div style="margin: 16px;">
                    <div class="link-register" @click="changeType('register')">立即注册</div>
                    <van-button round block type="danger" native-type="submit">
                        登录
                    </van-button>
                </div>
            </van-form>
        </div>
        <div v-else class="register-body">
            <van-form @submit="onSubmit">
                <van-field v-model="state.username1" name="username1" label="用户名" placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]" />
                <van-field v-model="state.password1" type="password" name="password1" label="密码" placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]" />
                <van-field v-model="state.verify" center clearable label="验证码" placeholder="输入验证码">
                    <template #button>s
                        <vue-img-verify ref="verifyRef"></vue-img-verify>
                    </template>
                </van-field>
                <div style="margin: 16px;">
                    <div class="link-login" @click="changeType('login')">已有帐号？立即登录</div>
                    <van-button round block type="danger" native-type="submit">
                        注册
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import vueImgVerify from '@/components/VueImageVerify.vue'
import { showFailToast, showSuccessToast } from 'vant'
import { reactive, ref } from 'vue'
import { login, register } from '@/service/user.js'
import md5 from 'js-md5'
import { setLocal } from '@/common/js/utils'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const verifyRef = ref(null)
const state = reactive({
    // 登录还是注册
    type: 'login',
    username: '',
    password: '',
    username1: '',
    password1: '',
    // 输入的验证码
    verify: '',
    // 生成的验证码
    imgCode: ''
})
// 切换登录和注册
const changeType = (value) => {
    state.type = value
    state.verify = ''
}
const onSubmit = async (values) => {
    // 通过调用verifyRef.value.state.imgCode来访问vue-img-verify组件的imgCode
    state.imgCode = verifyRef.value.state.imgCode || ''
    // 判断输入的验证码是否和生成的验证码一致
    if (state.imgCode.toLowerCase() != state.verify.toLowerCase()) {
        showFailToast('验证码错误')
        return
    }
    // 登录状态
    if (state.type == 'login') {
        // 把用户名密码作为参数传递，返回token
        const { data } = await login({
            "loginName": values.username,
            "passwordMd5": md5(values.password)
        })
        // 存到本地
        setLocal('token', data)
        // 需要刷新页面，否则 axios.js 文件里的 token 不会被重置
        window.location.href = '/'
    } else {// 注册状态
        await register({
            "loginName": values.username1,
            "password": values.password1
        })
        showSuccessToast('注册成功！')
        state.type = 'login'
        // 清除验证码
        state.verify = ''
    }
}
</script>

<style lang="less" scoped>
.login {
    .logo {
        width: 120px;
        height: 120px;
        display: block;
        margin: 80px auto 20px;
    }

    .login-body {
        padding: 0 20px;

        .link-register {
            font-size: 14px;
            margin-bottom: 20px;
            color: #1989fa;
            display: inline-block;
        }
    }

    .register-body {
        padding: 0 20px;

        .link-login {
            font-size: 14px;
            margin-bottom: 20px;
            color: #1989fa;
            display: inline-block;
        }
    }
}
</style>