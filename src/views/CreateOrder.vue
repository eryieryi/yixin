<template>
  <div class="create-order">
    <s-header :name="'生成订单'" :noback="false"></s-header>
    <div class="addAddress" v-if="!state.address" @click="toAddress">
      添加收货地址
      <van-icon class="arrow01" name="arrow" />
    </div>
    <div class="address-wrap" v-else @click="goTo">
      <div class="name">
        <span>{{ state.address.userName }}</span> <span>{{ state.address.userPhone }}</span>
      </div>
      <div class="address">
        {{ state.address.provinceName }} {{ state.address.cityName }} {{ state.address.regionName }} {{
          state.address.detailAddress }}
      </div>
      <van-icon class="arrow" name="arrow" />
    </div>
    <div class="good" v-if="route.query.from == 'product-detail' || 'create-order-detail'">
      <div class="good-item" v-for="(item, index) in state.goodList" :key="index">
        <div class="good-img"><img :src="$filters.prefix(item.goodsCoverImg)" alt=""></div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.goodsName }}</span>
            <span>x1</span>
          </div>
          <div class="good-price">￥{{ item.sellingPrice }}</div>
        </div>
      </div>
    </div>
    <div class="good good2" v-if="route.query.from == 'cart' || 'create-order-cart'">
      <div class="good-item" v-for="(item, index) in state.cartList" :key="index">
        <div class="good-img"><img :src="$filters.prefix(item.goodsCoverImg)" alt=""></div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.goodsName }}</span>
            <span>x{{ item.goodsCount }}</span>
          </div>
          <div class="good-btn">
            <div class="good-price">￥{{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-wrap">
      <div class="price">
        <span>商品金额</span>
        <span style="color: red;">￥{{ total }}</span>
      </div>
      <van-button type="danger" @click="handleCreateOrder" block>生成订单</van-button>
    </div>
    <van-popup v-model:show="state.showPay" :close-on-click-overlay="false" closeable position="bottom"
      :style="{ height: '30%' }" @close="close">
      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-button :style="{ marginBottom: '10px' }" color="#1989fa" block @click="handlePayOrder(1)">支付宝支付</van-button>
        <van-button color="#4fc08d" block @click="handlePayOrder(2)">微信支付</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import sHeader from '@/components/SimpleHeader.vue'
import { closeToast, showFailToast, showLoadingToast, showSuccessToast, showToast } from 'vant'
import { getLocal, setLocal } from '@/common/js/utils.js'
import { getDetail } from '@/service/good.js'
import { getAddressDetail, getDefaultAddress } from '@/service/address.js'
import { getByCartItemIds } from '@/service/cart.js'
import { createOrder, payOrder } from '@/service/order.js'
const route = useRoute()
const router = useRouter()
const state = reactive({
  goodList: [],
  address: {},
  cartList: [],
  showPay: false,
  // 订单号
  orderNo: ''
})
onMounted(() => {
  init()
  // console.log(route.query.from)
})
const toAddress = () => {
  if (route.query.from == 'cart') {
    router.push({ path: '/address', query: { from: 'create-order-cart' } })
  }
  if (route.query.from == 'product-detail') {
    router.push({ path: '/address', query: { from: 'create-order-detail' } })
  }
}
const init = async () => {
  showLoadingToast('加载中...')
  if (route.query.from == 'product-detail' || route.query.from == 'create-order-detail') {
    // 获取商品Id
    const { addressId, goodsId } = route.query
    const _goodsId = goodsId ? JSON.parse(goodsId) : JSON.parse(getLocal('goodsId'))
    setLocal('goodsId', JSON.stringify(_goodsId))
    const { data } = await getDetail(_goodsId)
    const { data: address } = addressId ? await getAddressDetail(addressId) : await getDefaultAddress()
    console.log(data)
    state.goodList[0] = data
    state.address = address
  }
  if (route.query.from == 'cart' || route.query.from == 'create-order-cart') {
    // 获取购物车选中商品id
    const { addressId, cartItemIds } = route.query
    const _cartItemIds = cartItemIds ? JSON.parse(cartItemIds) : JSON.parse(getLocal('cartItemIds'))
    setLocal('cartItemIds', JSON.stringify(_cartItemIds))
    const { data: list } = await getByCartItemIds({ cartItemIds: _cartItemIds.join(',') })
    const { data: address } = addressId ? await getAddressDetail(addressId) : await getDefaultAddress()
    state.cartList = list
    state.address = address
  }
  closeToast()
}
// 点击切换收货地址
const goTo = () => {
  if (route.query.from == 'cart' || 'create-order-cart') {
    router.push({ path: '/address', query: { from: 'create-order-cart' } })
  }
  if (route.query.from == 'product-detail' || 'create-order-detail') {
    router.push({ path: '/address', query: { from: 'create-order-detail' } })
  }
}
const handleCreateOrder = async () => {
  if (!state.address) {
    showFailToast('请选择收货地址')
    return
  }
  // 参数问题，不能直接购买
  if (route.query.from == 'create-order-detail') {
    showToast('成功')
    return
  }
  // showToast('成功')
  // 从购物车可以下订单
  const params = {
    addressId: state.address.addressId,
    cartItemIds: state.cartList.map(item => item.cartItemId)
  }
  const { data } = await createOrder(params)
  // console.log(data)
  setLocal('cartItemIds', '')
  state.orderNo = data
  state.showPay = true
}
const handlePayOrder = async (value) => {
  await payOrder({ orderNo: state.orderNo, payType: value })
  showSuccessToast('支付成功')
  setTimeout(() => {
    router.push({ path: '/order' })
  }, 1000);
}
const total = computed(() => {
  let sum = 0
  state.goodList.forEach(item => {
    sum = item.sellingPrice
    // console.log('111', sum)
  })
  state.cartList.forEach(item => {
    sum += item.goodsCount * item.sellingPrice
    // console.log('222', sum)
  })
  return sum
})

const close = () => {
  // console.log(111111)
  router.push({ path: '/order' })
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';

.create-order {
  background-color: #fff;

  .addAddress {
    background-color: #f9f9f9;
    padding: 15px;
    font-size: 16px;
    position: relative;

    .arrow01 {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-size: 20px;
    }

    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background-size: 80px;
      content: '';
    }
  }

  .address-wrap {
    background-color: #f9f9f9;
    padding: 15px;
    font-size: 14px;
    color: #000;
    position: relative;
    margin-bottom: 20px;

    .name,
    .address {
      margin: 10px 0;
    }

    .arrow {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-size: 20px;
    }

    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background-size: 80px;
      content: '';
    }
  }

  .good {

    .good-item {
      padding: 10px;
      display: flex;

      .good-img {
        img {
          .wh(100px, 100px)
        }
      }

      .good-desc {
        padding: 20px;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;

        .good-title {
          display: flex;
          justify-content: space-between;
        }

        .good-price {
          font-size: 16px;
          color: red;
        }
      }
    }
  }

  .good2 {
    margin-bottom: 100px;
  }

  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 7px 20px;
    border-top: 1px solid #eceaea;
    background-color: #fff;

    .price {
      display: flex;
      justify-content: space-between;
      padding: 18px 0;
      font-size: 16px;
    }
  }
}
</style>