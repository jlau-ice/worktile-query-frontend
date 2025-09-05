import React from 'react'
import { Box, Tabs, Tab } from '@mui/material'

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const UserTabs = ({ users, selectedIndex, onUserClick }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={selectedIndex} onChange={(e, newValue) => onUserClick(users[newValue], newValue)} aria-label="用户列表">
        {users.map((user, index) => (
          <Tab label={user.display_name} key={user.id} {...a11yProps(index)} onClick={() => onUserClick(user, index)} />
        ))}
      </Tabs>
    </Box>
  )
}

export default UserTabs
