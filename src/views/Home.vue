<template>
    <div>
        <!-- 头部 -->
        <header class="home-header wrap" :class="{ 'active': state.headerScroll }">
            <router-link tag="i" to="./category"><i class="nbicon nbmenu2"></i></router-link>
            <div class="header-search">
                <span class="app-name">一心优购</span>
                <i class="iconfont icon-search"></i>
                <router-link tag="span" to="./product-list?from=home" class="search-title">山河无恙，人间皆安</router-link>
            </div>
            <router-link tag="span" class="login" to="/login" v-if="!state.isLogin">登录</router-link>
            <router-link tag="span" class="login" to="/user" v-else>
                <van-icon name="manager-o" />
            </router-link>
        </header>
        <!-- 底部导航栏 -->
        <nav-bar></nav-bar>
        <!-- 轮播图 -->
        <swiper :list="state.swiperList" />
        <!-- 分类列表 -->
        <div class="category-list">
            <div v-for="item in state.categoryList" :key="item.categoryId" @click="tips">
                <img :src="item.imgUrl">
                <span>{{ item.name }}</span>
            </div>
        </div>
        <!-- 新品 -->
        <div class="good">
            <header class="good-header">新品上线</header>
            <van-skeleton title :row="3" :loading="state.loading">
                <div class="good-box">
                    <div class="good-item" v-for="item in state.newGoods" :key="item.goodsId"
                        @click="goToDetail(item.goodsId)">
                        <!-- 使用过滤器修改获取的Url格式 -->
                        <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                        <div class="good-desc">
                            <div class="title">{{ item.goodsName }}</div>
                            <div class="price">￥{{ item.sellingPrice }}</div>
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
        <!-- 热门商品 -->
        <div class="good">
            <header class="good-header">热门商品</header>
            <van-skeleton title :row="3" :loading="state.loading">
                <div class="good-box">
                    <div class="good-item" v-for="item in state.hots" :key="item.goodsId" @click="goToDetail(item.goodsId)">
                        <!-- 使用过滤器修改获取的Url格式 -->
                        <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                        <div class="good-desc">
                            <div class="title">{{ item.goodsName }}</div>
                            <div class="price">¥ {{ item.sellingPrice }}</div>
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
        <!-- 最新推荐 -->
        <div class="good" :style="{ paddingBottom: '100px' }">
            <header class="good-header">最新推荐</header>
            <van-skeleton title :row="3" :loading="state.loading">
                <div class="good-box">
                    <div class="good-item" v-for="item in state.recommends" :key="item.goodsId"
                        @click="goToDetail(item.goodsId)">
                        <!-- 使用过滤器修改获取的Url格式 -->
                        <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                        <div class="good-desc">
                            <div class="title">{{ item.goodsName }}</div>
                            <div class="price">¥ {{ item.sellingPrice }}</div>
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
        <van-back-top right="82.5%" bottom="3%" style="z-index: 99999;opacity: 0;" />
    </div>
