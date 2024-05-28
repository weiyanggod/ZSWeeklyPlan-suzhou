<template>
  <div class="page">
    <!-- 标题 -->
    <div class="title">
      <img class="title-img" src="@/assets/img/头部.png" />
      <div class="yearSelect">
        <el-select
          v-model="year"
          :teleported="false"
          placeholder="Select"
          size="default"
          @change="changeYear"
        >
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <!-- 内容区块 -->
    <div v-loading="loading" class="content">
      <!-- 头部集团列表 -->
      <div class="headerList">
        <div
          v-for="(item, index) in groupList"
          :key="index"
          class="headerList-item"
        >
          <div class="headerList-item-box">
            <div class="headerList-item-box-title">
              <div class="headerList-item-box-title-text title-font-family">
                {{ item.name }}
              </div>
            </div>
            <div class="headerList-item-box-content">
              <div class="headerList-item-box-content-item">
                <el-statistic :value="item.numberList[0]" :precision="2">
                  <template #title>
                    <div class="headerList-item-box-content-item-title">
                      预算总额(万元)
                    </div>
                  </template>
                  <!-- <template #suffix>
                    <i
                      class="headerList-item-box-content-item-title"
                      style="font-style: normal"
                    >
                      万元
                    </i>
                  </template> -->
                </el-statistic>
              </div>
              <div class="headerList-item-box-content-item">
                <el-statistic
                  :value="item.numberList[1]"
                  value-style="color: #FF6000;"
                  :precision="2"
                >
                  <template #title>
                    <div class="headerList-item-box-content-item-title">
                      已执行(%)
                    </div>
                  </template>
                  <!-- <template #suffix>
                    <i
                      class="headerList-item-box-content-item-title"
                      style="color: #ff6000"
                    >
                      %
                    </i>
                  </template> -->
                </el-statistic>
              </div>
              <div class="headerList-item-box-content-item">
                <el-statistic :value="item.numberList[2]" :precision="2">
                  <template #title>
                    <div class="headerList-item-box-content-item-title">
                      执行(万元)
                    </div>
                  </template>
                  <!-- <template #suffix>
                    <i
                      class="headerList-item-box-content-item-title"
                      style="font-style: normal"
                    >
                      万元
                    </i>
                  </template> -->
                </el-statistic>
              </div>
              <div class="headerList-item-box-content-item">
                <el-statistic :value="item.numberList[3]" :precision="2">
                  <template #title>
                    <div class="headerList-item-box-content-item-title">
                      超额(万元)
                    </div>
                  </template>
                  <!-- <template #suffix>
                    <i
                      class="headerList-item-box-content-item-title"
                      style="font-style: normal"
                    >
                      万元
                    </i>
                  </template> -->
                </el-statistic>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 左侧风险预警 -->
      <div class="riskWarning">
        <div class="riskWarning-box">
          <div class="riskWarning-box-title">
            <img
              class="riskWarning-box-title-img"
              src="@/assets/img/标题装饰.png"
            />
            <div class="riskWarning-box-title-text">风险预警</div>
            <div
              class="riskWarning-box-title-button"
              :class="{
                'riskWarning-active': riskWarningActiveText === '年度',
              }"
              @click="changeRiskWarnQuarter('年度')"
            >
              年度
            </div>
            <div
              style="margin-left: 10px"
              class="riskWarning-box-title-button"
              :class="{
                'riskWarning-active': riskWarningActiveText === '季度',
              }"
              @click="changeRiskWarnQuarter('季度')"
            >
              季度
            </div>
          </div>
          <div v-loading="riskWarningLoading" class="riskWarning-box-content">
            <div
              v-for="(item, index) in riskWarningList"
              :key="index"
              class="riskWarning-box-content-item"
            >
              <div class="riskWarning-box-content-item-title">
                {{ item.name }}
              </div>
              <div class="riskWarning-box-content-item-number">
                <el-statistic
                  :value="TransitionRiskWarningNumberList[index]"
                  :value-style="{
                    fontSize: '25px',
                    color:
                      TransitionRiskWarningNumberList[index] > 0
                        ? '#ff6000'
                        : '',
                  }"
                >
                  <template #suffix>
                    <div class="riskWarning-box-content-item-number-text">
                      项超额
                    </div>
                  </template>
                </el-statistic>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 中间季度执行情况 -->
      <div class="quarter">
        <div class="quarter-box">
          <div class="quarter-box-title">
            <img
              class="quarter-box-title-img"
              src="@/assets/img/标题装饰.png"
            />
            <div class="quarter-box-title-text">
              <div>季度执行情况</div>
            </div>
          </div>
          <div class="quarter-box-button">
            <div
              v-for="(item, index) in quarterList"
              :key="index"
              class="item"
              :class="{ active: newQuarter === index + 1 }"
              style="margin-left: 10px"
              @click="changeQuarter(index + 1)"
            >
              {{ item.name }}
            </div>
          </div>
          <div v-loading="quarterLoading" class="quarter-box-content">
            <chart
              ref="quarterChartsOptionRef"
              :chart-style="{ flex: 1 }"
              :option="quarterChartsOption"
            ></chart>
          </div>
        </div>
      </div>
      <!-- 右侧收入和主体扣分情况 -->
      <div class="rightContent">
        <!-- 收入 -->
        <div class="income">
          <div class="income-box">
            <div class="income-box-title">
              <img
                class="income-box-title-img"
                src="@/assets/img/标题装饰.png"
              />
              <div class="income-box-title-text">收入情况</div>
            </div>
            <div class="income-box-content">
              <chart
                ref="incomeChartRef"
                :chart-style="{ flex: 1 }"
                :option="incomeChartsOption"
              ></chart>
            </div>
          </div>
        </div>
        <!-- 主体扣分 -->
        <div class="subject">
          <div class="subject-box">
            <div class="subject-box-title">
              <img
                class="subject-box-title-img"
                src="@/assets/img/标题装饰.png"
              />
              <div class="subject-box-title-text">主体扣分情况</div>
            </div>
            <div class="subject-box-content">
              <chart
                ref="subjectChartsOptionRef"
                :chart-style="{ flex: 1 }"
                :option="subjectChartsOption"
              ></chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getYearApi,
  getOverallApi,
  getYearRiskApi,
  getQuarterRiskApi,
  getExecutionApi,
  getIncomeApi,
  getDeductionPointsApi,
} from '@/api/index/index'
import { useStore } from '@/stores/store'
import Chart from '@/components/Chart/Chart.vue'
import { ref, reactive } from 'vue'
import { useTransition } from '@vueuse/core'

