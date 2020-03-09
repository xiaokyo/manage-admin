const fs = require('fs')
const chokidar = require('chokidar')
const ROOT_PATH = process.cwd()
const CACHE_PATH = ROOT_PATH + '/src/.cache'

const { writeApisIndex } = require('./genApis')
const { writeRoutersIndex } = require('./genRouters')

/**
 * 生成指定目录
 * @param {string} pathName 文件夹名称
 */
const createCache = (pathName) => {
  if (!fs.existsSync(CACHE_PATH)) fs.mkdirSync(CACHE_PATH)
  if (pathName && !fs.existsSync(`${CACHE_PATH}/${pathName}`)) fs.mkdirSync(`${CACHE_PATH}/${pathName}`)
}
createCache('apis')
createCache('routers')

function debounce(func, wait = 500) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * 监听目标目录下文件变动
 * @param {string} path 监听的目标路径
 * @param {function} fun 有更改后进行的回调
 */
const watchFun = (path, fun) => {
  fun()
  const deFun = debounce(fun)
  if (process.env.NODE_ENV === 'development') {
    const watcher = chokidar.watch(path, {
      ignored: /(^|[\/\\])\../,// ignore dotfiles
      persistent: true,
      // ignoreInitial: true,// 是否忽略文件夹和文件的新增
    })
    watcher.on('change', () => { deFun() })
    watcher.on('unlink', () => { deFun() })
    watcher.on('unlinkDir', () => { deFun() })
  }
}

function AutoGen() { }

AutoGen.prototype.apply = (compiler) => {
  // 指定一个挂载到 webpack 自身的事件钩子。
  compiler.hooks.afterPlugins.tap('AutoGen', (compiler) => {
    watchFun(ROOT_PATH + '/src/apis', writeApisIndex)
    watchFun(ROOT_PATH + '/src/pages', writeRoutersIndex)
  })
}

module.exports = AutoGen