import { defineStore } from 'pinia'
import { getCart } from '@/service/cart.js'

export const useCartStore = defineStore('cart', {
    state: () => {
        return {
            count: 0
        }
    },
    actions: {
        async updateCart() {
            const { data = [] } = await getCart()
            this.count = data.length
        }
    }
})