// 在其他文件中使用
import request from '../utils/request'

export const getUsers = () => {
  request.get('/users').then((res) => {
    console.log(res)
  })
}
