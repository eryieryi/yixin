import axios from '../utils/axios'

export function getCategory() {
    return axios.get('/categories')
}
export function getDetail(id) {
    return axios.get(`/goods/detail/${id}`)
}

export function search(params) {
    return axios.get('/search', { params })
}