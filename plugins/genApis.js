const fs = require('fs')
const ROOT_PATH = process.cwd()
const APIS_PATH = ROOT_PATH + '/src/apis'
const CACHE_PATH = ROOT_PATH + '/src/.cache'
const log = text => console.log(`${text}  -------`)
/**
 * 生成apis根目录文件
 */
const readApisFiles = () => {
  let files = fs.readdirSync(APIS_PATH)
  files = files.map(_ => _.replace('.js', ''))

  function getImports() {
    let imports = '', apis = ''

    files.forEach((_, i) => {
      if (_ !== 'index') {
        imports += `import ${_} from '_apis/${_}'\n`
        apis += (i > 0 ? ', ' : '') + _
      }
    })
    return { imports, apis }
  }

  const { imports, apis } = getImports()

  const text = `
import { ApiFn } from 'utils/axios'
${imports}

const APIS = { ${apis} }

export default { ...ApiFn(APIS) }
  `

  return text
}

const writeApisIndex = () => {// 根据工作目录下的 ./src/apis/中的文件生成index.js
  fs.writeFileSync(`${CACHE_PATH}/apis/index.js`, readApisFiles())
  log(`[接口]：更新 ${CACHE_PATH}/apis/index.js 成功`)
}

module.exports = { writeApisIndex }