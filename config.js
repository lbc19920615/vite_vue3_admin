const fs = require('fs')
const dotenv = require('dotenv')

/** 读取环境变量文件 */
function getEnvConfig() {
    const path = fs.existsSync('.env.local') ? '.env.local' : 'env'
    const envConfig = dotenv.parse(fs.readFileSync(path))
    return envConfig
}

// /** 解析后环境变量 */
const config = getEnvConfig()
// console.log(config);

export default config
