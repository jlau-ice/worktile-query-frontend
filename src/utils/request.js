import axios from 'axios'
// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // 根据实际情况修改
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可在此处添加 token 或其他全局请求处理
    // config.headers.Authorization = 'Bearer ' + token;
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 全局响应处理
    return response.data
  },
  (error) => {
    // 全局错误处理
    // 可以根据 error.response.status 做不同处理
    return Promise.reject(error)
  }
)

export default service
