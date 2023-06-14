import { createApp } from 'vue'
import router from '@/router'
import { ActionBar, ActionBarIcon, ActionBarButton, Divider, Popup, Overlay, Loading, Dialog, ContactCard, Form, AddressEdit, AddressList, Field, CellGroup, Cell, SwipeCell, Icon, Stepper, Card, Checkbox, CheckboxGroup, Button, Swipe, SwipeItem, PullRefresh, List, Tab, Tabs, SubmitBar, Toast, Skeleton } from 'vant'

import './assets/main.css'
import App from './App.vue'
import 'lib-flexible/flexible'
import '@/common/style/theme.css'
import { createPinia } from 'pinia'
import 'vant/es/toast/style'

// 初始化vue实例
const app = createApp(App)
// 创建pinia实例
const pinia = createPinia()
// 注册路由
app.use(router)
// 挂载
app.use(pinia)

app.use(ActionBarButton)
    .use(ActionBarIcon)
    .use(ActionBar)
    .use(Divider)
    .use(Popup)
    .use(Overlay)
    .use(Loading)
    .use(Dialog)
    .use(Toast)
    .use(ContactCard)
    .use(Form)
    .use(AddressEdit)
    .use(AddressList)
    .use(Field)
    .use(CellGroup)
    .use(Cell)
    .use(SwipeCell)
    .use(Icon)
    .use(Stepper)
    .use(Card)
    .use(Button)
    .use(Swipe)
    .use(SwipeItem)
    .use(PullRefresh)
    .use(List)
    .use(Tab)
    .use(Tabs)
    .use(SubmitBar)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Skeleton)


// 全局过滤器
app.config.globalProperties.$filters = {
    prefix(url) {
        if (url && url.startsWith('http')) {
            return url
        } else {
            url = `http://backend-api-01.newbee.ltd${url}`
            return url
        }
    }
}
// 挂载vue实例
app.mount('#app')