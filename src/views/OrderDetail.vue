<template>
  <div class="order">
    <s-header :name="'订单详情'"></s-header>
    <div class="order-info">
      <div class="order-status">
        订单状态：{{ state.detail.orderStatusString }}
        <span v-if="state.detail.orderStatus == 0" style="color: red;" @click="showPay">去支付</span>
      </div>
      <div class="order-id">
        订单编号：{{ state.detail.orderNo }}
      </div>
      <div class="time">
        下单时间：{{ state.detail.createTime }}
      </div>
    </div>
    <div class="order-data">
      <div class="price">
        商品金额：￥{{ state.detail.totalPrice }}
      </div>
      <div class="kuaidi">
        支付方式：{{ state.detail.payTypeString }}
      </div>
    </div>
    <div class="card">
      <van-card class="info" v-for=" (item, index)  in state.detail.newBeeMallOrderItemVOS" :key="index"
        :num="item.goodsCount" :price="item.sellingPrice" desc="全场包邮" :title="item.goodsName"
        :thumb="$filters.prefix(item.goodsCoverImg)" />
    </div>
    <van-popup v-model:show="state.showPay" position="bottom" :style="{ height: '24%' }">
      <div :style="{ width: '90%', margin: '0 auto', padding: '20px 0' }">
        <van-button :style="{ marginBottom: '10px' }" color="#1989fa" block
          @click="handlePayOrder(state.detail.orderNo, 1)">支付宝支付</van-button>
        <van-button color="#4fc08d" block @click="handlePayOrder(state.detail.orderNo, 2)">微信支付</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import { getOrderDetail, payOrder } from '@/service/order.js'
import { closeToast, showLoadingToast } from 'vant'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const state = reactive({
  detail: {},
  showPay: false
})
onMounted(() => {
  init()
})
const showPay = () => {
  state.showPay = true
}
const handlePayOrder = async (orderNo, payType) => {
  await payOrder({ orderNo, payType })
  state.showPay = false
  init()
}
const init = async () => {
  showLoadingToast('加载中...')
  const { orderNo } = route.query
  console.log('11111', orderNo)
  const { data } = await getOrderDetail(orderNo)
  state.detail = data
  console.log(data)
  closeToast()
}
</script>

<style lang="less" scoped>
.order-info,
.order-data {
  display: flex;
  flex-direction: column;
  padding: 15px 50px;
}
</style>