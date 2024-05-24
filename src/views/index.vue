<template>
  <p-c></p-c>
</template>

<script lang="ts" setup>
import Mobile from './Mobile.vue'
import PC from './PC.vue'
let isMobilePhone = false
if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
  // 当前设备是移动设备
  isMobilePhone = true
}
</script>

<style lang="less" scoped></style>
