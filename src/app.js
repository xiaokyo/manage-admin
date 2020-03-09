import React from 'react'
import { Layout } from 'antd'
import { Switch, Route } from "react-router-dom"

import { getUserInfo, isLogin } from 'utils'

// components
import Menu from 'components/menus'
// routers
import routers from 'routers'
// style
import './app.less'

const userInfo = getUserInfo()
isLogin()

const { Content, Sider } = Layout

export default props => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider id="components-layout-demo-side">
        <div className="logo">
          <img src="/static/image/public-img/erplogo.png" />
          <span>{userInfo?.erploginName ?? '未知'}</span>
        </div>
        <Menu />
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: '100vh' }}>
            <Switch>
              {routers.map((item, index) => <Route key={item.path} path={item.path} exact={item.exact} component={item.component} />)}
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout>
  )

}