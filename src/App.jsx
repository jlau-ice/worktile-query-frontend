import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material'
import UserSearch from './components/UserSearch'
import UserTabs from './components/UserTabs'
import WorkloadTable from './components/WorkloadTable'

function App() {
  const [searchName, setSearchName] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [workload, setWorkload] = useState([])
  const [tabIndex, setTabIndex] = useState(0)
  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setUsers([])
    setSelectedUser(null)
    setWorkload([])
    try {
      const response = await axios.get(`http://127.0.0.1:1323/api/users?name=${searchName}`)
      setUsers(response.data)
      if (response.data.length > 0) {
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

  // 当 selectedUser 变化时，获取其工时数据
  useEffect(() => {
    if (!selectedUser) return
    const fetchWorkload = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`http://127.0.0.1:1323/api/workload/${selectedUser.id}`)
        setWorkload(response.data)
      } catch (err) {
        setError('查询工时失败，请检查后端服务')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchWorkload()
  }, [selectedUser])

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
      <WorkloadTable selectedUser={selectedUser} workload={workload} />
    </Container>
  )
}

export default App
