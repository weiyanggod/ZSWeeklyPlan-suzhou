<template>
  <div class="page">
    <div class="title">
      <el-dropdown :teleported="false" trigger="click" @command="changeYear">
        <span class="el-dropdown-link">
          <span class="title">{{ year }}年</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu v-for="(item, index) in years" :key="index">
            <el-dropdown-item :command="item">{{ item }}年</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown
        :teleported="false"
        max-height="200px"
        trigger="click"
        @command="changeWeek"
      >
        <span class="el-dropdown-link">
          <span class="title">第{{ week }}周</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu v-for="(item, index) in weeks" :key="index">
            <el-dropdown-item :command="item">第{{ item }}周</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>项目对接计划</span>
    </div>
    <table border="1" cellspacing="0" cellpadding="0">
      <tr>
        <th style="width: 250px">日期</th>
        <th style="width: 160px">星期</th>
        <th colspan="3" style="width: 720px">工作安排</th>
        <th style="width: 250px">参会人员</th>
        <th style="width: 80px; height: 70px">操作</th>
      </tr>
      <template v-for="it in [data, data2, data3, data4, data5]">
        <tr v-for="(item, index) in it" :key="index">
          <td v-if="index === 0" :rowspan="it.length" style="color: #3d3d3d">
            {{ dayjs(item.date).format('YYYY-MM-DD') }}
          </td>
          <td>{{ item.week }}</td>
          <td>{{ item.time }}</td>
          <td
            class="w150h70"
            style="padding: 0 10px"
            @dblclick="item.selectShow = true"
          >
            <el-select
              v-if="item.selectShow"
              v-model="item.type"
              placeholder="请输入"
              clearable
              @change="submitForm(item)"
            >
              <el-option
                v-for="ite in options"
                :key="ite.value"
                :label="ite.label"
                :value="ite.value"
              />
            </el-select>
            <div v-else>{{ item.type }}</div>
          </td>
          <td
            style="width: 420px"
            class="input"
            @dblclick="item.valueShow = true"
          >
            <el-input
              v-if="item.valueShow"
              v-model="item.content"
              placeholder="请输入"
              type="textarea"
              @change="submitForm(item)"
            />
            <div v-else>{{ item.content }}</div>
          </td>
          <td class="input" @dblclick="item.personShow = true">
            <el-input
              v-if="item.personShow"
              v-model="item.member"
              placeholder="请输入"
              type="textarea"
              @change="submitForm(item)"
            />
            <div v-else>{{ item.member }}</div>
          </td>
          <td class="buttons">
            <el-button @click="addRow(it, item, index)">新增</el-button>
            <el-button
              v-if="showDel(it, item)"
              type="danger"
              @click="delRow(item)"
            >
              删除
            </el-button>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import _ from 'lodash'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import {
  getYearApi,
  getWeekApi,
  getTypeApi,
  getPlanDataApi,
  updatePlanApi,
  deletePlanApi,
} from '@/api/index'

const years = ref([])
const year = ref(null)
getYearApi().then(({ data }) => {
  years.value = data
  year.value = years.value[years.value.length - 1]
})
const weeks = ref([])
const week = ref(null)
getWeekApi().then(({ data }) => {
  weeks.value = data

  week.value = weeks.value[weeks.value.length - 1]
})

// 更改周数
const changeYear = (data) => {
  year.value = data
  render()
}

// 更改周数
const changeWeek = (data) => {
  week.value = data
  render()
}

let options = ref([])
const data = ref([])
const data2 = ref([])
const data3 = ref([])
const data4 = ref([])
const data5 = ref([])
// 新增行
const addRow = (list, item, index) => {
  list.splice(index + 1, 0, {
    date: item.date,
    year: item.year,
    week: item.week,
    day: item.day,
    time: item.time,
    type: '',
    content: '',
    member: '',
    flag: '-5723903220527053290',
    selectShow: false,
    valueShow: false,
    personShow: false,
  })
  submitForm(list[index + 1])
}

