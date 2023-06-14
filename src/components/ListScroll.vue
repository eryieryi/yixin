<template>
    <div ref="wrapper" class="scroll-wrapper">
        <slot></slot>
    </div>
</template>

<script setup>
// 引入
import BScroll from '@better-scroll/core'
import { nextTick, onUpdated, ref } from 'vue'
const props = defineProps({
    scrollData: {
        type: Array,
        default: null
    }
})
let bs = null
const wrapper = ref(null)
// 初始化、配置
const initScroll = () => {
    bs = new BScroll(wrapper.value, {
        probeType: 3,
        click: true,
        disableMouse: true // 禁止鼠标滚轮滚动
    })
    // return bs
}
// 在 DOM 渲染完毕后初始化 better-scroll
nextTick(() => {
    initScroll()
})
onUpdated(() => {
    bs.refresh()
    // console.log(11111)
})

</script>

<style lang="less" scoped>
.scroll-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    // 垂直方向上的滚动条被显示出来
    overflow-y: scroll;
    // 表示在垂直方向上可以通过手势来滚动元素
    touch-action: pan-y;
}
</style>