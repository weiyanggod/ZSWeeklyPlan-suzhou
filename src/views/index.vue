<template>
  <div class="page">
    <div class="title">
      <el-dropdown :teleported="false" trigger="click">
        <span class="el-dropdown-link">
          <span class="title">2024</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>2023</el-dropdown-item>
            <el-dropdown-item>2022</el-dropdown-item>
            <el-dropdown-item>2021</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown :teleported="false">
        <span class="el-dropdown-link">
          <span class="title">第{{ weeks[0] }}周</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu v-for="(item, index) in weeks" :key="index">
            <el-dropdown-item>第{{ item }}周</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>项目对接计划</span>
    </div>
    <div v-for="(item, index) in dataList" :key="index" class="car">
      <div class="time">
        <span class="date">2024/5/27</span>
        <span class="week">{{ item[0].date }}</span>
      </div>
      <div v-for="(i, inx) in item" :key="inx">
        <div class="mode">
          <span>{{ i.time }}</span>
          <div>
            <el-select
              v-model="i.mode"
              placeholder="请选择"
              style="width: 120px"
              @change="submitForm"
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
          <el-button type="danger" link @click="delRow(index, inx)">
            删除
          </el-button>
        </div>
        <el-input
          v-model="i.value"
          style="margin-top: 6px"
          :rows="2"
          type="textarea"
          :autosize="{ minRows: 5 }"
          @change="submitForm"
        />
        <div style="margin-top: 10px">参会人员</div>
        <el-input
          v-model="i.person"
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

// 数据列表
const dataList = ref([
  [
    {
      time: '上午',
      date: '星期一',
      mode: '来访',
      value: '测试',
      person: '',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
    {
      time: '下午',
      date: '星期一',
      mode: '来访',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
  ],
  [
    {
      time: '上午',
      date: '星期一',
      mode: '外出',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
    {
      time: '下午',
      date: '星期一',
      mode: '来访',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
  ],
  [
    {
      time: '上午',
      date: '星期一',
      mode: '外出',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
    {
      time: '下午',
      date: '星期一',
      mode: '来访',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
  ],
  [
    {
      time: '上午',
      date: '星期一',
      mode: '外出',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
    {
      time: '下午',
      date: '星期一',
      mode: '来访',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
  ],
  [
    {
      time: '上午',
      date: '星期一',
      mode: '外出',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
    {
      time: '下午',
      date: '星期一',
      mode: '来访',
      value: '测试',
      person: '测试',
      selectShow: false,
      valueShow: false,
      personShow: false,
      del: false,
    },
  ],
])

// 新增行
const addRow = (item, index, inx) => {
  data.value[index].splice(inx + 1, 0, {
    time: item.time,
    date: item.date,
    mode: '',
    value: '',
    person: '',
    selectShow: true,
    valueShow: true,
    personShow: true,
    del: true,
  })
}

// 删除行
const delRow = (index, inx) => {
  data.value[index].splice(inx, 1)
}

// 保存
const submitForm = _.debounce(() => {
  let isPass = true
  data.value.forEach((item) => {
    item.forEach((i) => {
      if (i.mode && !i.value) {
        ElMessage({
          message: '有工作方式时,工作安排的内容为必填',
          type: 'warning',
        })
        isPass = true
        throw new Error('LoopInterrupt')
      } else if (i.value && !i.mode) {
        ElMessage({
          message: '工作安排有内容时,工作方式为必填',
          type: 'warning',
        })
        isPass = true
        throw new Error('LoopInterrupt')
      } else {
        isPass = true
      }
    })
  })
  if (isPass) {
    data.value.forEach((item) => {
      item.forEach((i) => {
        i.selectShow = false
        i.valueShow = false
        i.personShow = false
      })
    })
    ElMessage({
      message: '修改成功',
      type: 'success',
    })
  }
}, 1000)

const render = () => {
  getPlanDataApi({
    year: dayjs().year(),
    week: week.value,
  }).then(({ data }) => {
    console.log(data)

    data.forEach((item) => {
      item.selectShow = false
      item.valueShow = false
      item.personShow = false
    })
    dataList.value = data
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
