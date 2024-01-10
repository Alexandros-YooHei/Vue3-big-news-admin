<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'

const channelList = ref([])
defineProps({
  cid: {
    type: [String, Number]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:cid'])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
</script>

<template>
  <!-- 父子组件中的V-model:子组件中，有两种绑定思想：
  1.拆分v-model:本质是将父组件传进来的prop与组件进行双向绑定，由于单向数据流原则，
  所以将v-model 拆成 :modelValue 与 @update:modelValue（见vue3官方文档,原生html不支持？）
  <el-select :modelValue="cid" @update:modelValue="emit('update:cid', $event)">
  2.先使用v-bind单向绑定组件的显示值(elementui中<select>组件是value-model)
    为了实现另一条数据流，将触发组件的值改变的方法(change，input等)与触发器进行绑定，
    从而触发父组件的v-model -->
  <el-select
    :model-value="cid"
    @change="emit('update:cid', $event)"
    :style="{ width: width }"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
  <!--  Todo:为什么下面两个$event内容不一样？
  <el-input @input="test($event)" /> 输入的值
  <input @input="test($event)" /> 事件对象
  element组件库中的$event是实际输入的值
  原生html中则是触发的时间对象
  -->
</template>
