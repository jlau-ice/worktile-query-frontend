import React, {useState, useEffect, useCallback} from 'react'
import {Table, Typography, Card, Input, Button, Space, message} from 'antd'
import {getWorkloadByUid} from '../api/work'

const {Title} = Typography
const {Search} = Input

// 格式化时间戳的函数
const formatTimestamp = (ts) => {
    if (!ts) return 'N/A'
    const date = new Date(ts * 1000) // Unix时间戳是秒，Date需要毫秒
    return date.toLocaleString()
}

const WorkloadTableAntd = ({selectedUser}) => {
    const [workload, setWorkload] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    // 获取工时数据的函数
    const fetchWorkload = useCallback(
        async (page, size) => {
            if (!selectedUser) {
                return
            }
            setLoading(true)
            try {
                const requestParams = {
                    uid: selectedUser.uid,
                    pageSize: size,
                    pageNumber: page,
                }
                const response = await getWorkloadByUid(requestParams)
                setWorkload(response.data?.data || [])
                setTotal(response.data?.total || 0)
            } catch (err) {
                console.error('Workload fetch error:', err)
                message.error(`查询工时失败: ${err.message || '请检查后端服务'}`)
            } finally {
                setLoading(false)
            }
        },
        [selectedUser] // 关键：fetchWorkload只依赖于selectedUser
    )
    // 当 selectedUser 变化时，重置分页并获取数据
    useEffect(() => {
        if (!selectedUser) {
            setWorkload([])
            setTotal(0)
            return
        }
        // 重置到第一页和默认每页条数，并立即发起请求
        const initialPageSize = 10
        setCurrentPage(1)
        setPageSize(initialPageSize)
        fetchWorkload(1, initialPageSize)
    }, [selectedUser, fetchWorkload])
    // 分页处理
    const handleTableChange = useCallback(
        (page, size) => {
            if (page === currentPage && size === pageSize) {
                return
            }
            setCurrentPage(page)
            setPageSize(size)
            fetchWorkload(page, size)
        },
        [fetchWorkload, currentPage, pageSize]
    )

    // 表格列定义
    const columns = [
        {
            title: '序号',
            key: 'index',
            align: 'center',
            width: 80,
            render: (_, __, index) => {
                const rowNumber = (currentPage - 1) * pageSize + index + 1
                return rowNumber
            },
        },
        {
            title: '工时内容',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            render: (text) => text || '无描述',
        },
        {
            title: '时长 (小时)',
            dataIndex: 'duration',
            key: 'duration',
            width: 120,
            align: 'center',
            render: (text) => text || 0,
        },
        {
            title: '工作日期',
            dataIndex: 'reported_at',
            key: 'reported_at',
            width: 180,
            align: 'center',
            render: (text) => formatTimestamp(text),
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            align: 'center',
            render: (text) => formatTimestamp(text),
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: 180,
            align: 'center',
            render: (text) => formatTimestamp(text),
        },
        {
            title: '项目名称',
            dataIndex: 'project_info',
            key: 'project_info',
            width: 180,
            align: 'center',
            render: (projectInfo) => projectInfo?.name || '-',
        },
        {
            title: '任务名称',
            dataIndex: 'task_info',
            key: 'task_info',
            width: 180,
            align: 'center',
            render: (taskInfo) => taskInfo?.title || '-',
        },
    ]

    if (!selectedUser) {
        return null
    }

    return (
        <Card style={{marginTop: 16}}>
            <Table
                columns={columns}
                dataSource={workload}
                rowKey={(record, index) => record.id || index}
                loading={loading}
                bordered
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                    pageSizeOptions: [5, 10, 20, 50],
                    onChange: handleTableChange,
                }}
                scroll={{x: 800}}
                size="middle"
            />
        </Card>
    )
}

export default WorkloadTableAntd
