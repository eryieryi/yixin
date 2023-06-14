<template>
  <div class="address-box">
    <s-header :name="'地址管理'"></s-header>
    <!-- 判断从哪进的address，用个人中心进的就没有选择地址后跳转 -->
    <div class="address-item">
      <van-address-list v-if="state.from != 'mine'" v-model="state.chosenAddressId" :list="state.list"
        default-tag-text="默认" @add="onAdd" @edit="onEdit" @select="select" />
      <van-address-list v-else v-model="state.chosenAddressId" :list="state.list" default-tag-text="默认" @add="onAdd"
        @edit="onEdit" />
    </div>
  </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import { onMounted, reactive } from 'vue'
import { getAddressList } from '@/service/address.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const state = reactive({
  chosenAddressId: '1',
  list: [],
  from: route?.query?.from ?? ''
})
onMounted(() => {
  init()
})
const init = async () => {
  const { data } = await getAddressList()
  // console.log(data)
  if (!data) {
    state.list = []
    return
  }
  state.list = data.map((item) => {
    return {
      id: item.addressId,
      name: item.userName,
      tel: item.userPhone,
      address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
      isDefault: !!item.defaultFlag
    }
  })
}
// 添加地址
const onAdd = () => {
  router.push({ path: '/address-edit', query: { type: 'add', from: state.from } })
}
// 编辑地址
const onEdit = (item) => {
  router.push({ path: '/address-edit', query: { type: 'edit', addressId: item.id, from: state.from } })
}
// 选中某个地址后跳转回订单
const select = (item) => {
  router.push({ path: 'create-order', query: { addressId: item.id, from: state.from } })
  // console.log('address', state.from)

  // console.log(item.id)
}
</script>

<style lang="less" scoped>
@import '../common/style/mixin.less';

.address-box {
  .van-radio__icon {
    display: none;
  }

  .address-item {
    .van-button {
      background: @primary;
      border-color: @primary;
    }
  }
}
</style>