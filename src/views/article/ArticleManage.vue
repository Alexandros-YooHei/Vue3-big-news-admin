<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDeleteService } from '@/api/article'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'
import ArticlePreview from './components/ArticlePreview.vue'

const articleList = ref([])
const totalNumber = ref(0)
const params = ref({
  pagenum: 1,
  pagesize: 2,
  cate_id: '',
  state: ''
})
const loading = ref(false)

const getArticleList = async () => {
  loading.value = true

  const {
    data: { data, total }
  } = await artGetListService(params.value)
  articleList.value = data
  totalNumber.value = total
  loading.value = false
}
getArticleList()

const handleSizeChange = (size) => {
  params.value.pagesize = size
  params.value.pagenum = 1
  getArticleList()
}
const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
const articleEditRef = ref(null)

const addArticle = () => {
  articleEditRef.value.open()
}

const editArticle = (row) => {
  articleEditRef.value.open(row)
}
const deleteArticle = async (row) => {
  await ElMessageBox.confirm('确定删除该文章吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}
const onSucess = (type) => {
  if (type === 'add') {
    params.value.pagenum = Math.ceil(
      (totalNumber.value + 1) / params.value.pagesize
    )
    getArticleList()
  }
}
const articlePreviewRef = ref(null)
const preview = (id) => {
  articlePreviewRef.value.open(id)
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra
      ><el-button @click="addArticle" type="primary"
        >添加文章</el-button
      ></template
    >
    <el-form inline>
      <el-form-item label="文章分类">
        <ChannelSelect v-model:cid="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select v-model="params.state">
          <el-option lable="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="文章标题">
        <template #default="{ row }">
          <el-link @click="preview(row.id)" type="primary" :underline="false">{{
            row.title
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template></el-table-column
      >
      <el-table-column label="状态" prop="state" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            @click="editArticle(row)"
            :icon="Edit"
            circle
            plain
          >
          </el-button>
          <el-button
            type="danger"
            @click="deleteArticle(row)"
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
    <el-pagination
      class="pagination"
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 5, 10, 20]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next"
      :total="totalNumber"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <ArticleEdit ref="articleEditRef" @sucess="onSucess"></ArticleEdit>
    <ArticlePreview ref="articlePreviewRef"></ArticlePreview>
  </PageContainer>
</template>
<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
