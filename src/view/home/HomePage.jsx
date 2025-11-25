import React, { useState } from 'react'
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material'
import UserSearch from '../../components/UserSearch'
import UserTabs from '../../components/UserTabs'
import WorkloadTableAntd from '../../components/WorkloadTableAntd'
import { getUsersByName } from '../../api/work'
import "./home-page.css"
function HomePage() {
  const [searchName, setSearchName] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [tabIndex, setTabIndex] = useState(0)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setUsers([])
    setSelectedUser(null)
    try {
      console.log('Searching for user:', searchName)
      const response = await getUsersByName({ name: searchName })
      console.log('Search response:', response)
      setUsers(response.data || [])
      if (response.data && response.data.length > 0) {
        // 自动选择第一个用户
        setSelectedUser(response.data[0])
        setTabIndex(0)
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(`查询用户失败: ${err.message || '请检查后端服务'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }} className={"container"}>
      <Typography variant="h4" component="h1" gutterBottom>
        工时查询工具
      </Typography>

      <UserSearch 
        searchName={searchName} 
        onSearchNameChange={(e) => setSearchName(e.target.value)} 
        onSearch={handleSearch} 
        loading={loading} 
      />

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
      <WorkloadTableAntd selectedUser={selectedUser} />
    </Container>
  )
}

export default HomePage