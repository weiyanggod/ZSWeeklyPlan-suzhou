<template>
  <div ref="chart" class="chart" :style="chartStyle"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, watch } from 'vue'
const props = defineProps({
  chartStyle: {
    type: Object,
    default: () => {
      return {}
    },
  },
  option: {
    type: Object,
    default: () => {
      return {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
        ],
      }
    },
  },
})
let chart = ref()
watch(
  () => props.option,
  () => {
    const mychart = echarts.init(chart.value)
    mychart.setOption(props.option || null)
  },
)
const render = (option) => {
  const data = option || props.option || null
  const mychart = echarts.init(chart.value)
  mychart.setOption(data)
}
onMounted(() => {
  if (props.option) {
    render()
  }
})
defineExpose({
  render,
})
</script>

<style lang="less" scoped></style>
