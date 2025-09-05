// 在其他文件中使用
import request from '../utils/request'

request.get('/users').then((res) => {
  console.log(res)
})
