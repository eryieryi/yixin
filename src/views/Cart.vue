<template>
    <div class="cart-box">
        <s-header :name="'购物车'" :noback="false"></s-header>
        <div class="cart-body">
            <van-checkbox-group @change="groupChange" v-model="state.result">
                <van-swipe-cell v-for="(item) in state.list" :key="item.cartItemId">
                    <div class="good-item">
                        <van-checkbox :name="item.cartItemId" class="checkbox" checked-color="red"></van-checkbox>
                        <div class="good-img">
                            <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
                        </div>
                        <div class="good-desc">
                            <div class="good-title">
                                <span>{{ item.goodsName }}</span>
                                <span>x{{ item.goodsCount }}</span>
                            </div>
                            <div class="good-btn">
                                <div class="price">￥{{ item.sellingPrice }}</div>
                                <van-stepper disable-input integer v-model="item.goodsCount" :name="item.cartItemId" min="1"
                                    max="5" async-change @change="onChange" />
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <van-button square text="删除" @click="deleteGood(item.cartItemId)" type="danger"
                            class="delete-button" />
                    </template>
                </van-swipe-cell>
            </van-checkbox-group>
        </div>
        <van-submit-bar v-if="state.list.length > 0" class="submit-all van-hairline--top" :price="total * 100"
            button-type="danger" button-text="结算" @submit="onSubmit">
            <van-checkbox @click="allCheck" v-model="state.checkAll" checked-color="red">全选</van-checkbox>
        </van-submit-bar>
        <div class="empty" v-if="!state.list.length">
            <img class="empty-cart" src="https://s.yezgea02.com/1604028375097/empty-car.png" alt="">
            <div class="title">购物车空空如也</div>
            <van-button round type="danger" @click="goTo" block>前往选购</van-button>
        </div>
        <nav-bar></nav-bar>
    </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import navBar from '@/components/NavBar.vue'
import { useRouter } from 'vue-router'
import { getCart, modifyCart, deleteCartGood } from '@/service/cart.js'
import { computed, onMounted, reactive } from 'vue'
import { showToast, closeToast, showLoadingToast, showFailToast } from 'vant'
import { useCartStore } from '@/store/cart.js'
const router = useRouter()
const cart = useCartStore()
const state = reactive({
    // 购物车商品列表
    list: [],
    // 用于复选框绑定勾选状态
    result: [],
    // 全选
    checkAll: true
})
const goTo = () => {
    router.push({ path: '/home' })
}
onMounted(() => {
    init()
})
// 初始化
const init = async () => {
    showLoadingToast('加载中...')
    const { data } = await getCart()
    console.log(data)
    state.list = data
    state.result = data.map(item => item.cartItemId)
    closeToast()
}
// 删除
const deleteGood = async (id) => {
    await deleteCartGood(id)
    cart.updateCart()
    init()
}
// 步进器的改变事件
const onChange = async (value, detail) => {
    // console.log(value, detail)
    if (value < 1) {
        showFailToast('商品数量最少为1')
        return
    }
    if (value > 5) {
        showFailToast('超过购买上限!')
        return
    }
    /**
     * 如果 state.list 数组中存在一个元素，它的 cartItemId 属性等于 detail.name，
     * 并且该元素的 goodsCount 属性等于 value，则返回。
     */
    // if (state.list.find(item => item.cartItemId == detail.name)?.goodsCount == value) { return }
    showLoadingToast({ message: '修改中...', forbidClick: true });
    // 将修改后的值存入params对象中
    const params = {
        cartItemId: detail.name,
        goodsCount: value
    }
    // 通过发请求修改数据
    await modifyCart(params)

    // 实时修改state中list的goodsCount数据
    // state.list.forEach(item => {
    //     if (item.cartItemId == detail.name) {
    //         item.goodsCount = value
    //     }
    // })
    closeToast()
}
// 当复选框组状态改变时触发，返回的参数是剩余复选框
const groupChange = (result) => {
    // console.log(result)
    // 判断是否全选
    if (result.length === state.list.length) {
        state.checkAll = true
    } else {
        state.checkAll = false
    }
    // 将改变后的结果赋值给state的result
    state.result = result
}
// 全选复选框，点击后取消选中，checkAll为false
const allCheck = () => {
    if (state.checkAll) {
        state.result = state.list.map(item => item.cartItemId)
    } else {
        state.result = []
    }
}
const total = computed(() => {
    let sum = 0
    // 选出购物车列表中被选中的商品列表
    let list = state.list.filter(item => state.result.includes(item.cartItemId))
    // 遍历列表
    list.forEach(item => {
        // 总价钱是 个数*价格
        sum += item.goodsCount * item.sellingPrice
    })
    return sum
})
// 提交订单
const onSubmit = () => {
    if (state.result.length === 0) {
        showFailToast('请选择要结算的商品')
        return
    }
    // 获取选中的商品
    const params = JSON.stringify(state.result)
    // console.log(params)
    router.push({ path: '/create-order', query: { cartItemIds: params, from: 'cart' } })
}
</script>

<style lang="less" scoped>
@import '../common/style/mixin.less';

.cart-box {
    .cart-body {
        padding-left: 10px;
        margin-bottom: 120px;

        .good-item {
            display: flex;

            /* .checkbox {
                margin-left: 10px;
            } */

            .good-img {
                img {
                    .wh(100px, 100px)
                }
            }

            .good-desc {
                display: flex;
                flex-direction: column;
                flex: 1;
                justify-content: space-between;
                padding: 20px;

                .good-title {
                    display: flex;
                    justify-content: space-between;
                }

                .good-btn {
                    display: flex;
                    justify-content: space-between;

                    .price {
                        font-size: 16px;
                        color: red;
                    }
                }
            }
        }

        .delete-button {
            height: 100%;
        }
    }

    .submit-all {
        margin-bottom: 65px;
    }

    .empty {
        width: 50%;
        margin: 0 auto;
        margin-top: 50%;
        text-align: center;

        .empty-cart {
            width: 150px;
            margin-bottom: 20px;
        }


        .title {
            font-size: 16px;
            margin-bottom: 20px;
        }
    }
}
</style>