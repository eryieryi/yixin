<template>
    <div class="product-list-wrap">
        <div class="product-list-content">
            <header class="category-header wrap">
                <i class="nbicon nbfanhui" @click="goBack"></i>
                <div class="header-search">
                    <i class="nbicon nbSearch"></i>
                    <input type="text" class="search-title" v-model="state.keyword">
                </div>
                <span class="search-btn" @click="goSearch">搜索</span>
            </header>
            <van-tabs type="card" @click-tab="changeTab" color="red">
                <van-tab title="推荐" name=""></van-tab>
                <van-tab title="新品" name="new"></van-tab>
                <van-tab title="价格" name="price"></van-tab>
            </van-tabs>
        </div>
    </div>
    <div class="content">
        <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" style="min-height: 100vh;"
            class="product-list-refresh">
            <van-list class="product-list" v-model:loading="state.loading" :finished="state.finished"
                :finished-text="state.productList.length ? '没有更多了' : '搜索想要的商品'" @load="onLoad" @offset="10">
                <template v-if="state.productList.length">
                    <div class="product-item" v-for="(item, index) in state.productList" :key="index"
                        @click="productDetail(item)">
                        <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                        <div class="product-info">
                            <p class="name van-multi-ellipsis--l2">{{ item.goodsName }}</p>
                            <p class="subtitle van-ellipsis">{{ item.goodsIntro }}</p>
                            <span class="price">￥{{ item.sellingPrice }}</span>
                        </div>
                    </div>
                </template>
                <img class="empty" v-else src="https://s.yezgea02.com/1604041313083/kesrtd.png" alt="搜索">
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { search } from '@/service/good.js'
const router = useRouter()
const route = useRoute()
const state = reactive({
    keyword: '',
    // 是否处于加载状态（下拉）
    refreshing: false,
    // 是否处于加载状态（列表加载）
    loading: false,
    // 是否已加载完成，加载完成后不再触发 load 事件
    finished: false,
    // 商品列表
    productList: [],
    totalPage: 0,
    page: 1,
    orderBy: ''
})
const init = async () => {
    const { categoryId } = route.query
    if (!categoryId && !state.keyword) {
        state.finished = true
        state.loading = false
        return
    }
    const { data, data: { list } } = await search({ pageNumber: state.page, goodsCategoryId: categoryId, keyword: state.keyword, orderBy: state.orderBy })
    // 用于合并两个或多个数组。
    state.productList = state.productList.concat(list)
    state.totalPage = data.totalPage
    // 手动关闭加载
    state.loading = false
    if (state.page >= data.totalPage) state.finished = true
}
const goBack = () => {
    router.go(-1)
}
const goSearch = () => {
    onRefresh()
}
const changeTab = ({ name }) => {
    // console.log('name', name)
    state.orderBy = name
    onRefresh()
}
const onRefresh = () => {
    // 下拉加载状态
    state.refreshing = true
    // state.finished = false
    state.loading = true
    state.page = 1
    setTimeout(() => {
        onLoad()
        showToast('刷新成功');
    }, 500);
}
// List 初始化后会触发一次 load 事件，滚动条与底部距离小于 offset 时触发
const onLoad = () => {
    if (!state.refreshing && state.page < state.totalPage) {
        state.page += 1
    }
    if (state.refreshing) {
        state.productList = []
        state.refreshing = false
    }
    init()
}
const productDetail = (item) => {
    router.push({ path: `/product/${item.goodsId}` })
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';

.product-list-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;

    .category-header {
        .fj();
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0 15px;
        .boxSizing();
        font-size: 15px;
        color: #656771;
        z-index: 999;

        &.active {
            background: @primary;
        }

        .header-search {
            display: flex;
            width: 76%;
            line-height: 20px;
            margin: 10px 0;
            padding: 5px 0;
            color: #232326;
            background: #F7F7F7;
            .borderRadius(20px);

            .nbSearch {
                padding: 0 5px 0 20px;
                font-size: 17px;
            }

            .search-title {
                font-size: 12px;
                color: #666;
                background: #F7F7F7;
            }
        }

        .search-btn {
            height: 28px;
            margin: 8px 0;
            line-height: 28px;
            padding: 0 5px;
            color: #fff;
            background: @primary;
            margin-top: 10px;
            .borderRadius(5px);
        }
    }
}

.content {
    height: calc(~"(100vh - 70px)");
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 78px;

    .product-list-refresh {

        .product-list {
            width: 95%;
            margin: 0 auto;
            height: 100%;

            .product-item {
                .fj();
                width: 100%;
                height: 130px;
                padding: 10px 0;
                border-bottom: 1px solid #dcdcdc;
                .boxSizing();

                img {
                    width: 140px;
                    height: 100%;
                    padding: 0 10px;
                    .boxSizing();
                }

                .product-info {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                    width: 56%;
                    height: 120px;
                    padding: 5px;
                    text-align: left;
                    .boxSizing();

                    .name {
                        font-size: 15px;
                        font-weight: 500;
                    }

                    .subtitle {
                        color: #999;
                    }

                    .price {
                        font-size: 18px;
                        color: red;
                    }
                }
            }

            .empty {
                display: block;
                width: 150px;
                margin: 50px auto 20px;
            }
        }
    }
}
</style>