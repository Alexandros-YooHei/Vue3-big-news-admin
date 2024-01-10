<script setup>
import { nextTick, ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)
const formModel = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
})
const imageUrl = ref('')
const formRef = ref(null)
const imgChange = (file) => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formModel.value.cover_img = file.raw
  formRef.value.validateField('cover_img')
}

const editorRef = ref(null)
const open = async (row) => {
  visibleDrawer.value = true
  if (row?.id) {
    console.log(row.id)
    const {
      data: { data }
    } = await artGetDetailService(row.id)
    formModel.value = data
    imageUrl.value = baseURL + formModel.value.cover_img
    formModel.value.cover_img = await imageUrlToFile(
      imageUrl.value,
      formModel.value.cover_img
    )
  } else {
    formModel.value = {}
    imageUrl.value = ''
    nextTick(() => {
      editorRef.value.setHTML('')
    })
  }
}

// 将网络图片地址转换为File对象
const imageUrlToFile = async (url, fileName) => {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

const textValidates = (rule, value, callback) => {
  // reg是用于解析富文本标签里的内容，
  const reg = /(?!<(img|video).*?>)<.*?>/g
  // strings 是解析出来的内容，不包含标签
  const strings = value?.replace(reg, '') || ''
  // value是空，callback触发不能为空
  if (value === '') {
    callback(new Error('内容不能为空'))
    // 如果解析出来的内容是空或全部是空格，callback触发不能为空
  } else if (strings.match(/^[ ]*$/)) {
    callback(new Error('内容不能为空'))
  } else {
    callback()
  }
}

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 20, message: '标题不能超过20个字符', trigger: 'blur' }
  ],
  cate_id: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ],
  cover_img: [
    {
      required: true,
      message: '请选择文章封面',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      validator: textValidates,
      trigger: 'blur'
    }
  ]
}

const handleChangeSelect = (e, key) => {
  if (!e) formRef.value['validateField'](key)
  //   else if (typeof e === 'object') {
  //     if (!e.value.textContent) {
  //       formModel.value.content = e.value.textContent
  //       formRef.value.validateField(key)
  //     } else {
  //       formRef.value.clearValidate(key)
  //     }
  //   }
}

const emit = defineEmits(['sucess'])
const onPublish = async (state) => {
  await formRef.value.validate()
  formModel.value.state = state
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('sucess', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('发布成功')
    visibleDrawer.value = false
    emit('sucess', 'add')
  }
}
const handleClose = async () => {
  await ElMessageBox.confirm(
    '确定退出吗？已编辑的内容将不会被保存',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  visibleDrawer.value = false
  formRef.value.clearValidate()
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
    :before-close="handleClose"
  >
    <!-- 发表文章表单 -->
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect
          v-model:cid="formModel.cate_id"
          width="100%"
          @visible-change="handleChangeSelect($event, 'cate_id')"
        ></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="imgChange"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"
            ><Plus
          /></el-icon> </el-upload
      ></el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            v-model:content="formModel.content"
            contentType="html"
            theme="snow"
            @blur="handleChangeSelect(false, 'content')"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
