<template>
  <a-row>
    <a-col :span="8">
      <a-card
        size="small"
        title="标题1"
        style="margin: 5px 10px; height: 300px"
        class="customPanel"
      >
        <template #extra>
          <a-button type="link">
            <template #icon>
              <Icon icon="mdi:cursor-move"></Icon>
            </template>
          </a-button>
        </template>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card
        size="small"
        title="标题2"
        style="margin: 5px 10px; height: 300px"
        class="customPanel"
      >
        <template #extra>
          <a-button type="link">
            <template #icon>
              <Icon icon="mdi:cursor-move"></Icon>
            </template>
          </a-button>
        </template>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card
        size="small"
        title="标题3"
        style="margin: 5px 10px; height: 300px"
        class="customPanel"
      >
        <template #extra>
          <a-button type="link">
            <template #icon>
              <Icon icon="mdi:cursor-move"></Icon>
            </template>
          </a-button>
        </template>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="8">
      <a-card
        size="small"
        title="标题4"
        style="margin: 5px 10px; height: 300px"
        class="customPanel"
      >
        <template #extra>
          <a-button type="link">
            <template #icon>
              <Icon icon="mdi:cursor-move"></Icon>
            </template>
          </a-button>
        </template>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card
        size="small"
        title="标题5"
        style="margin: 5px 10px; height: 300px"
        class="customPanel"
      >
        <template #extra>
          <a-button type="link">
            <template #icon>
              <Icon icon="mdi:cursor-move"></Icon>
            </template>
          </a-button>
        </template>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card
        size="small"
        title="标题6"
        style="margin: 5px 10px; height: 300px"
        class="customPanel"
      >
        <template #extra>
          <a-button type="link">
            <template #icon>
              <Icon icon="mdi:cursor-move"></Icon>
            </template>
          </a-button>
        </template>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup name="">
  import { onMounted } from 'vue';

  const dragEvent = () => {
    let div = document.getElementsByClassName('customPanel');
    let container = null;
    // 遍历给每一个div绑定 dragstart dragover以及drop事件
    for (let i = 0; i < div.length; i++) {
      div[i].ondragstart = function () {
        container = this;
      };
      div[i].ondragover = function () {
        event.preventDefault();
      };
      div[i].ondrop = function () {
        if (container != null && container != this) {
          // 具体思路跟变量值互换一样
          let temp = document.createElement('div');
          document.body.replaceChild(temp, this); //用新建的div占据目的位置
          document.body.replaceChild(this, container); // 目的div放置在起始位置
          document.body.replaceChild(container, temp); // 起始div放置在目的位置
          console.log('执行业务逻辑');
        }
      };
    }
  };

  onMounted(() => {
    dragEvent();
  });
</script>
