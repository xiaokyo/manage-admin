const fs = require('fs')
const ROOT_PATH = process.cwd()
const PAGES_PATH = ROOT_PATH + '/src/pages'
const CACHE_PATH = ROOT_PATH + '/src/.cache'
const log = text => console.log(`${text}  -------`)

/**
 * 生成apis根目录文件
 */
const createRouterIndex = (routers) => {
  const text = `
import Loadable from 'react-loadable'
import Loading from 'components/loading'

//loadable
const loadCp = func => {
  return Loadable({
    loader: func,
    loading: Loading,
  })
}

export default [
  {
    path: '/',
    component: loadCp(() => import('pages/home')),
    exact: true
  },
  ${routers}
  {
    path: '*',
    exact: false,
    component: loadCp(() => import('pages/error')),
  }
]
  `

  return text
}

const writeRoutersIndex = () => {// 根据工作目录下的 ./src/apis/中的文件生成index.js
  fs.writeFileSync(`${CACHE_PATH}/routers/index.js`, createRouterIndex(getRouters()))
  log(`[路由]：更新 ${CACHE_PATH}/routers/index.js 成功`)
}

// 过滤的文件列表
const filterArr = ['components', 'images', 'static', 'error', 'home']

const getRouters = () => {
  let routers = ''
  const addRouters = (route, component) => {
    routers += `
  {
    path: '${route}',
    component: loadCp(() => import('pages${component}')),
    exact: true
  },
    `
  }
  const getDirs = (path, parentPath = '') => {
    const files = fs.readdirSync(path)
    files.forEach(_ => {
      if (!filterArr.includes(_)) {
        const filePath = `${path}/${_}`
        const fileStat = fs.statSync(filePath)
        if (fileStat.isDirectory()) {
          // 是文件夹
          const argsFiles = fs.readdirSync(filePath)
          let components = `${parentPath}/${_}`, route = components.replace(/[\[]/g, ':').replace(/[\]]/g, '')
          // console.log(route)
          const hasIndex = argsFiles.includes('index.js')
          if (_.startsWith(':') && hasIndex) {
            // 有参数且有index.js
            // console.log(route, ':args hasIndex', components)
            addRouters(route, components)
          } else if (hasIndex) {
            // 有index.js
            // console.log(route, 'hasIndex', components)
            addRouters(route, components)
          }
          getDirs(filePath, components)
        }
      }
    })
  }
  getDirs(PAGES_PATH)
  return routers
}

// writeRoutersIndex()

module.exports = { writeRoutersIndex }