// 换算方法
const nowSize = (val) => {
  //当前视口宽度
  let nowClientWidth = document.documentElement.clientWidth

  return val * (nowClientWidth / 1920)
}

// 数字转换
const toNumber = (number, divisor, multiplier) => {
  if (typeof Number(number) !== 'number') {
    return 0
  }
  if (divisor) {
    number = Number(number) / divisor
  }
  if (multiplier) {
    number = Number(number) * multiplier
  }
  if (multiplier && divisor) {
    number = (Number(number) * multiplier) / divisor
  }
  number = Number(Number(number).toFixed(2))
  return number
}

const loading = ref(false)

// 年度
const year = ref('2024')
const store = useStore()
store.year = year

// 年度筛选列表
const yearList = ref([
  {
    value: '2024',
    label: '2024年',
  },
  {
    value: '2023',
    label: '2023年',
  },
])

const getYear = () => {
  getYearApi().then(({ data, code }) => {
    if (code === 200) {
      yearList.value = data
    }
  })
}

// 年度改变
const changeYear = (val) => {
  year.value = val
  render()
}

// 年度季度选择
const riskWarningActiveText = ref('年度')

// 各集团数字列表和数字滚动列表
const MLNumberList = ref([0, 0, 0, 0])
const TransitionMLNumberList = useTransition(MLNumberList)

const SHNumberList = ref([0, 0, 0, 0])
const TransitionSHNumberList = useTransition(SHNumberList)

const JTNumberList = ref([0, 0, 0, 0])
const TransitionJTNumberList = useTransition(JTNumberList)

const WCNumberList = ref([0, 0, 0, 0])
const TransitionWCNumberList = useTransition(WCNumberList)

