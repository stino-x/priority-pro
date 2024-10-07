'use client'
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import useTabState from '@/lib/hooks/useTabState'

export default function Tasktabs() {
  const { activeTab, setActiveTab } = useTabState()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="All" label="All" />
        <Tab value="Verified" label="Verified" />
        <Tab value="Completed" label="Completed" />
        <Tab value="Overdue" label="Overdue" />
      </Tabs>
    </Box>
  )
}