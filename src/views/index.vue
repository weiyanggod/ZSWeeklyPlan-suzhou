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
          <span class="title">第五周</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>第四周</el-dropdown-item>
            <el-dropdown-item>第三周</el-dropdown-item>
            <el-dropdown-item>第二周</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>项目对接计划</span>
    </div>
    <table border="1" cellspacing="0" cellpadding="0">
      <tr>
        <th style="width: 250px; height: 70px">日期</th>
        <th style="width: 160px; height: 70px">星期</th>
        <th colspan="3">工作安排</th>
        <th>参会人员</th>
        <th>操作</th>
      </tr>
      <tr v-for="(item, index) in data" :key="index">
        <td v-if="index === 0" :rowspan="data.length" style="color: #3d3d3d">
          2024/5/27
        </td>
        <td>{{ item.date }}</td>
        <td class="w150h70">{{ item.time }}</td>
        <td
          class="w150h70"
          style="padding: 0 10px"
          @dblclick="item.selectShow = true"
        >
          <el-select
            v-if="item.selectShow"
            v-model="item.mode"
            placeholder="请输入"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else>{{ item.mode }}</div>
        </td>
        <td
          style="width: 420px"
          class="input"
          @dblclick="item.valueShow = true"
        >
          <el-input
            v-if="item.valueShow"
            v-model="item.value"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.value }}</div>
        </td>
        <td class="input" @dblclick="item.personShow = true">
          <el-input
            v-if="item.personShow"
            v-model="item.person"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.person }}</div>
        </td>
        <td class="buttons">
          <el-button @click="addRow(data, item, index)">新增</el-button>
          <el-button v-if="item.del" type="danger" @click="delRow(data, index)">
            删除
          </el-button>
        </td>
      </tr>
      <tr v-for="(item, index) in data2" :key="index">
        <td v-if="index === 0" :rowspan="data2.length" style="color: #3d3d3d">
          2024/5/27
        </td>
        <td>{{ item.date }}</td>
        <td class="w150h70">{{ item.time }}</td>
        <td
          class="w150h70"
          style="padding: 0 10px"
          @dblclick="item.selectShow = true"
        >
          <el-select
            v-if="item.selectShow"
            v-model="item.mode"
            placeholder="请输入"
            @change="item.selectShow = !item.selectShow"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else>{{ item.mode }}</div>
        </td>
        <td
          style="width: 420px"
          class="input"
          @dblclick="item.valueShow = true"
        >
          <el-input
            v-if="item.valueShow"
            v-model="item.value"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.value }}</div>
        </td>
        <td class="input" @dblclick="item.personShow = true">
          <el-input
            v-if="item.personShow"
            v-model="item.person"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.person }}</div>
        </td>
        <td class="buttons">
          <el-button @click="addRow(data2, item, index)">新增</el-button>
          <el-button
            v-if="item.del"
            type="danger"
            @click="delRow(data2, index)"
          >
            删除
          </el-button>
        </td>
      </tr>
      <tr v-for="(item, index) in data3" :key="index">
        <td v-if="index === 0" :rowspan="data3.length" style="color: #3d3d3d">
          2024/5/27
        </td>
        <td>{{ item.date }}</td>
        <td class="w150h70">{{ item.time }}</td>
        <td
          class="w150h70"
          style="padding: 0 10px"
          @dblclick="item.selectShow = true"
        >
          <el-select
            v-if="item.selectShow"
            v-model="item.mode"
            placeholder="请输入"
            @change="item.selectShow = !item.selectShow"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else>{{ item.mode }}</div>
        </td>
        <td
          style="width: 420px"
          class="input"
          @dblclick="item.valueShow = true"
        >
          <el-input
            v-if="item.valueShow"
            v-model="item.value"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.value }}</div>
        </td>
        <td class="input" @dblclick="item.personShow = true">
          <el-input
            v-if="item.personShow"
            v-model="item.person"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.person }}</div>
        </td>
        <td class="buttons">
          <el-button @click="addRow(data3, item, index)">新增</el-button>
          <el-button
            v-if="item.del"
            type="danger"
            @click="delRow(data3, index)"
          >
            删除
          </el-button>
        </td>
      </tr>
      <tr v-for="(item, index) in data4" :key="index">
        <td v-if="index === 0" :rowspan="data4.length" style="color: #3d3d3d">
          2024/5/27
        </td>
        <td>{{ item.date }}</td>
        <td class="w150h70">{{ item.time }}</td>
        <td
          class="w150h70"
          style="padding: 0 10px"
          @dblclick="item.selectShow = true"
        >
          <el-select
            v-if="item.selectShow"
            v-model="item.mode"
            placeholder="请输入"
            @change="item.selectShow = !item.selectShow"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else>{{ item.mode }}</div>
        </td>
        <td
          style="width: 420px"
          class="input"
          @dblclick="item.valueShow = true"
        >
          <el-input
            v-if="item.valueShow"
            v-model="item.value"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.value }}</div>
        </td>
        <td class="input" @dblclick="item.personShow = true">
          <el-input
            v-if="item.personShow"
            v-model="item.person"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.person }}</div>
        </td>
        <td class="buttons">
          <el-button @click="addRow(data4, item, index)">新增</el-button>
          <el-button
            v-if="item.del"
            type="danger"
            @click="delRow(data4, index)"
          >
            删除
          </el-button>
        </td>
      </tr>
      <tr v-for="(item, index) in data5" :key="index">
        <td v-if="index === 0" :rowspan="data5.length" style="color: #3d3d3d">
          2024/5/27
        </td>
        <td>{{ item.date }}</td>
        <td class="w150h70">{{ item.time }}</td>
        <td
          class="w150h70"
          style="padding: 0 10px"
          @dblclick="item.selectShow = true"
        >
          <el-select
            v-if="item.selectShow"
            v-model="item.mode"
            placeholder="请输入"
            @change="item.selectShow = !item.selectShow"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else>{{ item.mode }}</div>
        </td>
        <td
          style="width: 420px"
          class="input"
          @dblclick="item.valueShow = true"
        >
          <el-input
            v-if="item.valueShow"
            v-model="item.value"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.value }}</div>
        </td>
        <td class="input" @dblclick="item.personShow = true">
          <el-input
            v-if="item.personShow"
            v-model="item.person"
            placeholder="请输入"
            type="textarea"
          />
          <div v-else>{{ item.person }}</div>
        </td>
        <td class="buttons">
          <el-button @click="addRow(data5, item, index)">新增</el-button>
          <el-button
            v-if="item.del"
            type="danger"
            @click="delRow(data5, index)"
          >
            删除
          </el-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const options = [
  {
    value: '来访',
    label: '来访',
  },
  {
    value: '外出',
    label: '外出',
  },
]
const data = ref([
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
])
const data2 = ref([
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
])
const data3 = ref([
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
])
const data4 = ref([
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
])
const data5 = ref([
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
])
// 新增行
const addRow = (list, item, index) => {
  list.splice(index + 1, 0, {
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
const delRow = (list, index) => {
  list.splice(index, 1)
}

// 空白点击监听
document.addEventListener('click', (data) => {
  if (data.target.className === 'page') {
    submitForm()
  }
})

// 保存
const submitForm = () => {
  let isPass = true
  const arr = [data, data2, data3, data4, data5]
  arr.forEach((item) => {
    item.value.forEach((i) => {
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
    ElMessageBox.confirm('是否要保存', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
    })
      .then(() => {
        arr.forEach((item) => {
          item.value.forEach((i) => {
            i.selectShow = false
            i.valueShow = false
            i.personShow = false
          })
        })
        ElMessage({
          message: '保存成功',
          type: 'success',
        })
      })
      .catch(() => {})
  }
}
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
:deep .el-select__placeholder {
  color: rgba(53, 129, 213, 1);
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