const LHNumberList = ref([0, 0, 0, 0])
const TransitionLHNumberList = useTransition(LHNumberList)

// 集团列表数据
let groupList = ref([
  {
    name: '梅里集团',
    numberList: TransitionMLNumberList,
  },
  {
    name: '盛洪集团',
    numberList: TransitionSHNumberList,
  },
  {
    name: '嘉塍集团',
    numberList: TransitionJTNumberList,
  },
  {
    name: '闻川集团',
    numberList: TransitionWCNumberList,
  },
  {
    name: '麟湖集团',
    numberList: TransitionLHNumberList,
  },
])
// 获取集团列表数据
const getOverall = () => {
  // 获取集团列表数据
  getOverallApi().then(({ data, code }) => {
    if (code === 200) {
      MLNumberList.value = []
      WCNumberList.value = []
      SHNumberList.value = []
      JTNumberList.value = []
      LHNumberList.value = []
      data.forEach((i) => {
        if (i.zt === '梅里集团') {
          MLNumberList.value.push(
            toNumber(i.ysze),
            toNumber(i.yzx, null, 100),
            toNumber(i.zxys),
            toNumber(i.ce) > 0 ? toNumber(i.ce) : 0,
          )
        }
        if (i.zt === '盛洪集团') {
          SHNumberList.value.push(
            toNumber(i.ysze),
            toNumber(i.yzx, null, 100),
            toNumber(i.zxys),
            toNumber(i.ce) > 0 ? toNumber(i.ce) : 0,
          )
        }
        if (i.zt === '嘉塍集团') {
          JTNumberList.value.push(
            toNumber(i.ysze),
            toNumber(i.yzx, null, 100),
            toNumber(i.zxys),
            toNumber(i.ce) > 0 ? toNumber(i.ce) : 0,
          )
        }
        if (i.zt === '闻川集团') {
          WCNumberList.value.push(
            toNumber(i.ysze),
            toNumber(i.yzx, null, 100),
            toNumber(i.zxys),
            toNumber(i.ce) > 0 ? toNumber(i.ce) : 0,
          )
        }
        if (i.zt === '麟湖集团') {
          LHNumberList.value.push(
            toNumber(i.ysze),
            toNumber(i.yzx, null, 100),
            toNumber(i.zxys),
            toNumber(i.ce) > 0 ? toNumber(i.ce) : 0,
          )
        }
      })
    }
  })
}

// 风险数字列表
const riskWarningNumberList = ref([0, 0, 0, 0, 0])
const TransitionRiskWarningNumberList = useTransition(riskWarningNumberList)

// 风险数据
const riskWarningList = ref([
  {
    name: '梅里集团',
    number: riskWarningNumberList.value[0],
  },
  {
    name: '盛洪集团',
    number: riskWarningNumberList.value[1],
  },
  {
    name: '嘉塍集团',
    number: riskWarningNumberList.value[2],
  },
  {
    name: '闻川集团',
    number: riskWarningNumberList.value[3],
  },
  {
    name: '麟湖集团',
    number: riskWarningNumberList.value[4],
  },
])

const riskWarningLoading = ref(false)

// 获取风险预警数据
const getRisk = async (name) => {
  riskWarningLoading.value = true
  let dataVal = null
  let codeVal = null
  if (name === '年度') {
    const { data, code } = await getYearRiskApi()
    dataVal = data
    codeVal = code
  } else if (name === '季度') {
    const today = new Date()
    const quarter = Math.floor(today.getMonth() / 3) + 1

    const { data, code } = await getQuarterRiskApi({ quarter })
    dataVal = data
    codeVal = code
  }
  riskWarningNumberList.value = riskWarningNumberList.value.map((i) => (i = 0))
  if (codeVal === 200) {
    dataVal.forEach((i) => {
      const temp = ['梅里集团', '盛洪集团', '嘉塍集团', '闻川集团', '麟湖集团']
      const index = temp.findIndex((item) => item === i.zt)
      for (const k in i) {
        if (k !== 'ysnd' && k !== 'zt') {
          if (toNumber(i[k]) < 0) {
            riskWarningNumberList.value[index] += 1
          }
        }
      }
    })
  }
  riskWarningLoading.value = false
}

