import React from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

// 格式化时间戳的函数
const formatTimestamp = (ts) => {
  if (!ts) return 'N/A'
  const date = new Date(ts * 1000) // Unix时间戳是秒，Date需要毫秒
  return date.toLocaleString()
}

const WorkloadTable = ({ selectedUser, workload }) => {
  if (!selectedUser) {
    return null
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {selectedUser.display_name} 的工时记录
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>工时内容</TableCell>
              <TableCell align="right">时长 (小时)</TableCell>
              <TableCell align="right">创建时间</TableCell>
              <TableCell align="right">更新时间</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workload.length > 0 ? (
              workload.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell component="th" scope="row">
                    {entry.description}
                  </TableCell>
                  <TableCell align="right">{entry.duration}</TableCell>
                  <TableCell align="right">{formatTimestamp(entry.created_at)}</TableCell>
                  <TableCell align="right">{formatTimestamp(entry.updated_at)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  没有找到工时记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default WorkloadTable
