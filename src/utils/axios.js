import axios from 'axios'
import { getStorage } from './index'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers = { ...config.headers, token: getStorage('erptoken') ?? '' }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么

  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/**请求 */
export const request = params => axios(params).then(res => [null, res.data]).catch(err => [err])

/**
 * 
 * @param {*} params 
 * @param {*} apiPrefix 
 */
const gen = (params, apiPrefix) => {
  let url = ''
  let method = 'GET'
  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    // method = paramsArray[0]
    const [_method, _url] = paramsArray
    method = _method
    url = apiPrefix + _url
  }

  return function (data, queryUrl = '') {
    return request({
      url: url + queryUrl,
      data,
      method,
    })
  }
}
/**
 * 生成接口对象  提供方法
 * @param {object} apis 接口对象
 * @param {string} apiPrefix 接口前缀
 */
export const ApiFn = (apis, apiPrefix = '') => {
  const APIFunction = {}
  for (const key in apis) {
    const subApiFun = {}
    for (const secondKey in apis[key]) {
      subApiFun[secondKey] = gen(apis[key][secondKey], apiPrefix)
    }
    APIFunction[key] = subApiFun
  }
  return APIFunction
}
