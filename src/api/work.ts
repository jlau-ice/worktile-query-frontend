// 在其他文件中使用
import request from './request'
import { ApiResponse } from '../types/result'

export async function getUsersByName(
  params: API.RequestUsersParams,
  options?: { [key: string]: any }
) {
  return request<API.User>('/api/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}



export async function getWorkloadByUid(
    params: API.WorkloadDTO,
    options?: { [key: string]: any }
) {
  return request<API.User>('/api/workload/', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
