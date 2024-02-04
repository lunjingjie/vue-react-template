<template>
  <div>
    <div class="containers">
      <div class="canvas" ref="canvas"></div
      ><!--画布区域-->
    </div>
  </div>
</template>

<script setup>
  import BpmnViewer from 'bpmn-js/lib/Viewer';
  import ModelingModule from 'bpmn-js/lib/features/modeling';
  import { ref, watch } from 'vue';
  // import { xmlStr } from '@/assets/xmlStr';

  const bpmnModeler = ref(null); //bpmn建模器
  const canvas = ref(null); //画布节点

  const props = defineProps({
    xmlStr: String,
  });

  watch(
    () => props.xmlStr,
    () => {
      init();
    },
  );

  //初始化方法
  const init = () => {
    initBpmn();
  };
  //初始化面板方法
  const initBpmn = () => {
    bpmnModeler.value = new BpmnViewer({
      container: canvas.value, //获取ref为canvas的dom节点
      //加入右侧面板
      propertiesPanel: {
        parent: '#js-properties-panel',
      },

      additionalModules: [
        ModelingModule, // 基础工具 MoveModule、SetColor 等依赖于此
      ],
    });
    transformCanvas(props.xmlStr);
  };

  //将字符串转化为图形并渲染方法
  const transformCanvas = async (bpmnXmlStr) => {
    try {
      await bpmnModeler.value.importXML(bpmnXmlStr);
      const bpmnCanvas = bpmnModeler.value.get('canvas');
      bpmnCanvas.zoom('fit-viewport');
    } catch (error) {
      console.log('error--->', error);
    }
  };

  // 高亮节点
  const renderHighlightNodes = (highlightNodes) => {
    if (!highlightNodes || !highlightNodes.length) {
      return;
    }
    const canvas = bpmnModeler.value.get('canvas');
    highlightNodes.forEach((item) => {
      canvas.addMarker(item, 'highlight');
      const ele = document.querySelector('.highlight').querySelector('.djs-visual rect');
      if (ele) {
        ele.setAttribute('stroke-dasharray', '4,4');
      }
    });
  };

  // 待办节点
  const renderTodoNodes = (highlightNodes) => {
    if (!highlightNodes || !highlightNodes.length) {
      return;
    }
    const canvas = bpmnModeler.value.get('canvas');
    highlightNodes.forEach((item) => {
      canvas.addMarker(item, 'todoNode');
      const ele = document.querySelector('.highlight').querySelector('.djs-visual rect');
      if (ele) {
        ele.setAttribute('stroke-dasharray', '4,4');
      }
    });
  };

  // 待办节点
  const renderIdoNodes = (highlightNodes) => {
    if (!highlightNodes || !highlightNodes.length) {
      return;
    }
    const canvas = bpmnModeler.value.get('canvas');
    highlightNodes.forEach((item) => {
      canvas.addMarker(item, 'iDoNode');
      const ele = document.querySelector('.highlight').querySelector('.djs-visual rect');
      if (ele) {
        ele.setAttribute('stroke-dasharray', '4,4');
      }
    });
  };

  // 高亮线段
  const renderHighlightLines = (highlightLines) => {
    if (!highlightLines || !highlightLines.length) {
      return;
    }
    const canvas = bpmnModeler.value.get('canvas');
    if (highlightLines && highlightLines.length > 0) {
      highlightLines.forEach((item) => {
        canvas.addMarker(item, 'highlight-line');
      });
    }
  };

  defineExpose({
    renderHighlightNodes,
    renderHighlightLines,
    renderTodoNodes,
    renderIdoNodes,
  });
</script>

<style scoped>
  .containers {
    background-color: #ffffff;
    width: 100%;
    height: 30vh;
    /* box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04); */
  }

  .canvas {
    width: 100%;
    height: 100%;
    padding: 12px;
  }
</style>
<style lang="scss">
  .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
    fill: rgba(251, 233, 209, 1) !important; /* color elements as green */
  }
  .highlight g.djs-visual > :nth-child(1) {
    stroke: rgba(214, 126, 125, 1) !important;
  }
  .todoNode:not(.djs-connection) .djs-visual > :nth-child(1) {
    fill: rgb(215, 230, 12) !important; /* color elements as green */
  }
  .todoNode g.djs-visual > :nth-child(1) {
    stroke: rgb(214, 126, 125, 1) !important;
  }

  .iDoNode:not(.djs-connection) .djs-visual > :nth-child(1) {
    fill: rgb(219, 217, 254) !important; /* color elements as green */
  }
  .iDoNode g.djs-visual > :nth-child(1) {
    stroke: rgb(214, 126, 125, 1) !important;
  }

  .highlight-line g.djs-visual > :nth-child(1) {
    stroke: rgba(0, 190, 0, 1) !important;
  }
</style>
