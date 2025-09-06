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

const WorkloadTable = ({ 
  selectedUser, 
  workload, 
  totalCount = 0, 
  currentPage = 0,
  pageSize = 10,
  onPageChange, 
  onPageSizeChange 
}) => {
  const [pageInput, setPageInput] = useState('')
  const [isPageInputOpen, setIsPageInputOpen] = useState(false)

  if (!selectedUser) {
    return null
  }

  const handleChangePage = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10)
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize)
    }
  }

  // 处理页面跳转输入
  const handlePageInputChange = (event) => {
    setPageInput(event.target.value)
  }

  const handlePageInputSubmit = () => {
    const targetPage = parseInt(pageInput, 10) - 1 // 用户输入从1开始，内部从0开始
    const maxPage = Math.ceil(totalCount / pageSize) - 1
    
    if (targetPage >= 0 && targetPage <= maxPage) {
      if (onPageChange) {
        onPageChange(targetPage)
      }
      setIsPageInputOpen(false)
      setPageInput('')
    } else {
      alert(`请输入1到${maxPage + 1}之间的页码`)
    }
  }

  const handlePageInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      handlePageInputSubmit()
    } else if (event.key === 'Escape') {
      setIsPageInputOpen(false)
      setPageInput('')
    }
  }

  // 直接显示workload数据，不再进行客户端分页
  const currentPageData = workload

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
              value={pageSize}
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
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
        <TablePagination
          component="div"
          count={totalCount || workload.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
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
        
        {/* 页面跳转输入框 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Typography variant="body2" color="text.secondary">
            跳转到:
          </Typography>
          {isPageInputOpen ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyPress={handlePageInputKeyPress}
                placeholder="页码"
                style={{
                  width: '60px',
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                autoFocus
              />
              <button
                onClick={handlePageInputSubmit}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                确定
              </button>
              <button
                onClick={() => {
                  setIsPageInputOpen(false)
                  setPageInput('')
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                取消
              </button>
            </Box>
          ) : (
            <button
              onClick={() => setIsPageInputOpen(true)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              跳转
            </button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default WorkloadTable
