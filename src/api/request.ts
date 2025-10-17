import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ApiResponse } from '../types/result'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 全局请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    const { data } = response
    console.log('API Response:', response) // 添加日志以便调试
    
    // 检查是否有code字段，如果有且不为200则抛出错误
    if (data && typeof data === 'object' && 'code' in data && data.code !== 200) {
      return Promise.reject(new Error(data.msg || 'API请求失败'))
    }
    
    // 如果没有code字段，直接返回data
    return data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    console.error('API Error:', error) // 添加错误日志
    return Promise.reject(error)
  }
)

export default request
