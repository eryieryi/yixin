<template>
  <div>
    <s-header :name="state.type == 'add' ? '新增地址' : '修改地址'"></s-header>
    <van-address-edit :area-list="areaList" :address-info="state.addressInfo" :show-delete="state.type == 'edit'"
      show-set-default show-search-result :search-result="state.searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave" @delete="onDelete" />

  </div>
</template>
<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import { addAddress } from '@/service/address.js'
// 导入中国省市区数据
import { areaList } from '@vant/area-data'
import { showToast } from 'vant'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAddressDetail, deleteAddress, EditAddress } from '@/service/address.js'
const router = useRouter()
const route = useRoute()
const state = reactive({
  searchResult: [],
  // 默认增加
  type: 'add',
  addressId: '',
  from: route.query.from,
  addressInfo: {}
})
onMounted(async () => {
  const { type, addressId, from } = route.query
  // console.log(type, addressId, from) // edit 15084 create-order-detail
  // 点击编辑按钮，状态改变
  state.type = type
  // 需要编辑的地址ID
  state.addressId = addressId
  state.from = from || ''
  if (type == 'edit') {
    const { data: addressDetail } = await getAddressDetail(addressId)
    console.log(addressDetail)
    // addressInfo是点击编辑后详细显示到输入框内
    state.addressInfo = {
      id: addressDetail.addressId,
      name: addressDetail.userName,
      tel: addressDetail.userPhone,
      province: addressDetail.provinceName,
      city: addressDetail.cityName,
      county: addressDetail.regionName,
      addressDetail: addressDetail.detailAddress,
      // !!将数字强制转化为布尔值
      isDefault: !!addressDetail.defaultFlag
    }
  }
})
// 保存
const onSave = async (info) => {
  // console.log(info)
  const params = {
    userName: info.name,
    userPhone: info.tel,
    provinceName: info.province,
    cityName: info.city,
    regionName: info.county,
    detailAddress: info.addressDetail,
    defaultFlag: info.isDefault ? 1 : 0
  }
  if (state.type == 'edit') {
    params['addressId'] = state.addressId
  }
  await state.type == 'add' ? addAddress(params) : EditAddress(params)
  showToast('保存成功')
  setTimeout(() => {
    router.back()
  }, 1000)
}
// 删除
const onDelete = async () => {
  await deleteAddress(state.addressId)
  showToast('删除成功')
  setTimeout(() => {
    router.back()
  }, 1000)
}
</script>