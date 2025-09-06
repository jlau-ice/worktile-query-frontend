import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'

// 格式化时间戳的函数
const formatTimestamp = (ts) => {
  if (!ts) return 'N/A'
  const date = new Date(ts * 1000) // Unix时间戳是秒，Date需要毫秒
  return date.toLocaleString()
}

const WorkloadTable = ({ selectedUser, workload, totalCount = 0, onPageChange, onPageSizeChange }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  if (!selectedUser) {
    return null
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10)
    setRowsPerPage(newPageSize)
    setPage(0) // 重置到第一页
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize)
    }
  }

  // 计算当前页显示的数据
  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentPageData = workload.slice(startIndex, endIndex)

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {selectedUser.display_name} 的工时记录
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            共 {totalCount || workload.length} 条记录
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>每页显示</InputLabel>
            <Select
              value={rowsPerPage}
              label="每页显示"
              onChange={handleChangeRowsPerPage}
            >
              <MenuItem value={5}>5条</MenuItem>
              <MenuItem value={10}>10条</MenuItem>
              <MenuItem value={20}>20条</MenuItem>
              <MenuItem value={50}>50条</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
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
            {currentPageData.length > 0 ? (
              currentPageData.map((entry, index) => (
                <TableRow key={entry.id || index}>
                  <TableCell component="th" scope="row">
                    {entry.description || '无描述'}
                  </TableCell>
                  <TableCell align="right">{entry.duration || 0}</TableCell>
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
      
      <TablePagination
        component="div"
        count={totalCount || workload.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage="每页显示:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} 共 ${count !== -1 ? count : `超过 ${to}`} 条`
        }
        sx={{ 
          borderTop: 1, 
          borderColor: 'divider',
          '& .MuiTablePagination-toolbar': {
            paddingLeft: 0,
            paddingRight: 0
          }
        }}
      />
    </Box>
  )
}

export default WorkloadTable
