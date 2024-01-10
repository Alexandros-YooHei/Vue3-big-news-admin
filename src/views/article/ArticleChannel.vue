<script setup>
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false)
const channelEditRef = ref(null)

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()
const editChannel = (row) => {
  channelEditRef.value.open(row)
}

const deleteChannel = async (row) => {
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const addChannel = () => {
  channelEditRef.value.open()
}
const onSucess = () => {
  getChannelList()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="addChannel"
        >添加分类</el-button
      ></template
    >
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            type="primary"
            @click="editChannel(row)"
            :icon="Edit"
            circle
            plain
          >
          </el-button>
          <el-button
            type="danger"
            @click="deleteChannel(row)"
            :icon="Delete"
            plain
            circle
          />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="空空如也~" />
      </template>
    </el-table>
  </PageContainer>
  <ChannelEdit ref="channelEditRef" @sucess="onSucess"></ChannelEdit>
</template>

<style lang="scss" scoped></style>
