import { Base64 } from 'js-base64'

/**
 * 是否登入
 */
export const isLogin = () => {
  if (!getStorage('erptoken')) return window.location.href = '/login.html'
}

/**
 * 获取key的value
 * @param {string} key
 */
export const getStorage = key => {
  const value = window.localStorage.getItem(key) ?? ''
  return Base64.decode(value)
}

/**
 * 获取localStorage中的登录用户信息
 */
export const getUserInfo = () => {
  return {
    erploginName: getStorage('erploginName'),
    erpname: getStorage('erpname'),
    erptoken: getStorage('erptoken'),
    job: getStorage('job'),
  }
}

/**
 * 获取缓存中的导航
 */
export const getMenuTree = () => {
  const nav = window.localStorage.getItem('nav') ?? '[]'
  return JSON.parse(nav)
}

/**
 * 处理异步错误
 * @param {Promise} promise 
 */
export const To = promise => promise.then(res => [null, res]).catch(err => [err])