// 风险预警年度季度更改
const changeRiskWarnQuarter = (name) => {
  riskWarningActiveText.value = name
  getRisk(name)
}

// 当前选择季度
const newQuarter = ref(1)
const quarterChartsOptionRef = ref()
const quarterLoading = ref(false)
// 季度执行情况季度更改
const changeQuarter = (index) => {
  newQuarter.value = index
  getExecution(index)
}

// 季度图表配置
const quarterChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
    formatter: (params) => {
      let relVal = params[0].name + '</br>'
      let unit = '万元'

      for (var i = 0, l = params.length; i < l; i++) {
        i === 2 ? (unit = '%') : (unit = '万元')
        relVal +=
          params[i].marker +
          params[i].seriesName +
          ' : ' +
          params[i].value.toLocaleString() +
          unit +
          '<br/>'
      }
      return relVal
    },
  },
  legend: {
    data: ['预算总额', '预算执行', '执行率'],
  },
  xAxis: [
    {
      type: 'category',
      data: ['梅里', '盛洪', '嘉塍', '闻川', '麟湖'],
      axisPointer: {
        type: 'shadow',
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(232, 232, 232, 1)',
        },
      },
      axisLabel: {
        color: 'rgba(141, 141, 141, 1)',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: '万元',
      nameTextStyle: {
        color: 'rgba(141, 141, 141, 1)',
        align: 'right',
        padding: [0, 8, 0, 0],
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(232, 232, 232, 1)',
        },
      },
      axisLabel: {
        color: 'rgba(141, 141, 141, 1)',
      },
    },
    {
      type: 'value',
      name: '%',
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(232, 232, 232, 1)',
        },
      },
      axisLabel: {
        color: 'rgba(141, 141, 141, 1)',
      },
      nameTextStyle: {
        color: 'rgba(141, 141, 141, 1)',
        align: 'left',
        padding: [0, 0, 0, 8],
      },
    },
  ],
  grid: {
    top: 60,
    left: 60,
    right: 30,
    bottom: 20,
  },
  series: [
    {
      name: '预算总额',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml'
        },
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(135, 139, 142, 1)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 1) ', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      data: [],
    },
    {
      name: '预算执行',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml'
        },
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(247, 106, 49, 1)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 1) ', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      data: [],
    },
    {
      name: '执行率',
      type: 'line',
      yAxisIndex: 1,
      symbolSize: 10,
      tooltip: {
        valueFormatter: function (value) {
          return value + ''
        },
      },
      lineStyle: {
        color: 'rgba(194, 196, 198, 1)',
      },
      itemStyle: {
        color: 'rgba(255, 96, 0, 1)',
      },
      data: [],
    },
  ],
}

// 季度名称列表
const quarterList = ref([
  {
    name: '一季度',
    chartOption: null,
  },
  {
    name: '二季度',
    chartOption: null,
  },
  {
    name: '三季度',
    chartOption: null,
  },
  {
    name: '四季度',
    chartOption: null,
  },
])

// 获取季度执行情况数据
const getExecution = (index) => {
  quarterLoading.value = true
  getExecutionApi().then(({ data, code }) => {
    if (code === 200) {
      quarterChartsOption.series[0].data = []
      quarterChartsOption.series[1].data = []
      quarterChartsOption.series[2].data = []
      const arr = data.filter((i) => i.quarter === String(index))
      arr.forEach((i) => {
        quarterChartsOption.series[0].data.push(toNumber(i.jdysze))
        quarterChartsOption.series[1].data.push(toNumber(i.jdzxys))
        quarterChartsOption.series[2].data.push(toNumber(Number(i.zxl) * 100))
      })
      quarterChartsOptionRef.value.render(quarterChartsOption)
      quarterLoading.value = false
    }
  })
}

const incomeChartRef = ref()
// 收入情况数据
const incomeData = ref([])

