import React, { useState, useEffect, useCallback } from 'react'
import { Table, Typography, Card, Input, Button, Space, message } from 'antd'
import { getWorkloadByUid } from '../api/work'

const { Title } = Typography
const { Search } = Input

// 格式化时间戳的函数
const formatTimestamp = (ts) => {
  if (!ts) return 'N/A'
  const date = new Date(ts * 1000) // Unix时间戳是秒，Date需要毫秒
  return date.toLocaleString()
}

const WorkloadTableAntd = ({ selectedUser }) => {
  const [workload, setWorkload] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageInput, setPageInput] = useState('')

  // 获取工时数据的函数
  const fetchWorkload = useCallback(async (page = 1, size = pageSize) => {
    if (!selectedUser) return
    
    setLoading(true)
    try {
      const requestParams = {
        createdBy: selectedUser.uid,
        pageSize: size,
        pageNumber: page,
      }
      console.log('=== API Request ===')
      console.log('User:', selectedUser.uid)
      console.log('Request params:', requestParams)
      console.log('Page type:', typeof page, 'Size type:', typeof size)
      
      const response = await getWorkloadByUid(requestParams)
      console.log('API Response:', response)
      console.log('Response data:', response.data)
      console.log('Total count:', response.data?.total)
      console.log('Data array:', response.data?.data)
      
      setWorkload(response.data?.data || [])
      setTotal(response.data?.total || 0)
    } catch (err) {
      console.error('Workload fetch error:', err)
      message.error(`查询工时失败: ${err.message || '请检查后端服务'}`)
    } finally {
      setLoading(false)
    }
  }, [selectedUser, pageSize])

  // 当 selectedUser 变化时，获取其工时数据
  useEffect(() => {
    if (!selectedUser) {
      setWorkload([])
      setTotal(0)
      return
    }
    setCurrentPage(1) // 重置到第一页
    fetchWorkload(1, pageSize)
  }, [selectedUser, fetchWorkload, pageSize])

  // 分页处理
  const handleTableChange = (pagination) => {
    console.log('Table change:', pagination)
    console.log('Current pagination state:', { currentPage, pageSize })
    console.log('New pagination values:', { 
      newCurrent: pagination.current, 
      newPageSize: pagination.pageSize 
    })
    
    setCurrentPage(pagination.current)
    setPageSize(pagination.pageSize)
    fetchWorkload(pagination.current, pagination.pageSize)
  }

  // 页面跳转处理
  const handlePageJump = () => {
    const targetPage = parseInt(pageInput, 10)
    const maxPage = Math.ceil(total / pageSize)
    
    if (targetPage >= 1 && targetPage <= maxPage) {
      setCurrentPage(targetPage)
      fetchWorkload(targetPage, pageSize)
      setPageInput('')
    } else {
      message.warning(`请输入1到${maxPage}之间的页码`)
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => {
        const page = Number(currentPage) || 1
        const size = Number(pageSize) || 10
        const rowNumber = (page - 1) * size + index + 1
        console.log('Row number calculation:', { 
          currentPage: page, 
          pageSize: size, 
          index, 
          rowNumber,
          calculation: `(${page} - 1) * ${size} + ${index} + 1 = ${rowNumber}`
        })
        return isNaN(rowNumber) ? index + 1 : rowNumber
      },
    },
    {
      title: '工时内容',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || '无描述',
    },
    {
      title: '时长 (小时)',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      align: 'right',
      render: (text) => text || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      align: 'right',
      render: (text) => formatTimestamp(text),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
      align: 'right',
      render: (text) => formatTimestamp(text),
    },
  ]

  if (!selectedUser) {
    return null
  }

  console.log('WorkloadTableAntd render:', { currentPage, pageSize, total, workloadLength: workload.length })

  return (
    <Card style={{ marginTop: 16 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16 
      }}>
        <Title level={4} style={{ margin: 0 }}>
          {selectedUser.display_name} 的工时记录
        </Title>
        <Space>
          <span style={{ color: '#666' }}>
            共 {total} 条记录
          </span>
          <Space.Compact>
            <Input
              placeholder="跳转到页码"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onPressEnter={handlePageJump}
              style={{ width: 120 }}
            />
            <Button onClick={handlePageJump}>
              跳转
            </Button>
          </Space.Compact>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={workload}
        rowKey={(record, index) => record.id || index}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          pageSizeOptions: [5, 10, 20, 50],
          onChange: handleTableChange,
          onShowSizeChange: handleTableChange,
        }}
        scroll={{ x: 800 }}
        size="middle"
      />
    </Card>
  )
}

export default WorkloadTableAntd