</template>
<script setup>
import { showLoadingToast, showToast, closeToast } from 'vant'
import { onMounted, reactive, nextTick } from 'vue'
import navBar from '@/components/NavBar.vue'
import swiper from '@/components/Swiper.vue'
import { getHome } from '@/service/home'
import { getLocal } from '@/common/js/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const state = reactive({
    // 头部样式根据滚动变化
    headerScroll: false,
    // 是否登录
    isLogin: false,
    swiperList: [],//轮播图列表
    // 导航分类
    categoryList: [
        {
            name: '新蜂超市',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
            categoryId: 100001
        }, {
            name: '新蜂服饰',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
            categoryId: 100003
        }, {
            name: '全球购',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png',
            categoryId: 100002
        }, {
            name: '新蜂生鲜',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png',
            categoryId: 100004
        }, {
            name: '新蜂到家',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png',
            categoryId: 100005
        }, {
            name: '充值缴费',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png',
            categoryId: 100006
        }, {
            name: '9.9元拼',
            imgUrl: 'https://s.yezgea02.com/1604041127880/9.9%402x.png',
            categoryId: 100007
        }, {
            name: '领劵',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png',
            categoryId: 100008
        }, {
            name: '省钱',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png',
            categoryId: 100009
        }, {
            name: '全部',
            imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png',
            categoryId: 100010
        }
    ],
    // 新品列表
    newGoods: [],
    // 热门列表
    hots: [],
    // 最新推荐列表
    recommends: [],
    // 骨架屏占位，false隐藏骨架屏
    loading: true
})
onMounted(async () => {
    // 获取token
    const token = getLocal('token')
    // 如果token存在
    if (token) {
        state.isLogin = true
    }
    // 提示数据加载中
    showLoadingToast({
        message: '加载中...',
        forbidClick: true,
    });
    // 获取首页信息
    const { data } = await getHome()
    // console.log("home",data)
    // 轮播图信息
    state.swiperList = data.carousels
    // 新品商品信息
    state.newGoods = data.newGoodses
    // 热门商品信息
    state.hots = data.hotGoodses
    // 最新推荐商品信息
    state.recommends = data.recommendGoodses
    // console.log(state.newGoods)
    // 表示信息加载成功，隐藏骨架屏
    state.loading = false
    // 关闭提示
    closeToast()
    /* window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
    }) */
})
const goToDetail = (id) => {
    router.push({ path: `/product/${id}` })
}
// nextTick() 可以在状态改变后立即使用
nextTick(() => {
    // 给页面绑定滚轮事件
    window.addEventListener('scroll', () => {
        // 获取距离顶部的高度
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        // 判断顶部的高度，修改显示内容
        scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
    })
})


const tips = () => {
    showToast({
        message: '暂未开放，敬请期待！',
        // position: 'top',
    });
}
</script>
<style lang="less" scoped>
@import '../common/style/mixin.less';

.home-header {
    position: fixed;
    top: 0;
    left: 0;
    .wh(100%, 50px);
    .fj();
    line-height: 50px;
    padding: 0 15px;
    font-size: 15px;
    .boxSizing();
    // color: #fff;
    z-index: 999;

    .nbmenu2 {
        color: @primary
    }

    &.active {
        background: @primary;

        .nbmenu2 {
            color: #fff;
        }

        .login {
            color: #fff;
        }
    }

    .header-search {
        display: flex;
        width: 74%;
        margin: 10px 0;
        padding: 5px 0;
        line-height: 20px;
        border-radius: 20px;
        background: rgba(255, 255, 255, .7);

        .app-name {
            font-size: 20px;
            padding: 0 10px;
            color: @primary;
            font-weight: 700;
            border-right: 1px solid #666;
        }

        .icon-search {
            padding: 0 10px;
            font-size: 17px;
        }

        .search-title {
            font-size: 12px;
            color: #666;
            line-height: 21px;
        }
    }

    .login {
        color: @primary;
        line-height: 52px;

        .van-icon-manager-o {
            font-size: 20px;
            vertical-align: -3px;
        }
    }
}

.category-list {
    .fj();
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 13px;

    div {
        .fj();
        flex-direction: column;
        align-items: center;
        width: 20%;

        img {
            .wh(36px, 36px);
            margin: 13px auto 8px auto;
        }
    }
}

.good {
    .good-header {
        width: 100%;
        height: 50px;
        font-size: 16px;
        line-height: 50px;
        text-align: center;
        color: @primary;
        background-color: rgb(249, 249, 249);
    }

    .good-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        .good-item {
            box-sizing: border-box;
            width: 50%;
            border-bottom: 1px solid #ccc;
            padding: 10px 10px;

            img {
                display: block;
                width: 120px;
                margin: 0 auto;
            }

            .good-desc {
                font-size: 14px;
                text-align: center;
                padding: 10px 0;

                .title {
                    color: #222333;
                }

                .price {
                    color: @primary;
                }
            }

            &:nth-child(2n+1) {
                border-right: 1px solid #ccc;
            }
        }
    }
}
</style>