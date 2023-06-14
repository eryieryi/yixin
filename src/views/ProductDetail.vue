<template>
  <div class="product-detail">
    <s-header :name="'商品详情'"></s-header>
    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#4fc9c9">
          <van-swipe-item v-for="(item, index) in state.detail.goodsCarouselList" :key="index">
            <img :src="item" alt="">
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="product-title">
          {{ state.detail.goodsName }}
        </div>
        <div class="product-desc">免邮费 顺丰快递</div>
        <div class="product-price">
          <div class="yuanjia">
            ￥<i>{{ state.detail.sellingPrice }}</i>
            <span>.00</span>
          </div>
          <div class="selling">
            ￥<i class="sell">{{ plusPrise }}</i>
            <span class="sell">.00</span>
          </div>
        </div>
      </div>
      <div class="youhuiquan">
        <!-- 优惠券单元格 -->
        <van-coupon-cell :coupons="coupons" :chosen-coupon="chosenCoupon" @click="showList = true" />
        <!-- 优惠券列表 -->
        <van-popup v-model:show="showList" round position="bottom" style="height: 90%; padding-top: 4px;">
          <van-coupon-list :coupons="coupons" :chosen-coupon="chosenCoupon" :disabled-coupons="disabledCoupons"
            @change="onChange" @exchange="onExchange" />
        </van-popup>
      </div>
      <div class="product-intro">
        <ul>
          <li>概述</li>
          <li>参数</li>
          <li>安装服务</li>
          <li>常见问题</li>
        </ul>
        <div class="product-content" v-html="state.detail.goodsDetailContent"></div>
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" text="购物车" @click="toCart" :badge="!cart.count ? '' : cart.count" />
      <van-action-bar-button type="warning" @click="handleAddCart" text="加入购物车" />
      <van-action-bar-button type="danger" @click="toBuy" text="立即购买" />
    </van-action-bar>
  </div>
</template>

<script setup>
import sHeader from '@/components/SimpleHeader.vue'
import { useCartStore } from '@/store/cart.js'
import { getDetail } from '@/service/good.js'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { prefix } from '@/common/js/utils.js'
import { closeToast, showLoadingToast, showSuccessToast } from 'vant'
import { addCart } from '@/service/cart.js'
const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const state = reactive({
  detail: {
    goodsCarouselList: []
  }
})
const coupon = reactive({
  available: 1,
  condition: '无门槛\n最多优惠120元',
  reason: '',
  value: 10000,
  name: '优惠券名称',
  startAt: 1680941253,
  endAt: 1690941253,
  valueDesc: '100',
  unitDesc: '元',
})
const coupons = ref([coupon]);
const disabledCoupons = ref([coupon])
const showList = ref(false);
const chosenCoupon = ref(-1);

const onChange = (index) => {
  showList.value = false;
  chosenCoupon.value = index;
};
const onExchange = (code) => {
  coupons.value.push(coupon);
};

const toCart = () => {
  router.push({ path: '/cart' })
}
const plusPrise = computed(() => {
  let prise = state.detail.sellingPrice
  if (prise > 5000) {
    return prise - 500
  } else if (prise > 1000) {
    return prise - 300
  } else if (prise > 300) {
    return prise - 100
  } else {
    return prise - 9
  }
})
onMounted(async () => {
  showLoadingToast('加载中...')
  const { id } = route.params
  // console.log(id)
  const { data } = await getDetail(id)
  console.log(data);
  // 修改图片路径的问题
  data.goodsCarouselList = data.goodsCarouselList.map(i => prefix(i))
  state.detail = data
  closeToast()
})
const handleAddCart = async () => {
  // 添加购物车（参数：数量、商品Id，返回值：状态码）
  const { resultCode } = await addCart({ goodsCount: 1, goodsId: state.detail.goodsId })
  // 判断返回的状态码
  if (resultCode == 200) {
    showSuccessToast('添加成功')
  }
  // 更新全局cart状态
  cart.updateCart()
}
const toBuy = () => {
  const params = JSON.stringify(state.detail.goodsId)
  router.push({ path: '/create-order', query: { goodsId: params, from: 'product-detail' } })
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';

.product-detail {
  .detail-content {

    .detail-swipe-wrap {
      img {
        width: 100%;
      }
    }

    .product-info {
      padding: 0 10px;

      .product-title {
        font-size: 18px;
      }

      .product-desc {
        font-size: 14px;
        color: #999;
      }

      .product-price {
        color: red;
        .fj();
        justify-content: flex-start;
        align-items: center;

        .yuanjia {
          margin-right: 5px;

          i {
            font-size: 22px;
            font-style: normal;
          }


        }

        .selling {
          color: #000;
          font-weight: 700;
          font-size: 14px;

          .sell {
            font-style: normal;
            font-weight: 700;
          }

          &::after {
            content: 'PLUS';
            color: rgb(241, 225, 6);
            background-color: #111;
            border-radius: 4px;
            padding: 0 2px;
          }
        }
      }
    }

    .product-intro {
      width: 100%;
      margin-top: 15px;

      ul {
        display: flex;

        li {
          flex: 1;
          padding: 5px 0;
          text-align: center;
          border-right: 1px solid #ccc;
          font-size: 16px;

          &:last-child {
            border-right: 0;
          }
        }
      }

      .product-content {
        width: 100%;
        padding: 20px 10px;
        margin-bottom: 50px;
        overflow: hidden;

        img {
          width: 100%;
        }
      }
    }
  }

  // 按钮渐变
  .van-action-bar-button--warning {
    background: linear-gradient(to Right, #fa4b4b, @primary);
  }

  .van-action-bar-button--danger {
    background: linear-gradient(to Right, #f14146, #ea0c0c);
  }
}
</style>