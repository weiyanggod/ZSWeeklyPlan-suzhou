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
        <span class="date">{{ dayjs(item.date).format('YYYY/MM/DD') }}</span>
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
              @change="submitForm(i)"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button :icon="Plus" @click="addRow(i, index, inx)" />
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
          @change="submitForm(i)"
        />
        <div style="margin-top: 10px">参会人员</div>
        <el-input
          v-model="i.member"
          style="margin-top: 6px"
          :rows="2"
          type="textarea"
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
  year.value = years.value[0]
})
const weeks = ref([])
const week = ref(null)
getWeekApi().then(({ data }) => {
  weeks.value = data
  week.value = weeks.value[0]
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
const dataList = ref([])

// 新增行
const addRow = (item, index, inx) => {
  dataList.value[index].splice(inx + 1, 0, {
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

  submitForm(dataList.value[index][inx + 1])
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
const submitForm = _.debounce((item) => {
  let isPass = true
  if (item.type && !item.content) {
    ElMessage({
      message: '有工作方式时,工作安排内容为必填',
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

const render = () => {
  getPlanDataApi({
    year: dayjs().year(),
    week: week.value,
  }).then(({ data }) => {
    data.forEach((item) => {
      item.selectShow = false
      item.valueShow = false
      item.personShow = false
    })
    dataList.value = []
    const arr1 = data.filter((i) => i.week === '星期一')
    const arr2 = data.filter((i) => i.week === '星期二')
    const arr3 = data.filter((i) => i.week === '星期三')
    const arr4 = data.filter((i) => i.week === '星期四')
    const arr5 = data.filter((i) => i.week === '星期五')
    dataList.value.push(arr1)
    dataList.value.push(arr2)
    dataList.value.push(arr3)
    dataList.value.push(arr4)
    dataList.value.push(arr5)
    console.log(dataList.value)
  })
}
render()
</script>

<style lang="less" scoped>
.page {
  background-image: url('@/assets/img/背景图.png');
  background-size: cover;
  font-family: 'PingFang SC-Bold';
  padding: 36px 17px 42px 17px;
}

.title,
.example-showcase .el-dropdown-link {
  font-family: 'AlibabaPuHuiTi';
  font-weight: 700;
  font-size: 24px;
  color: #2e60b5;
  font-style: normal;
  text-transform: none;
  text-align: center;
  line-height: 36px;
  text-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.3);
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
