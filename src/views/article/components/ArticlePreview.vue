<script setup>
import { ref } from 'vue'
import { artGetDetailService } from '@/api/article'
import { baseURL } from '@/utils/request'
import { formatTime } from '@/utils/format.js'

const visibleDrawer = ref(false)
const dataModel = ref({
  title: '',
  content: '',
  cover_img: '',
  pub_date: '',
  cate_name: ''
})
const loading = ref(false)
const open = async (id) => {
  visibleDrawer.value = true
  loading.value = true
  const {
    data: { data }
  } = await artGetDetailService(id)
  dataModel.value = { ...data }
  loading.value = false
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    title="文章预览"
    direction="rtl"
    size="50%"
  >
    <div v-loading="loading">
      <h1>{{ dataModel.title }}</h1>
      <span>发布时间: {{ formatTime(dataModel.pub_date) }}</span>
      <br />
      <span>文章分类：{{ dataModel.cate_name }}</span>
      <hr />
      <p>
        <img :src="baseURL + dataModel.cover_img" />
      </p>
      <div>
        <p v-html="dataModel.content"></p>
      </div>
    </div>
  </el-drawer>
</template>

<style scope>
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
img {
  overflow-clip-margin: content-box;
  overflow: clip;
}
</style>
