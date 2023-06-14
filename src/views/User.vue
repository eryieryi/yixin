<template>
    <div class="user-box">
        <s-header :name="'我的'"></s-header>
        <van-skeleton title avatar :row="3" :loading="state.loading">
            <div class="user-info">
                <div class="info">
                    <img src="https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg" alt="">
                    <div class="user-desc">
                        <span>昵称：{{ state.user.nickName }}</span>
                        <span>登录名：{{ state.user.loginName }}</span>
                        <span>个性签名：{{ state.user.introduceSign }}</span>
                    </div>
                </div>
            </div>
        </van-skeleton>
        <ul class="user-list">
            <li class="van-hairline--bottom" @click="goTo('/order', { from: 'mine' })">
                <span>我的订单</span>
                <van-icon name="arrow" />
            </li>
            <li class="van-hairline--bottom" @click="goTo('/setting')">
                <span>账号管理</span>
                <van-icon name="arrow" />
            </li>
            <li class="van-hairline--bottom" @click="goTo('/address', { from: 'mine' })">
                <span>地址管理</span>
                <van-icon name="arrow" />
            </li>
            <li @click="goTo('/about')">
                <span>关于我们</span>
                <van-icon name="arrow" />
            </li>
        </ul>
        <nav-bar></nav-bar>
    </div>
</template>
<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import navBar from '@/components/NavBar.vue'
import { getUserInfo } from '@/service/user.js'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { closeToast, showLoadingToast, showToast } from 'vant'
const router = useRouter()
const state = reactive({
    user: {},
    loading: true
})
onMounted(async () => {
    showLoadingToast('加载中...')
    const { data } = await getUserInfo()
    // console.log(data)
    state.user = data
    state.loading = false
    closeToast()
})
const goTo = (to, from) => {
    router.push({ path: to, query: from || '' })
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';

.user-box {
    .user-info {
        width: 94%;
        margin: 10px;
        height: 115px;
        background: linear-gradient(90deg, @primary, #ee0707);
        border-radius: 6px;
        box-shadow: 0 2px 5px #e82737;

        .info {
            .fj();
            .wh(100%, 100%);
            padding: 25px 20px;
            .boxSizing();
            justify-content: start;

            img {
                .wh(60px, 60px);
                border-radius: 50%;
            }

            .user-desc {
                .fj();
                flex-direction: column;
                color: #fff;
                font-size: 14px;
                margin-left: 10px;
                line-height: 20px;

                span {
                    color: #fff;
                    font-size: 14px;
                    padding: 2px 0;
                }
            }
        }
    }

    .user-list {
        padding: 0 20px;
        margin-top: 20px;

        li {
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;

            .van-icon-arrow {
                margin-top: 13px;
            }
        }
    }
}
</style>