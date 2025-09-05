import React from 'react'
import { Box, TextField, Button } from '@mui/material'

const UserSearch = ({ searchName, onSearchNameChange, onSearch, loading }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
      <TextField
        label="输入姓名进行模糊查询"
        variant="outlined"
        fullWidth
        value={searchName}
        onChange={onSearchNameChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch()
        }}
      />
      <Button variant="contained" onClick={onSearch} disabled={loading}>
        查询
      </Button>
    </Box>
  )
}

export default UserSearch
