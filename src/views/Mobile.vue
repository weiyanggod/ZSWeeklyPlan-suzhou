<template>
  <div class="page">
    <!-- 标题 -->
    <div class="title">
      <img class="title-img" src="@/assets/img/大标题.png" />
      <div class="yearSelect">
        <el-select v-model="year" placeholder="Select" size="default">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @change="changeYear"
          />
        </el-select>
      </div>
    </div>
    <div class="unit-text title-font-family">单位：万元</div>
    <!-- 头部集团列表 -->
    <div class="headerList">
      <div
        v-for="(item, index) in groupList"
        :key="index"
        class="headerList-item"
      >
        <div class="headerList-item-box">
          <div class="headerList-item-box-title">
            <i class="icon-zuojiantou"></i>
            <div class="headerList-item-box-title-text title-font-family">
              {{ item.name }}
            </div>
          </div>
          <div class="headerList-item-box-content">
            <div class="headerList-item-box-content-item">
              <el-statistic
                :value="item.numberList[0]"
                :value-style="headerNumberStyle"
              >
                <template #title>
                  <div class="headerList-item-box-content-item-title">
                    预算总额
                  </div>
                </template>
                <template #suffix>
                  <i
                    class="headerList-item-box-content-item-title"
                    style="font-style: normal"
                  >
                    万元
                  </i>
                </template>
              </el-statistic>
            </div>
            <div class="headerList-item-box-content-item">
              <div class="headerList-item-box-content-item-title executed-text">
                已执行
              </div>
              <div
                class="headerList-item-box-content-item-number executed-number"
              >
                {{ item.numberList[1] + '%' }}
              </div>
            </div>
            <div class="headerList-item-box-content-item">
              <el-statistic
                :value="item.numberList[2]"
                :value-style="headerNumberStyle"
              >
                <template #title>
                  <div class="headerList-item-box-content-item-title">执行</div>
                </template>
              </el-statistic>
            </div>
            <div class="headerList-item-box-content-item">
              <el-statistic
                :value="item.numberList[3]"
                :value-style="headerNumberStyle"
              >
                <template #title>
                  <div class="headerList-item-box-content-item-title">超额</div>
                </template>
              </el-statistic>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容区块 -->
    <div class="content">
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
              @click="riskWarningActiveText = '年度'"
            >
              年度
            </div>
            <div
              style="margin-left: 10px"
              class="riskWarning-box-title-button"
              :class="{
                'riskWarning-active': riskWarningActiveText === '季度',
              }"
              @click="riskWarningActiveText = '季度'"
            >
              季度
            </div>
          </div>
          <div class="riskWarning-box-content">
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
                  :value-style="headerNumberStyle"
                />
                <span class="riskWarning-box-content-item-number-text">
                  项超额
                </span>
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
            <div class="quarter-box-title-text">季度执行情况</div>
          </div>
          <div class="quarter-box-content">
            <div
              v-for="(item, index) in quarterList"
              :key="index"
              class="quarter-box-content-item"
              :style="formatQuarterItemStyle(index)"
            >
              <div
                class="quarter-box-content-item-title quarter-box-content-title"
              >
                {{ item.name }}
              </div>
              <chart
                :chart-style="{ flex: 1 }"
                :option="quarterChartsOption"
              ></chart>
            </div>
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
import Chart from '@/components/Chart/Chart.vue'
import { ref, reactive } from 'vue'
import { useTransition } from '@vueuse/core'
// 换算方法
const nowSize = (val) => {
  //当前视口宽度
  let nowClientWidth = document.documentElement.clientWidth

  return val * (nowClientWidth / 1920)
}
// 头部数字样式
const headerNumberStyle = {
  fontFamily: 'D-DIN-Bold',
  fontWeight: 'bold',
  fontSize: '24px',
  letterSpacing: '1px',
}

// 年度
const year = ref('2024')

// 年度筛选列表
const yearList = [
  {
    value: '2024',
    label: '2024年',
  },
  {
    value: '2023',
    label: '2023年',
  },
]