// 收入情况图表配置
const incomeChartsOption = {
  backgroundColor: '#fff',
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      return (
        params.marker +
        params.name +
        ' : ' +
        params.value.toLocaleString() +
        '万元' +
        '<br/>'
      )
    },
  },
  grid: {
    left: 0,
  },
  legend: {
    orient: 'vertical',
    right: '8%',
    top: 'middle',
    itemGap: 10,
    bottom: 'middle',
    textStyle: {
      height: 15,
      verticalAlign: 'middle',
      rich: {
        name: {
          fontFamily: ' Alibaba PuHuiTi',
          fontWeight: '400',
          fontSize: '14px',
          color: '#8D8D8D',
        },
      },
    },
  },
  series: [
    // 边框阴影圆
    {
      radius: ['0%', '90%'],
      center: ['50%', '50%'],
      hoverAnimation: false,
      silent: true,
      type: 'pie',
      itemStyle: {
        normal: {
          color: '#f8f7f6',
        },
      },
      labelLine: {
        show: false,
      },
      label: {
        show: false,
      },
      data: [
        {
          value: 1,
        },
      ],
      right: '40%',
    },
    // 数据圆
    {
      name: '收入',
      type: 'pie',
      radius: ['65%', '80%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: true,
          position: 'center',
          formatter() {
            return (
              '{income|总收入}' +
              '\n\r' +
              '{number|' +
              toNumber(incomeTotal).toLocaleString() +
              '}' +
              '\n\r' +
              '{unit|万元}'
            )
          },
          rich: {
            income: {
              fontSize: 14,
              color: '#3D3D3D',
              fontWeight: 400,
            },
            number: {
              fontSize: 15,
              fontWeight: 'bold',
              fontFamily: 'D-DIN-Bold',
              color: '#3D3D3D',
              padding: 5,
            },
            unit: {
              fontSize: 14,
              color: '#8D8D8D',
            },
          },
          emphasis: {
            //中间文字显示
            show: true,
          },
        },
      },

      labelLine: {
        normal: {
          show: false,
        },
      },
      itemStyle: {
        borderWidth: 5, //设置border的宽度有多大
        borderColor: '#fff',
      },
      data: incomeData.value,
      right: '40%',
    },
    // 内部圆
    {
      radius: ['0%', '50%'],
      center: ['50%', '50%'],
      hoverAnimation: false,
      silent: true,
      type: 'pie',
      itemStyle: {
        normal: {
          color: '#f1ebe3',
        },
      },
      labelLine: {
        show: false,
      },
      label: {
        show: false,
      },
      data: [
        {
          value: 1,
        },
      ],
      right: '40%',
    },
  ],
  color: ['#e1d6c7', '#b7bcca', '#d66a28', '#b99767', '#707788'],
}

// 设置收入情况图例文本样式
groupList.value.forEach((i, index) => {
  incomeChartsOption.legend.textStyle.rich['number' + index] = {
    fontFamily: 'D-DIN',
    fontWeight: 'bold',
    fontSize: '14px',
    color: incomeChartsOption.color[index],
  }
})

// 收入情况总数
let incomeTotal = reactive(0)

// 获取收入情况数据并配置
const getIncome = () => {
  getIncomeApi().then(({ data, code }) => {
    if (code === 200) {
      const arr = data.sort((star, next) => {
        const sortList = [
          '梅里集团',
          '盛洪集团',
          '嘉塍集团',
          '闻川集团',
          '麟湖集团',
        ]
        return sortList.indexOf(star.name) - sortList.indexOf(next.name)
      })
      arr.forEach((i) => {
        delete i.year

        i.value = toNumber(Number(i.value))
      })
      incomeData.value = arr
      incomeChartsOption.series[1].data = arr
      incomeChartsOption.legend.formatter = (name) => {
        incomeTotal = 0
        if (incomeData.value.length > 0) {
          const val = incomeData.value.find((i) => {
            return i.name === name
          })
          incomeData.value.forEach((i) => {
            incomeTotal += i.value
          })
          const index = groupList.value.findIndex((i) => i.name === name)
          const number = ((val.value / incomeTotal) * 100).toFixed(0)
          return (
            '{name|' +
            val.name +
            '}' +
            '  ' +
            `{number${index}|` +
            number +
            '%' +
            '}'
          )
        }
      }
      incomeChartRef.value.render(incomeChartsOption)
    }
  })
}

