<template>
  <div class="home" style="width: 100%; height: 100%">
    <!-- <a-modal v-model:visible="visible" :footer="null" :closable="false">
      <flv-video :videoId="dialogId" :dialog="visible" ref="child"></flv-video>
    </a-modal> -->
    <flv-video :videoId="id" ref="child"></flv-video>
    <!-- <a-button @click="showModal('1')" >按钮一</a-button>
    <a-button @click="showModal('2')">按钮二</a-button> -->
  </div>
</template>

<script setup>
  import FlvVideo from '@/components/video/videoPage.vue';
  import { ref } from 'vue';
  // const visible = ref(false);
  // const dialogId = ref('');
  const id = ref('1');

  // const showModal = (param) => {
  //   visible.value = true;
  //   dialogId.value = param;
  // };
</script>
