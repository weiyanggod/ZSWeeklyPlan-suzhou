import request from '@/utils/axios'

// 获取周计划
export const getPlanDataApi = (params) => {
  return request.get('/getPlanData', params)
}
// 更新周计划
export const updatePlanApi = () => {
  return request.post('/updatePlan')
}
// 删除周计划
export const deletePlanApi = () => {
  return request.post('/deletePlan')
}

// 获取类型
export const getTypeApi = () => {
  return request.post('/getType')
}

// 保存
export const saveApi = () => {
  return request.post('/PlanDataDto')
}
