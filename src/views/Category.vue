<template>
    <div class="categray">
        <div>
            <header class="van-hairline--bottom categray-header">
                <i class="nbicon nbfanhui" @click="goHome"></i>
                <router-link tag="div" class="header-search" to="./product-list?from=category">
                    <i class="nbicon nbSearch icon-left"></i>
                    <span class="search-title">全场50元起步</span>
                </router-link>
            </header>
            <nav-bar></nav-bar>
            <div class="search-wrap" ref="searchWrap">
                <list-scroll :scroll-data="state.categoryData" class="nav-side-wrapper">
                    <ul class="nav-side">
                        <li v-for="item in state.categoryData" :key="item.categoryId"
                            :class="{ 'active': state.currentIndex === item.categoryId }"
                            @click="selectMenu(item.categoryId)">{{ item.categoryName }}</li>
                    </ul>
                </list-scroll>
                <div class="search-content">
                    <list-scroll :scroll-data="state.categoryData">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                <template v-for="(category, index) in state.categoryData">
                                    <!-- 渲染.categoryId和currentIndex相等的列表 -->
                                    <div class="swiper-slide" v-if="state.currentIndex === category.categoryId"
                                        :key="index">
                                        <div class="category-list"
                                            v-for="(products, index) in category.secondLevelCategoryVOS" :key="index">
                                            <p class="catogory-title">{{ products.categoryName }}</p>
                                            <div class="product-item"
                                                v-for="(product, index) in products.thirdLevelCategoryVOS" :key="index"
                                                @click="selectProduct(product)">
                                                <img src="https://img14.360buyimg.com/focus/s140x140_jfs/t27136/183/1628977274/31007/a6f7ed55/5be6ebd8Nb07ef492.png"
                                                    class="product-img">
                                                <p class="product-title" v-text="product.categoryName"></p>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </list-scroll>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import navBar from '@/components/NavBar.vue'
import listScroll from '@/components/ListScroll.vue'
import { getCategory } from "@/service/good"
import { showLoadingToast, closeToast } from 'vant'
const router = useRouter()
const searchWrap = ref(null)
const state = reactive({
    // 分类列表
    categoryData: [],
    // 当前显示列表的id
    currentIndex: 15
})
onMounted(async () => {
    // 获取屏幕高度
    let $screenHeight = document.documentElement.clientHeight
    // 主体高度为屏幕高度
    searchWrap.value.style.height = $screenHeight - 110 + 'px'
    // 加载提示
    showLoadingToast('加载中...')
    // axios请求分类列表数据
    const { data } = await getCategory()
    // console.log("=====",data)
    // 取消提示
    closeToast()
    state.categoryData = data
})
const selectMenu = (id) => {
    state.currentIndex = id
}
const selectProduct = (value) => {
    console.log('111111', value.categoryId)
    router.push({ path: '/product-list', query: { categoryId: value.categoryId } })
}
const goHome = () => {
    router.push({ path: 'home' })
}
</script>
<style lang="less" scoped>
@import '../common/style/mixin.less';

.categray {
    .categray-header {
        .wh(100%, 50px);
        position: fixed;
        top: 0;
        left: 0;
        .fj();
        line-height: 50px;
        padding: 0 15px;
        box-sizing: border-box;
        font-size: 15px;
        z-index: 999;
        background-color: #fff;

        .header-search {
            .wh(90%, 30px);
            background-color: #f7f7f7;
            margin: 10px 0;
            line-height: 30px;
            padding: 0 5px;
            border-radius: 15px;
            font-size: 12px;

            .icon-left {
                padding: 0 5px;
            }

            .search-title {
                color: #767272;
            }
        }
    }

    .search-wrap {
        .fj();
        width: 100%;
        background-color: #f8f8f8;
        margin-top: 50px;

        .nav-side-wrapper {
            width: 28%;
            height: 100%;
            overflow: hidden;

            .nav-side {
                width: 100%;
                .boxSizing();
                background-color: #f8f8f8;

                li {
                    width: 100%;
                    height: 56px;
                    font-size: 14px;
                    line-height: 56px;
                    text-align: center;

                    &.active {
                        color: @primary;
                        background-color: #fff;
                    }
                }
            }
        }

        .search-content {
            width: 72%;
            height: 100%;
            padding: 0 10px;
            background-color: #fff;
            overflow-y: scroll;
            touch-action: pan-y;

            * {
                touch-action: pan-y;
            }

            .boxSizing();

            .swiper-container {
                width: 100%;

                .swiper-slide {
                    width: 100%;

                    .category-list {
                        display: flex;
                        flex-wrap: wrap;
                        flex-shrink: 0;
                        width: 100%;

                        .catogory-title {
                            width: 100%;
                            padding: 20px 0;
                            font-size: 17px;
                            font-weight: 400;
                        }

                        .product-item {
                            width: 33.3333%;
                            text-align: center;
                            margin-bottom: 10px;

                            .product-img {
                                .wh(30px, 30px);
                            }

                            .product-title {
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>