// 年度改变
const changeYear = (val) => {
  console.log(val)
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

MLNumberList.value = [4235, 88.8, 4235, 4235]
SHNumberList.value = [4235, 88.8, 4235, 4235]
JTNumberList.value = [4235, 88.8, 4235, 4235]
WCNumberList.value = [4235, 88.8, 4235, 4235]
LHNumberList.value = [4235, 88.8, 4235, 4235]

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

// 风险数字列表
const riskWarningNumberList = ref([0, 0, 0, 0, 0])
const TransitionRiskWarningNumberList = useTransition(riskWarningNumberList)
riskWarningNumberList.value = [100235, 100235, 100235, 100235, 100235]

// 风险数据
const riskWarningList = ref([
  {
    name: '梅里集团',
    number: 100235,
  },
  {
    name: '梅里集团',
    number: 100235,
  },
  {
    name: '梅里集团',
    number: 100235,
  },
  {
    name: '梅里集团',
    number: 100235,
  },
  {
    name: '梅里集团',
    number: 100235,
  },
])

// 季度名称列表
const quarterList = ref([
  {
    name: '一季度',
  },
  {
    name: '二季度',
  },
  {
    name: '三季度',
  },
  {
    name: '四季度',
  },
])

// 季度数据
const quarterData = reactive([])

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
      max: 5000,
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
      nameTextStyle: {
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
      },
    },
  ],
  grid: {
    top: 50,
    left: 50,
    right: 50,
    bottom: 30,
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
      data: [3000, 2000, 3000, 3000, 3000],
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
      data: [4000, 3000, 4000, 4000, 4000],
    },
    {
      name: '执行率',
      type: 'line',
      yAxisIndex: 1,
      symbolSize: 10,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' °C'
        },
      },
      lineStyle: {
        color: 'rgba(194, 196, 198, 1)',
      },
      itemStyle: {
        color: 'rgba(255, 96, 0, 1)',
      },
      data: [90, 60, 78, 80, 100],
    },
  ],
}

// 收入情况数据
const incomeData = reactive([
  { value: 1048, name: '梅里集团' },
  { value: 735, name: '盛洪集团' },
  { value: 580, name: '嘉塍集团' },
  { value: 484, name: '闻川集团' },
  { value: 300, name: '麟湖集团' },
])

