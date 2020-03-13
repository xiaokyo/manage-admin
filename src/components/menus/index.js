import React from 'react'
import { Link } from "react-router-dom"
import { Menu, Spin } from 'antd'

import Nav from './nav.js'

const { SubMenu } = Menu

export default props => {
  /**
   * 菜单树渲染
   * @param {Array} tree 
   */
  const renderMenu = tree => {
    if (tree?.length <= 0) return null
    return tree?.map((item, index) => {

      const IconComponent = item.icon

      if (item?.child?.length > 0) {
        return (
          <SubMenu
            key={item.path}
            title={
              <div>
                {/* <img src={getIconUrl(item.v1)} /> */}
                <IconComponent />
                <span><Link to={item.path}>{item.name}</Link></span>
              </div>
            }
          >
            {renderMenu(item.child)}
          </SubMenu>
        )
      }

      return (
        <Menu.Item key={item.path}>
          <IconComponent />
          <Link to={item.path}>{item.name}</Link>
        </Menu.Item>
      )
    })
  }

  return (
    <Menu mode="vertical">
      {renderMenu(Nav)}
    </Menu>
  )
}
