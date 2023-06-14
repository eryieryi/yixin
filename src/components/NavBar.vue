<template>
    <div class="nav-bar">
        <ul class="nav-list">
            <router-link class="nav-list-item active" to="/home">
                <i class="nbicon nblvsefenkaicankaoxianban-1"></i>
                <span>首页</span>
            </router-link>
            <router-link class="nav-list-item" to="/category">
                <i class="nbicon nbfenlei"></i>
                <span>分类</span>
            </router-link>
            <router-link class="nav-list-item" to="/cart">
                <i><van-icon name="shopping-cart-o" :badge="!cart.count ? '' : cart.count" /></i>
                <span>购物车</span>
            </router-link>
            <router-link class="nav-list-item" to="/user">
                <i class="nbicon nblvsefenkaicankaoxianban-"></i>
                <span>我的</span>
            </router-link>
        </ul>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { getLocal } from '@/common/js/utils.js'
import { onMounted } from 'vue'
const cart = useCartStore()
const route = useRoute()
onMounted(() => {
    // 获取token
    const token = getLocal('token')
    // 获取当前地址
    const path = route.path
    // 如果token存在或者访问的地址不是/home和/category就更新购物车数量（再没登录的情况下，可进/home和/category）
    if (token || !['/home', '/category'].includes(path)) {
        cart.updateCart()
    }
})
</script>

<style lang="less" scoped>
@import '../common/style/mixin.less';

.nav-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5px 0;
    z-index: 999;
    background: #fff;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    border-top: 1px solid #f7f6f6;

    .nav-list {
        width: 100%;
        display: flex;
        justify-content: space-around;

        .nav-list-item {
            .fj();
            flex-direction: column;
            align-items: center;
            color: #666;

            i {
                font-size: 22px;
            }

            &.router-link-active {
                color: @primary;
            }

            span {
                font-size: 12px;
            }
        }


    }
}
</style>