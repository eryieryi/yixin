<template>
  <div class="order-box">
    <s-header :name="'我的订单'" :back="route.query.from == 'mine' ? '/user' : '/cart'"></s-header>
    <van-tabs @click-tab="onChangeTab" :color="'red'" :title-active-color="'red'" class="order-tab"
      v-model="state.status">
      <van-tab title="全部" name=''></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待确认" name="1"></van-tab>
      <van-tab title="待发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" style="min-height: 100vh;"
        class="order-list-refresh">
        <van-list v-model:loading="state.loading" :finished="state.finished" finished-text="没有更多了" @load="onLoad"
          @offset="10">
          <div class="order-item-box" v-for="(item, index) in state.list" :key="index"
            @click="goToOrderDetail(item.orderNo)">
            <div class="order-item-header">
              <span>订单时间：{{ item.createTime }}</span>
              <span>{{ item.orderStatusString }}</span>
            </div>
            <van-card class="info" v-for="one in item.newBeeMallOrderItemVOS" :key="one.orderId" :num="one.goodsCount"
              :price="one.sellingPrice" desc="全场包邮" :title="one.goodsName" :thumb="$filters.prefix(one.goodsCoverImg)" />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import { reactive } from 'vue'
import { getOrderList } from '@/service/order.js'
import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const state = reactive({
  status: '',
  // 是否处于加载状态（下拉）
  refreshing: false,
  // 是否处于加载状态（列表加载）
  loading: false,
  // 是否加载完成
  finished: false,
  // 订单列表
  list: [],
  // 页码
  page: 1,
  // 总页数
  totalPage: 0,
})
const loadData = async () => {
  const { data, data: { list } } = await getOrderList({ pageNumber: state.page, status: state.status })
  state.list = state.list.concat(list)
  state.totalPage = data.totalPage
  // 手动关闭加载
  state.loading = false
  if (state.page >= data.totalPage) state.finished = true

}
const onChangeTab = ({ name }) => {
  // console.log('name', name)
  // 这里 Tab 最好采用点击事件，@click，如果用 @change 事件，会默认进来执行一次。
  state.status = name
  onRefresh()
}
const onRefresh = () => {
  // 下拉加载状态
  state.refreshing = true
  state.finished = false
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
    state.list = []
    state.refreshing = false
  }
  loadData()
}
const goToOrderDetail = (id) => {
  // console.log(id)
  router.push({ path: '/order-detail', query: { orderNo: id } })
}
</script>

<style lang="less" scoped>
.order-box {
  .order-tab {
    position: fixed;
    z-index: 666;
    border-bottom: 1px solid #ccc;
  }

  .content {
    margin-top: 50px;
    padding: 0 10px;

    .order-item-box {
      margin-top: 20px;

      .order-item-header {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
      }

      .info {
        border-radius: 8px;
      }
    }
  }
}
</style>