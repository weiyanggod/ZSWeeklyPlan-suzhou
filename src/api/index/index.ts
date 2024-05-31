import request from '@/utils/axios'

// 年度配置项
export const getYearApi = () => {
  return request.get('/year')
}