// 收入情况图表配置
const incomeChartsOption = {
  backgroundColor: '#fff',
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    right: '8%',
    top: 'middle',
    itemGap: nowSize(10),
    bottom: 'middle',
    formatter(name) {
      incomeTotal = 0
      const val = incomeData.find((i) => {
        return i.name === name
      })
      incomeData.forEach((i) => {
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
    },
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
      name: 'Access From',
      type: 'pie',
      radius: ['55%', '80%'],
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
              incomeTotal.toLocaleString() +
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
              fontSize: 24,
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
      data: incomeData,
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

// 主体扣分情况图表配置
const subjectChartsOption = {
  tooltip: {
    trigger: 'axis',
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
      data: [120, 132, 101, 134, 90],
      itemStyle: {
        color: 'rgba(149, 152, 155, 1)',
      },
    },
    {
      name: '二季度',
      type: 'line',
      symbol: 'none',
      stack: 'Total',
      data: [220, 182, 191, 234, 290],
      itemStyle: {
        color: 'rgba(226, 150, 103, 1)',
      },
    },
    {
      name: '三季度',
      type: 'line',
      symbol: 'none',
      stack: 'Total',
      data: [150, 232, 201, 154, 190],
      itemStyle: {
        color: 'rgba(77, 96, 141, 1)',
      },
    },
    {
      name: '四季度',
      type: 'line',
      symbol: 'none',
      stack: 'Total',
      data: [320, 332, 301, 334, 390],
      itemStyle: {
        color: 'rgba(185, 151, 103, 1)',
      },
    },
  ],
}

// 主体扣分情况数据
const subjectData = reactive([])

// 格式化季度外边距
const formatQuarterItemStyle = (index) => {
  if (index === 0) {
    return {
      margin: '2.5px 2.5px 2.5px 0',
    }
  }
  if (index === 1) {
    return {
      margin: '2.5px 0 2.5px 2.5px',
    }
  }
  if (index === 2) {
    return {
      margin: '0 2.5px 0 0',
    }
  }
  if (index === 3) {
    return {
      margin: '0 0 0 2.5px',
    }
  }
}
</script>

<style lang="less" scoped>
.icon-zuojiantou:before {
  font-size: 25px !important;
}
.page {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  max-height: 100vh;
  // padding: 24px 47px 17.5px 48px;
  .title {
    width: 100%;
    height: 93px;
    display: flex;
    align-items: center;
    justify-content: end;
    &-img {
      width: 85%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .yearSelect {
      width: 135px;
      height: 35px;
      border: 0;
      margin-top: 30px;
    }
  }
  .unit-text {
    font-size: 16px;
    color: #ff6000;
    text-align: right !important;
    margin: 0 0 5px 0;
    font-style: italic;
    font-weight: 400;
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
      background: rgba(244, 244, 244, 0.6);
      padding: 10px;
      border-radius: 10px;
      &-box {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 10px;
        padding: 5px 0 5px 15px;
        box-shadow: 0 5px 3px 0 rgba(0, 0, 0, 0.05);
        &-title {
          display: flex;
          align-items: center;
          &-text {
            font-weight: 400;
            font-size: 24px;
            color: #3d3d3d;
            font-style: italic;
            margin-left: 15px;
          }
        }
        &-content {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          &-item {
            width: 50%;
            &-title {
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              font-size: 14px;
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
              font-size: 12px;
            }
            .executed-number {
              font-weight: bold;
              font-size: 16px;
              color: #ff6000;
              margin-bottom: 3px;
            }
          }
        }
      }
    }
  }
  .content {
    // display: flex;
    justify-content: space-between;
    flex: 1;
  }
  .riskWarning,
  .quarter,
  .income,
  .subject {
    width: 100%;
    background: rgba(244, 244, 244, 0.6);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    &-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      &-title {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px 21px 10px 24px;
        border-radius: 10px 10px 0 0;
        margin-bottom: 5px;
        background-color: #fff;
        box-shadow: 0 5px 3px 0 rgba(0, 0, 0, 0.05);
        &-img {
          width: 29px;
          height: 13px;
          margin-right: 10px;
        }
        &-text {
          font-family: 迷你简汉真广标;
          font-weight: 400;
          font-size: 24px;
          color: #3d3d3d;
          font-style: italic;
        }
        &-button {
          cursor: pointer;
          width: 70px;
          height: 25px;
          background-color: #cfcfcf;
          font-family: 迷你简汉真广标;
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          margin: 0 0 0 55px;
          align-items: center;
          line-height: 25px;
        }
      }
      &-content {
        flex-wrap: wrap;
        flex: 1;
        padding: 18px 73px 0 58px;
        background-color: #fff;
        box-shadow: 0 5px 3px 0 rgba(0, 0, 0, 0.05);
        &-item {
          display: flex;
          flex-direction: column;
          height: 20%;
          &-title {
            position: relative;
            font-family: 迷你简汉真广标;
            font-weight: 400;
            font-size: 16px;
            color: #3d3d3d;
            font-style: italic;
          }
          &-title::after {
            content: '';
            width: 6px;
            height: 20px;
            position: absolute;
            top: -3px;
            left: -20px;
            background: rgba(255, 96, 0, 1);
          }
          &-number {
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 19px;
            &-text {
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              font-size: 14px;
              color: #8d8d8d;
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
    &-box {
      background-color: #fff;
    }
    &-box-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background-color: #f8f8f8;
      padding: 0;
      &-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 25vh;
        background-color: #fff;
        margin: 5px;
        &-title {
          margin: 10px 0 10px 40px;
        }
        &-title::after {
          left: -20;
        }
      }
    }
  }
  .rightContent {
    width: 457px;
    .income,
    .subject {
      width: 100%;
      height: 45%;
      &-box {
        background-color: #f8f8f8;
        &-content {
          padding: 0;
          background-color: #fff;
          display: flex;
        }
      }
    }
    .subject {
      margin-top: 16px;
      height: 52%;
    }
  }
}

:deep(.el-statistic__head) {
  margin-bottom: 0;
}
:deep(.el-select__wrapper) {
  background: #f6e0be;
  border: 0;
  box-shadow: 0 0 0 0;
  border-radius: 0;
}
:deep(.el-select__placeholder),
:deep(.el-select__icon) {
  text-align: center;
  color: rgba(61, 61, 61, 1);
}
</style>
