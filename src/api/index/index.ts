import request from '@/utils/axios'

// 获取周计划
export const getPlanDataApi = (params) => {
  return request.get('/getPlanData', params)
}
// 更新周计划
export const updatePlanApi = (params) => {
  return request.post('/updatePlan', params)
}
// 删除周计划
export const deletePlanApi = (id) => {
  return request.post(`/deletePlan?id=${id}`)
}

// 获取类型
export const getTypeApi = () => {
  return request.post('/getType')
}

// 获取年列表
export const getYearApi = () => {
  return request.post('/getYear')
}

// 获取周数列表
export const getWeekApi = () => {
  return request.post('/getWeek')
}
