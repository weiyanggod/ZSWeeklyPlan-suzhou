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
        <th style="width: 80px; height: 50px">操作</th>
      </tr>
      <template
        v-for="it in [
          Monday,
          Tuesday,
          Wednesday,
          Thursday,
          Friday,
          Saturday,
          Sunday,
        ]"
      >
        <tr v-for="(item, index) in it" :key="index">
          <td v-if="index === 0" :rowspan="it.length" style="color: #3d3d3d">
            {{ dayjs(item.date).format('YYYY-MM-DD') }}
          </td>
          <td>{{ item.week }}</td>
          <td>{{ item.time }}</td>
          <td
            class="w150h50"
            style="padding: 0 10px"
            @dblclick="item.selectShow = true"
          >
            <el-select
              v-model="item.type"
              placeholder="请选择"
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
            <el-button size="small" @click="addRow(it, item, index)">
              新增
            </el-button>
            <el-button
              v-if="showDel(it, item)"
              size="small"
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
  const is = years.value.find((i) => i == dayjs().year())
  if (is) {
    year.value = years.value[years.value.length - 1]
  } else {
    year.value = dayjs().year()
  }
})
const weeks = ref([])
const week = ref(null)
const getWeeks = () => {
  getWeekApi().then(({ data }) => {
    weeks.value = data
    const is = weeks.value.find((i) => i == dayjs().year())
    if (is) {
      week.value = weeks.value[weeks.value.length - 1]
    } else {
      week.value = dayjs().week()
    }
  })
}
getWeeks()
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
const Monday = ref([])
const Tuesday = ref([])
const Wednesday = ref([])
const Thursday = ref([])
const Friday = ref([])
const Saturday = ref([])
const Sunday = ref([])
// 新增行
const addRow = (list, item, index) => {
  const temp = {
    date: item.date,
    year: item.year,
    week: item.week,
    day: item.day,
    time: item.time,
    type: '',
    content: '',
    member: '',
    iindex: index + 1,
    flag: '-5723903220527053290',
    selectShow: false,
    valueShow: false,
    personShow: false,
  }
  list.splice(index + 1, 0, temp)

  list.forEach((i, index) => {
    i.iindex = index
    submitForm(i, true)
  })
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

// 保存
const submitForm = (item, isNotShow) => {
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
        if (!isNotShow) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
        }
      } else {
        if (!isNotShow) {
          ElMessage({
            message: '新增成功',
            type: 'success',
          })
        }
      }
      render()
    })
  }
}

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
  }).then(({ data }) => {
    data.forEach((item) => {
      item.selectShow = false
      item.valueShow = false
      item.personShow = false
    })

    const timeList = [
      {
        week: '星期一',
        time: '上午',
        list: Monday,
      },
      {
        week: '星期一',
        time: '下午',
        list: Monday,
      },
      {
        week: '星期二',
        time: '上午',
        list: Tuesday,
      },
      {
        week: '星期二',
        time: '下午',
        list: Tuesday,
      },
      {
        week: '星期三',
        time: '上午',
        list: Wednesday,
      },
      {
        week: '星期三',
        time: '下午',
        list: Wednesday,
      },
      {
        week: '星期四',
        time: '上午',
        list: Thursday,
      },
      {
        week: '星期四',
        time: '下午',
        list: Thursday,
      },
      {
        week: '星期五',
        time: '上午',
        list: Friday,
      },
      {
        week: '星期五',
        time: '下午',
        list: Friday,
      },
      {
        week: '星期六',
        time: '上午',
        list: Saturday,
      },
      {
        week: '星期六',
        time: '下午',
        list: Saturday,
      },
      {
        week: '星期日',
        time: '上午',
        list: Sunday,
      },
      {
        week: '星期日',
        time: '下午',
        list: Sunday,
      },
    ]
    Monday.value = []
    Tuesday.value = []
    Wednesday.value = []
    Thursday.value = []
    Friday.value = []
    Saturday.value = []
    Sunday.value = []

    timeList.forEach((item, index) => {
      reset(data, item, index)
    })
  })
}

// 重置数据
const reset = (data, item, index) => {
  let add = 1
  if (item.week === '星期二') {
    add = 2
  }
  if (item.week === '星期三') {
    add = 3
  }
  if (item.week === '星期四') {
    add = 4
  }
  if (item.week === '星期五') {
    add = 5
  }
  if (item.week === '星期六') {
    add = 6
  }
  if (item.week === '星期日') {
    add = 7
  }
  const temp = {
    date: dayjs().startOf('week').add(add, 'day').format('YYYY-MM-DD'),
    year: dayjs().year(),
    week: item.week,
    time: item.time,
    day: week.value,
    type: '',
    content: '',
    member: '',
    iindex: index,
    flag: '-5723903220527053290',
    selectShow: false,
    valueShow: false,
    personShow: false,
  }

  const arr = data.filter((i) => i.week === item.week && i.time === item.time)
  if (arr.length === 0) {
    item.list.value.push(temp)
    submitForm(temp, true)
  } else {
    item.list.value.push(...arr)
  }
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
  font-family: 'AlibabaPuHuiTi Bold';
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
  font-size: 14px;
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
.w150h50 {
  width: 150px;
  height: 45px;
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
