import React, { useState } from 'react'
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

const drawerWidth = 240

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
    useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header onMenuClick={handleDrawerToggle} />
            <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    mt: '64px',
                }}>
                <Outlet />
            </Box>
        </Box>
    )
}


export default Layout
