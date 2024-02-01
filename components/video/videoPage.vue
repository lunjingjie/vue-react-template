<template>
  <div class="home">
    <video :id="videoId" controls autoplay muted style="height: 100%"> </video>
    <div style="display: flex; justify-content: space-between">
      <div style="display: inline-block">
        <a-button type="link" title="停止播放" size="small" @click="stopVideo"
          ><caret-right-filled style="color: white"
        /></a-button>
        <a-button type="link" title="开始播放" size="small" @click="getVideoUrl(props.videoId)"
          ><play-circle-outlined style="color: white"
        /></a-button>
      </div>
      <div style="display: inline-block">
        <a-button type="link" title="向左移动" size="small" @click="controlVideo(1)"
          ><arrow-left-outlined style="color: white"
        /></a-button>
        <a-button type="link" title="向右移动" size="small" @click="controlVideo(2)"
          ><arrow-right-outlined style="color: white"
        /></a-button>
        <a-button type="link" title="向上移动" size="small" @click="controlVideo(3)"
          ><arrow-up-outlined style="color: white"
        /></a-button>
        <a-button type="link" title="向下移动" size="small" @click="controlVideo(4)"
          ><arrow-down-outlined style="color: white"
        /></a-button>
        <a-button type="link" title="放大" size="small" @click="controlVideo(5)"
          ><plus-square-filled style="color: white"
        /></a-button>
        <a-button type="link" title="缩小" size="small" @click="controlVideo(6)"
          ><minus-square-filled style="color: white"
        /></a-button>
        <a-button type="link" size="small" style="color: white" @click="controlVideo(7)"
          >近焦距</a-button
        >
        <a-button type="link" size="small" style="color: white" @click="controlVideo(8)"
          >远焦距</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  /*
视频组件：
  接收父组件传过来的参数（这里只定义了id）后调用接口获取视频路径开始播放视频

使用方法：
  父组件(如果是弹窗类型的要传dialog，不是的话可以不用)
    <flv-video :videoId="id" :dialog="visible" "></flv-video>
    传值
    const id = ref('1');

PS:提示信息只是为了测试方法是否有调用，可删除
*/

  import flvjs from 'flv.js';
  import { watch, onBeforeUnmount } from 'vue';
  import { onMounted, ref } from 'vue';
  import { videoApi, cameraStartControl, cameraStopControl, touchLiveVideo } from '../../api/video';
  import { message } from 'ant-design-vue';
  const flvPlayer = ref(null);
  const controlTime = ref([]);
  const touchTime = ref([]);

  //模拟视频数据
  const url = ref();

  //接收其他组件传过来的值
  const props = defineProps({
    dialog: Boolean,
    videoId: String,
  });
  onMounted(() => {
    getVideoUrl(props.videoId);
  });

  watch(
    () => props.dialog,
    (newV) => {
      newV ? getVideoUrl(props.videoId) : stopVideo();
    },
  );
  watch(
    () => props.videoId,
    (newV) => {
      getVideoUrl(newV);
    },
  );

  //拉流
  const getVideoUrl = async (param) => {
    const { data } = await videoApi(param);
    if (data.code === 200) {
      data.data.forEach((item) => {
        if (param == item.id) {
          url.value = item.url;
        }
      });
      openVideo();
      updateTouchLiveVideo(param);
      touchTime.value.push(
        setInterval(async () => {
          updateTouchLiveVideo(param);
        }, 30000),
      );
    }
  };

  //开始播放
  const openVideo = () => {
    if (props.url !== '') {
      if (flvjs.isSupported()) {
        var video = document.getElementById(props.videoId);
        flvPlayer.value = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: url.value,
        });
        flvPlayer.value.attachMediaElement(video);
        flvPlayer.value.load();
        flvPlayer.value.play();
      }
    }
  };

  //停止播放
  const stopVideo = () => {
    if (flvPlayer.value !== null || flvPlayer.value !== undefined) {
      flvPlayer.value.pause();
      flvPlayer.value.unload();
      flvPlayer.value.destroy();
    }
  };
  //远程设备控制
  const controlVideo = async (val) => {
    const param = {
      id: val,
      url: url.value,
    };
    const { data } = await cameraStartControl(param);
    data.code === 200 ? message.success(data.message) : message.error(data.message);
    controlTime.value.push(
      setTimeout(async () => {
        const { data } = await cameraStopControl(param);
        message.success(data.message);
        clearInterval(controlTime.value);
      }, 2000),
    );
  };
  //直播心跳包活
  const updateTouchLiveVideo = async (val) => {
    const time = new Date();
    const param = {
      id: val,
      url: url.value,
      t: time.getTime(),
    };
    const { data } = await touchLiveVideo(param);
    message.success(data.message);
  };

  onBeforeUnmount(() => {
    // stopVideo();
    clearInterval(controlTime.value);
    clearInterval(touchTime.value);
    // if (flvPlayer.value !== null) {
    //   flvPlayer.value.pause();
    //   flvPlayer.value.unload();
    //   flvPlayer.value.destroy();
    // }
  });
</script>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    background-color: black;
  }
</style>
