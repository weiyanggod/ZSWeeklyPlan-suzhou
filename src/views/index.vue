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
      <el-dropdown :teleported="false" max-height="200px" @command="changeWeek">
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
    <div
      v-for="(item, index) in dataList"
      v-show="item.length > 0"
      :key="index"
      class="car"
    >
      <div class="time">
        <span class="date">
          {{ dayjs(item[0]?.date).format('YYYY/MM/DD') }}
        </span>
        <span class="week">{{ item[0]?.week }}</span>
      </div>
      <div v-for="(i, inx) in item" :key="inx">
        <div class="mode">
          <span>{{ i.time }}</span>
          <div>
            <el-select
              v-model="i.type"
              placeholder="请选择"
              style="width: 120px"
              @blur="submitForm(i)"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button :icon="Plus" @click="addRow(item, i, inx)" />
          </div>
        </div>
        <div
          style="
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
          "
        >
          <span>对接内容</span>
          <el-button
            v-if="showDel(item, i)"
            type="danger"
            link
            @click="delRow(i)"
          >
            删除
          </el-button>
        </div>
        <el-input
          v-model="i.content"
          style="margin-top: 6px"
          :rows="2"
          type="textarea"
          :autosize="{ minRows: 5 }"
          @blur="submitForm(i)"
        />
        <div style="margin-top: 10px">参会人员</div>
        <el-input
          v-model="i.member"
          style="margin-top: 6px"
          :rows="2"
          type="textarea"
          @blur="submitForm(i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import _ from 'lodash'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/advancedFormat'
dayjs.extend(weekOfYear)
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
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
  year.value = year.value = dayjs().year()
})
const weeks = ref([])
const week = ref(null)
getWeekApi().then(({ data }) => {
  weeks.value = data
  week.value = dayjs().week()
})

const options = ref([])

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

// 数据列表
const dataList = ref([[], [], [], [], [], [], []])

// 新增行
const addRow = (list, item, inx) => {
  const temp = {
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
  }
  list.splice(inx + 1, 0, temp)
  list.forEach((i, index) => {
    i.iindex = index
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
  const arr = list.filter((i) => i.time === item.time)
  if (arr.length > 1) {
    return true
  }
}

// 保存
const submitForm = (item, isNotShow) => {
  let isPass = false
  if (!item.content) {
    ElMessage({
      message: '工作安排内容为必填',
      type: 'warning',
    })
  } else if (!item.type) {
    ElMessage({
      message: '来访/外出为必填',
      type: 'warning',
    })
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
    dataList.value = [[], [], [], [], [], [], []]
    const timeList = [
      {
        week: '星期一',
        time: '上午',
        list: dataList.value[0],
      },
      {
        week: '星期一',
        time: '下午',
        list: dataList.value[0],
      },
      {
        week: '星期二',
        time: '上午',
        list: dataList.value[1],
      },
      {
        week: '星期二',
        time: '下午',
        list: dataList.value[1],
      },
      {
        week: '星期三',
        time: '上午',
        list: dataList.value[2],
      },
      {
        week: '星期三',
        time: '下午',
        list: dataList.value[2],
      },
      {
        week: '星期四',
        time: '上午',
        list: dataList.value[3],
      },
      {
        week: '星期四',
        time: '下午',
        list: dataList.value[3],
      },
      {
        week: '星期五',
        time: '上午',
        list: dataList.value[4],
      },
      {
        week: '星期五',
        time: '下午',
        list: dataList.value[4],
      },
      {
        week: '星期六',
        time: '上午',
        list: dataList.value[5],
      },
      {
        week: '星期六',
        time: '下午',
        list: dataList.value[5],
      },
      {
        week: '星期日',
        time: '上午',
        list: dataList.value[6],
      },
      {
        week: '星期日',
        time: '下午',
        list: dataList.value[6],
      },
    ]
    timeList.forEach((item) => {
      reset(data, item)
    })
    dataList.value.forEach((item) => {
      item.forEach((i, index) => {
        i.iindex = index
      })
    })
  })
}
render()

// 重置数据
const reset = (data, item) => {
  let index = 1
  if (item.week === '星期二') {
    index = 2
  }
  if (item.week === '星期三') {
    index = 3
  }
  if (item.week === '星期四') {
    index = 4
  }
  if (item.week === '星期五') {
    index = 5
  }
  if (item.week === '星期六') {
    index = 6
  }
  if (item.week === '星期日') {
    index = 7
  }
  const temp = {
    date: dayjs().startOf('week').add(index, 'day').format('YYYY-MM-DD'),
    year: dayjs().year(),
    week: item.week,
    time: item.time,
    day: week.value,
    type: '',
    content: '',
    member: '',
    flag: '-5723903220527053290',
    selectShow: false,
    valueShow: false,
    personShow: false,
  }
  const arr = data.filter((i) => i.week === item.week && i.time === item.time)
  if (arr.length === 0) {
    item.list.push(temp)
  } else {
    item.list = item.list.push(...arr)
  }
}
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
  background-image: url('@/assets/img/背景图.png');
  background-size: cover;
  padding: 36px 17px 42px 17px;
}

.title,
.example-showcase .el-dropdown-link {
  font-family: 'AlibabaPuHuiTi Bold';
  font-weight: 700;
  font-size: 24px;
  color: #2e60b5;
  font-style: normal;
  text-transform: none;
  text-align: center;
  line-height: 36px;
}

.car {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px 6px 6px 6px;
  padding: 16px 16px 49px 16px;
  margin-top: 22px;
  .time {
    font-weight: 400;
    font-size: 16px;
    .week {
      margin-left: 27px;
    }
  }
  .mode {
    margin-top: 13px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
:deep .el-button {
  margin: 5px 10px 5px 10px;
}
:deep .el-input__wrapper {
  box-shadow: 0 0 0 0;
}
:deep .el-form-item {
  margin-bottom: 0;
}
:deep .el-form-item__content {
  height: 18px;
  text-align: left;
  display: block;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
, { filter }