// 删除行
const delRow = (item) => {
  deletePlanApi(item.id).then(() => {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    render()
  })
}

// 判断当前行是否有删除按钮
const showDel = (list, item) => {
  // console.log(list)
  const arr = list.filter((i) => i.time === item.time)
  if (arr.length > 1) {
    return true
  }
}

// // 空白点击监听
// document.addEventListener('click', (data) => {
//   if (data.target.className === 'page') {
//     submitForm()
//   }
// })

// 保存
const submitForm = _.debounce((item) => {
  let isPass = true
  if (item.type && !item.content) {
    ElMessage({
      message: '有工作方式时,工作安排的内容为必填',
      type: 'warning',
    })
    isPass = true
    throw new Error('LoopInterrupt')
  } else if (item.content && !item.type) {
    ElMessage({
      message: '工作安排有内容时,工作方式为必填',
      type: 'warning',
    })
    isPass = true
    throw new Error('LoopInterrupt')
  } else {
    isPass = true
  }

  if (isPass) {
    item.selectShow = false
    item.valueShow = false
    item.personShow = false
    const data = _.cloneDeep(item)
    data.type = options.value.find((i) => i.value === data.type)?.id
    if (data.time === '上午') {
      data.time = '-1768710615353833183'
    } else if (data.time === '下午') {
      data.time = '5796297147828552694'
    }
    delete data.selectShow
    delete data.valueShow
    delete data.personShow
    updatePlanApi(data).then(() => {
      if (data.id) {
        ElMessage({
          message: '保存成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '新增成功',
          type: 'success',
        })
      }
      render()
    })
  }
}, 500)

// 获取安排方式
getTypeApi().then(({ data }) => {
  options.value = []
  data.forEach((item) => {
    options.value.push({
      value: item.showvalue,
      label: item.showvalue,
      id: item.id,
    })
  })
})

// 渲染
const render = () => {
  getPlanDataApi({
    year: year.value,
    week: week.value,
  }).then(({ data: list }) => {
    data.value = []
    data2.value = []
    data3.value = []
    data4.value = []
    data5.value = []
    list.forEach((item) => {
      item.selectShow = false
      item.valueShow = false
      item.personShow = false
      if (item.week === '星期一') {
        data.value.push(item)
      }
      if (item.week === '星期二') {
        data2.value.push(item)
      }
      if (item.week === '星期三') {
        data3.value.push(item)
      }
      if (item.week === '星期四') {
        data4.value.push(item)
      }
      if (item.week === '星期五') {
        data5.value.push(item)
      }
    })
  })
}
render()
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('@/assets/img/背景图.png');
  background-size: cover;
  font-family: 'AlibabaPuHuiTi';
  padding: 15px 0;
}

.title,
.example-showcase .el-dropdown-link {
  font-weight: 700;
  font-size: 48px;
  color: #2e60b5;
  line-height: 67px;
  text-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.3);
  text-align: left;
  font-style: normal;
  text-transform: none;
}
table {
  margin-top: 40px;
  border-collapse: collapse;
}
th {
  color: #fff;
  background-color: #6a8dc9;
}
td {
  font-size: 18px;
  font-weight: 400;
  color: #3d3d3d;
  background-color: rgba(249, 251, 255, 0.8);
}
table,
table tr th,
table tr td {
  border: 1px solid #c9cdd4;
}
.input {
  padding: 0 10px;
  color: rgba(53, 129, 213, 1);
  font-size: 14px;
  text-align: left;
  width: 250px;
}
.w150h70 {
  width: 150px;
  height: 70px;
}

:deep(.el-button) {
  margin: 5px 10px 5px 10px;
}
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 0;
}
:deep(.el-form-item) {
  margin-bottom: 0;
}
:deep(.el-form-item__content) {
  height: 18px;
  text-align: left;
  display: block;
}
:deep(.el-select__placeholder) {
  color: rgba(53, 129, 213, 1);
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
