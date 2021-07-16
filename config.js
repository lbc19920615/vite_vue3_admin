const fs = require('fs')
const dotenv = require('dotenv')

let config = {}

/** 读取环境变量文件 */
export function initEnvConfig(mode) {
    const path = fs.existsSync('.env.' + mode) ? '.env.' + mode : 'env'
    const envConfig = dotenv.parse(fs.readFileSync(path))
    config = envConfig
    return config
}

// /** 解析后环境变量 */
// const config = getEnvConfig()
// console.log(config);

export function getEnvConfig() {
    return config
}
