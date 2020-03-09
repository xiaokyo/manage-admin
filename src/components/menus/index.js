import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { Menu, Spin } from 'antd'
import apis from 'apis'
import { getStorage, getMenuTree } from 'utils'

import Loading from 'components/loading'
const { SubMenu } = Menu

/**
 * 三种路由情况  1. #/erppurchase/*  2. review.html  3./react-manage/*
 * 1和2都是angular的路由
 * 3是react的路由
 * @param {菜单对象} item 
 */
function getManageUrl(item) {// 是否manage页面路由
  let url = item.href, isReactRoute = false

  if (item?.href?.startsWith('#/')) url = `/manage.html${item.href}`
  if (item?.href?.endsWith('.html')) url = item.href
  if (item?.href?.startsWith('/react-manage')) {
    isReactRoute = true
    url = item.href.replace('/react-manage', '')
  }

  let jsx = <a className="my-submenu-a" href={url}>{item.menuName}</a>
  if (isReactRoute) jsx = <Link to={url ?? '/'}>{item.menuName}</Link>
  return jsx
}

/**
 * 传什么显示什么
 * @param {图片url} url 
 */
function getIconUrl(url) {// icon
  let res = `/${url}`
  if (!url || url?.length < 5) res = ''
  return res
}

export default props => {
  const { menu, loading } = useMenu([])

  /**
   * 菜单树渲染
   * @param {Array} tree 
   */
  const renderMenu = tree => {
    if (tree?.length <= 0) return null
    return tree?.map((item, index) => {
      if (item?.child?.length > 0) {
        return (
          <SubMenu
            key={item.id}
            title={
              <div>
                <img src={getIconUrl(item.v1)} />
                <span>{getManageUrl(item)}</span>
              </div>
            }
          >
            {renderMenu(item.child)}
          </SubMenu>
        )
      }

      return (
        <Menu.Item key={item.id}>
          {getManageUrl(item)}
        </Menu.Item>
      )
    })
  }

  return (
    <Menu mode="vertical">
      <Loading spinning={loading} />
      {renderMenu(menu)}
    </Menu>
  )
}

/**
 * 管理菜单状态
 */
const useMenu = () => {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(false)

  const getMenu = async () => {
    const localMenu = await getMenuTree()
    if (localMenu && localMenu?.length > 0) return setMenu([...localMenu])
    setLoading(true)
    const [err, res] = await apis.common.getMenuTree({ sysId: 3, userId: getStorage('erpuserId') ?? '' })
    setLoading(false)
    if (err || res.code !== 200) return
    setMenu([...res.data])
  }

  useEffect(() => {
    getMenu()
  }, [])

  return { menu, loading }
}
