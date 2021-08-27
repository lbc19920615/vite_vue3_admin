import { ElMessage } from 'element-plus'


export function showMsgError(msg = '') {
  ElMessage.Message({
    message: msg,
    type: 'error',
    duration: 5 * 1000
  })
}
