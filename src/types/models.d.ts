// 声明 MongoDB ObjectId 类型，如果后端返回的是字符串，可以使用 string
declare namespace API {
  export type ObjectId = {
    _id: string
  }

  export interface ApiResponse<T> {
    code: number
    data?: T
    msg?: string
  }

  // 获取人员列表请求参数类型
  export interface RequestUsersParams {
    name: string
  }

  // User 类型
  export interface User {
    id?: ObjectId
    displayName: string
    uid: string
  }

  // WorkloadEntry 类型
  export interface WorkloadEntry {
    id?: ObjectId
    description?: string
    duration?: number
    createdAt?: number
    updatedAt?: number
    reportedAt?: number
  }

  // 分页数据类型
  export interface PaginatedWorkload {
    data: WorkloadEntry[]
    total: number
    pageSize: number
    pageNumber: number
  }

  // 请求DTO类型
  export interface WorkloadDTO {
    createdBy: string
    uid?: string
    pageSize?: number
    pageNumber?: number
  }
}
