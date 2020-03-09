import React from 'react'
import { Spin } from 'antd'

export default ({ spinning = true }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin spinning={spinning} />
    </div >
  )
}