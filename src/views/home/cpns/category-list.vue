<template>
  <van-tabs scrollspy class="category-list">
    <van-tab v-for="(item, index) in categories">
      <template #title>
        <div class="category-item">
          <img class="icon" :src="item.pictureUrl" alt="">
          <div class="title">{{ item.title }}</div>
        </div>
      </template>
    </van-tab>
  </van-tabs>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  categories: {
    type: Array,
    default: () => []
  }
})

const active = ref()

</script>

<style lang="less" scoped>
  .category-list {
    .category-item {
      text-align: center;

      .icon {
        width: 32px;
        height: 32px;
      }

      .title {
        font-size: 12px;
      }
    }
  }
</style>