import React, { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material'
import UserSearch from '../../components/UserSearch'
import UserTabs from '../../components/UserTabs'
import WorkloadTable from '../../components/WorkloadTable'
import { getUsersByName, getWorkloadByUid } from '../../api/work'

function HomePage() {
  const [searchName, setSearchName] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [workload, setWorkload] = useState([])
  const [tabIndex, setTabIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setUsers([])
    setSelectedUser(null)
    setWorkload([])
    try {
      const response = await getUsersByName({ name: searchName })
      setUsers(response.data || [])
      if (response.data && response.data.length > 0) {
        // 自动选择第一个用户
        setSelectedUser(response.data[0])
        setTabIndex(0)
      }
    } catch (err) {
      setError('查询用户失败，请检查后端服务')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 获取工时数据的函数
  const fetchWorkload = useCallback(async (userId, page = 0, size = pageSize) => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const response = await getWorkloadByUid({
        createdBy: userId,
        pageSize: size,
        pageNumber: page + 1, // 后端从1开始，前端从0开始
      })
      setWorkload(response.data?.data || [])
      setTotalCount(response.data?.total || 0)
    } catch (err) {
      setError('查询工时失败，请检查后端服务')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  // 当 selectedUser 变化时，获取其工时数据
  useEffect(() => {
    if (!selectedUser) return
    fetchWorkload(selectedUser.uid, 0, pageSize)
  }, [selectedUser, fetchWorkload, pageSize])

  // 分页处理函数
  const handlePageChange = (newPage) => {
    if (selectedUser) {
      fetchWorkload(selectedUser.uid, newPage, pageSize)
    }
  }

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize)
    if (selectedUser) {
      fetchWorkload(selectedUser.uid, 0, newPageSize)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        工时查询工具
      </Typography>

      <UserSearch searchName={searchName} onSearchNameChange={(e) => setSearchName(e.target.value)} onSearch={handleSearch} loading={loading} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {users.length > 0 && (
        <UserTabs
          users={users}
          selectedIndex={tabIndex}
          onUserClick={(user, index) => {
            setSelectedUser(user)
            setTabIndex(index)
          }}
        />
      )}
      <WorkloadTable 
        selectedUser={selectedUser} 
        workload={workload}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Container>
  )
}

export default HomePage