// 主体扣分情况图表配置
const subjectChartsOption = {
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      let relVal = params[0].name + '</br>'
      for (var i = 0, l = params.length; i < l; i++) {
        relVal +=
          params[i].marker +
          params[i].seriesName +
          ' : ' +
          params[i].value +
          '分' +
          '<br/>'
      }
      return relVal
    },
  },
  legend: {
    top: '5%',
    data: ['一季度', '二季度', '三季度', '四季度'],
  },
  grid: {
    top: '20%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(232, 232, 232, 1)',
      },
    },
    axisLabel: {
      color: 'rgba(141, 141, 141, 1)',
    },
    data: ['梅里', '盛洪', '嘉塍', '闻川', '麟湖'],
  },
  yAxis: {
    type: 'value',
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(232, 232, 232, 1)',
      },
    },
    axisLabel: {
      color: 'rgba(141, 141, 141, 1)',
    },
    nameTextStyle: {
      color: 'rgba(141, 141, 141, 1)',
    },
  },
  series: [
    {
      name: '一季度',
      type: 'line',
      symbol: 'none',
      stack: 'Total',
      data: [],
      itemStyle: {
        color: 'rgba(149, 152, 155, 1)',
      },
    },
    {
      name: '二季度',
      type: 'line',
      symbol: 'none',
      stack: 'Total',
      data: [],
      itemStyle: {
        color: 'rgba(226, 150, 103, 1)',
      },
    },
    {
      name: '三季度',
      type: 'line',
      symbol: 'none',
      stack: 'Total',
      data: [],
      itemStyle: {
        color: 'rgba(77, 96, 141, 1)',
      },
    },
    {
      name: '四季度',
      type: 'line',
      symbol: 'none',
      stack: 'Total',
      data: [],
      itemStyle: {
        color: 'rgba(185, 151, 103, 1)',
      },
    },
  ],
}

// 主体扣分情况数据
const subjectChartsOptionRef = ref('')

// 主体数据获取
const getDeductionPoints = () => {
  getDeductionPointsApi().then(({ data, code }) => {
    if (code === 200) {
      subjectChartsOption.series.forEach((i) => {
        i.data = []
      })
      const arr = ['1', '2', '3', '4']
      arr.forEach((i, index) => {
        const temp = data.filter((item) => item.quarter === i)
        temp.forEach((i) => {
          subjectChartsOption.series[index].data.push(toNumber(i.point))
        })
        subjectChartsOptionRef.value.render(subjectChartsOption)
      })
    }
  })
}

const render = async () => {
  loading.value = true
  await getYear()
  await getOverall()
  await getRisk('年度')
  await getExecution(1)
  await getIncome()
  await getDeductionPoints()
  loading.value = false
}
render()
</script>

