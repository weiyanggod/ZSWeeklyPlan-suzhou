import request from '@/utils/axios'

// 集团总览
export const getOverallApi = () => {
  return request.get('/overall')
}

//  年度风险预警
export const getYearRiskApi = () => {
  return request.get('/yearRisk')
}

// 季度风险预警
export const getQuarterRiskApi = (params) => {
  return request.get('/quarterRisk', params || null)
}

// 季度执行情况
export const getExecutionApi = () => {
  return request.get('/execution')
}

// 收入情况
export const getIncomeApi = () => {
  return request.get('/income')
}
// 收入情况
export const getDeductionPointsApi = () => {
  return request.get('/deductionPoints')
}
