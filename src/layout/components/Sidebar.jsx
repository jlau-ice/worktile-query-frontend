import React from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Toolbar, Box, useTheme, useMediaQuery } from '@mui/material'
import { Home as HomeIcon, QueryStats as QueryStatsIcon, Settings as SettingsIcon, People as PeopleIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 240

const menuItems = [
  { text: '首页', icon: <HomeIcon />, path: '/' },
  { text: '工时查询', icon: <QueryStatsIcon />, path: '/workload' },
  { text: '人员管理', icon: <PeopleIcon />, path: '/users' },
  { text: '系统设置', icon: <SettingsIcon />, path: '/settings' },
]

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleMenuClick = (path) => {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

  const drawerContent = (
    <Box>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Box>
  )

  return (
    <>
      {/* 移动端临时侧边栏 */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}>
        {drawerContent}
      </Drawer>

      {/* 桌面端永久侧边栏 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open>
        {drawerContent}
      </Drawer>
    </>
  )
}

export default Sidebar