<style lang="less" scoped>
.icon-zuojiantou:before {
  font-size: 25px !important;
}
.page {
  position: relative;
  display: flex;
  flex-flow: column;

  .title {
    position: relative;
    width: 100%;
    height: 1024px;
    &-img {
      width: 100%;
      height: 100%;
    }
    .yearSelect {
      position: absolute;
      top: 40%;
      left: 4%;
      border: 0;
      margin-top: 30px;
    }
  }
  .content {
    box-sizing: border-box;
    position: absolute;
    top: 640px;
    width: 100%;
    background: linear-gradient(0deg, #fff7e8 0%, #fffcf6 100%);
    border-radius: 102px 102px 0px 0px;
    padding: 0 51px 0 51px;
  }
  .headerList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    &-item {
      width: 100%;
      padding-left: 50px;
      box-sizing: border-box;
      border-radius: 10px;
      margin-top: 50px;
      &-box {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        padding: 5px 0 5px 15px;
        padding-left: 50px;
        &-title {
          position: relative;
          display: flex;
          align-items: center;
          &-text {
            font-weight: 400;
            font-size: 77px;
            color: #3d3d3d;
            font-style: italic;
          }
          &-text::after {
            content: '';
            width: 23px;
            height: 77px;
            position: absolute;
            top: 20px;
            left: -50px;
            background: rgba(255, 96, 0, 1);
          }
        }
        &-content {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          margin-top: 80px;
          &-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 25%;
            &-title {
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              font-size: 51px;
              color: #8d8d8d;
            }
            &-number {
              font-family: D-DIN-Bold;
              font-weight: bold;
              font-size: 24px;
              color: #3d3d3d;
              vertical-align: bottom;
            }
            .executed-text {
              font-size: 41px;
              color: #8d8d8d;
            }
            .executed-number {
              font-weight: bold;
              font-weight: bold;
              font-size: 77px;
              color: #ff6000;
            }
          }
        }
      }
    }
  }
  .riskWarning,
  .quarter,
  .income,
  .subject {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 80px;
    background-color: #fff;
    border-radius: 51px;
    &-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 50px;
      &-title {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px 21px 10px 24px;
        border-radius: 10px 10px 0 0;
        border: 0;
        &-img {
          width: 82px;
          height: 41px;
          margin-right: 10px;
        }
        &-text {
          font-family: 迷你简汉真广标;
          font-weight: 400;
          font-size: 77px;
          color: #3d3d3d;
          font-style: italic;
        }
        &-button {
          cursor: pointer;
          width: 269px;
          height: 96px;
          background-color: #cfcfcf;
          font-family: 迷你简汉真广标;
          font-weight: 400;
          font-size: 61px;
          color: #3d3d3d;
          text-align: center;
          align-items: center;
          line-height: 96px;
          margin-left: auto;
        }
      }
      &-content {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        padding: 18px 73px 0 100px;
        &-item {
          width: 50%;
          display: flex;
          flex-direction: column;
          margin-top: 100px;
          height: 20%;
          &-title {
            position: relative;
            font-family: 迷你简汉真广标;
            font-weight: 400;
            font-size: 51px;
            color: #3d3d3d;
            font-style: italic;
          }
          &-title::after {
            content: '';
            width: 15px;
            height: 51px;
            position: absolute;
            top: 10px;
            left: -40px;
            background: rgba(255, 96, 0, 1);
          }
          &-number {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 100px;
            &-text {
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              font-size: 41px;
              color: #8d8d8d;
              margin-left: 20px;
            }
          }
        }
      }
    }
    &-active {
      color: #ff6000;
      background: #ffdfcc;
    }
  }
  .quarter {
    width: 100%;
    height: 1500px;
    border-radius: 51px;

    &-box {
      &-button {
        display: flex;
        padding-left: 10%;
        .item {
          margin-top: 80px;
          cursor: pointer;
          width: 14.01042vw;
          height: 5vw;
          background-color: #cfcfcf;
          font-family: 迷你简汉真广标;
          font-weight: 400;
          font-size: 3.17708vw;
          color: #3d3d3d;
          text-align: center;
          align-items: center;
          line-height: 5vw;
        }
      }
    }
    &-box-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0;
      margin-top: 100px;
      padding-bottom: 50px;
    }
  }
  .rightContent {
    width: 100%;
    padding-bottom: 100px;
    .income,
    .subject {
      width: 100%;
      height: 1034px;
      &-box {
        &-content {
          padding: 0;
          display: flex;
        }
      }
    }
    .subject {
      margin-top: 100px;
      height: 1178px;
    }
  }
}
.active {
  background: #ffdfcc !important;
  color: #ff6000 !important;
}
:deep(.el-statistic__content) {
  margin-top: 20px;
}
:deep(.el-statistic__number) {
  font-family: D-DIN;
  font-weight: bold;
  font-size: 60px;
  color: #3d3d3d;
}
:deep(.el-statistic__head) {
  margin-bottom: 0;
}
:deep(.el-select__wrapper) {
  background: rgba(255, 96, 0, 0);
  border: 0;
  box-shadow: 0 0 0 0;
  border-radius: 0;
  width: 400px;
}
:deep(.el-select__placeholder) {
  height: 92px;
  text-align: right;
  padding-right: 50px;
}
:deep(.el-select__placeholder),
:deep(.el-select__icon) {
  color: #000;
  line-height: 92px;
  font-size: 92px;
  font-family: 迷你简汉真广标;
}
:deep(.el-popper) {
  min-height: 400px;
}
:deep .el-select-dropdown__item {
  font-size: 50px;
  height: 100px;
  line-height: 100px;
}

:deep .el-select-dropdown {
  font-size: 92px;
}
</style>
