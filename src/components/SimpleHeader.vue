<template>
    <header class="simple-header van-hairline--bottom">
        <i v-if="!isback" class="nbicon nbfanhui" @click="goBack"></i>
        <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
        <span class="simple-header-name">{{ name }}</span>
        <i class="nbicon nbmore" @click="showShare = true"></i>
    </header>
    <van-share-sheet v-model:show="showShare" title="立即分享给好友" :options="options" />
    <div class="block"></div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const showShare = ref(false)
const options = [
    [
        { name: '微信', icon: 'wechat' },
        { name: '朋友圈', icon: 'wechat-moments' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
    ],
    [
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
        { name: '小程序码', icon: 'weapp-qrcode' },
    ],
];
const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    back: {
        type: String,
        default: ''
    },
    noback: {
        type: Boolean,
        default: false
    }
})
const isback = ref(props.noback)
const goBack = () => {
    if (!props.back) {
        router.go(-1)
    } else {
        router.push({ path: props.back })
    }
}

</script>

<style lang="less" scoped>
@import '../common/style/mixin.less';

.simple-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .fj();
    .wh(100%, 44px);
    line-height: 44px;
    padding: 0 10px;
    .boxSizing();
    color: #000;
    background-color: #fff;

    .simple-header-name {
        font-size: 14px;
    }
}

.block {
    height: 44px;
}
</style>