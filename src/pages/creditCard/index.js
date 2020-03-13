import React from 'react'
import { getUserInfo } from 'utils'


export default props => {

  return (
    <div>this is list {JSON.stringify(getUserInfo())}</div>
  )
}