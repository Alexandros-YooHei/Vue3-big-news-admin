<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article'

const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const formRef = ref(null)
const emit = defineEmits(['sucess'])

const rules = {
  cate_name: [
    { required: true, message: '请输入分类名', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}
const dialogVisible = ref(false)
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
const onSubmit = async () => {
  await formRef.value.validate()
  if (formModel.value.id) {
    await artEditChannelService(formModel.value)
  } else {
    await artAddChannelService(formModel.value)
  }
  dialogVisible.value = false
  emit('sucess')
}
const handleClose = () => {
  formRef.value.clearValidate()
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      lable-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
