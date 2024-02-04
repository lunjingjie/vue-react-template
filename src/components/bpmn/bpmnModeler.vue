<template>
  <div class="a_flex" style="justify-content: space-between">
    <div class="a_flex">
      <CBtn :showType="BTN_TYPE.back" @click="getBack"></CBtn>
    </div>

    <a-space>
      <a-button type="primary" @click="$refs.files.click()">导入</a-button>

      <a-button type="primary" @click="saveBpmn()">导出</a-button>
      <a-button type="primary" @click="updateDeployment()">保存</a-button>
    </a-space>
  </div>

  <a-spin :spinning="spinning">
    <div class="containers">
      <div class="canvas" ref="canvas"></div>
      <div class="panel" id="js-properties-panel"></div>
      <input
        type="file"
        @change="inputfile()"
        id="fileItem"
        ref="files"
        style="display: none"
      /> </div
  ></a-spin>
</template>

<script setup>
  import BpmnModeler from 'bpmn-js/lib/Modeler';
  import propertiesPanelModule from 'bpmn-js-properties-panel';
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
  import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
  import customTranslate from '@/plugins/palette/customTranslate.js';
  // import { xmlStr } from '@/assets/xmlStr';

  import { onMounted, ref } from 'vue';

  const props = defineProps({
    xmlStr: String,
  });

  const bpmnModeler = ref(null); //bpmn建模器
  const canvas = ref(null); //画布节点

  const spinning = ref(false);
  //初始化面板方法
  const initBpmn = () => {
    const customTranslateModule = {
      translate: ['value', customTranslate],
    };
    bpmnModeler.value = new BpmnModeler({
      container: canvas.value, //获取ref为canvas的dom节点
      //加入右侧面板
      propertiesPanel: {
        parent: '#js-properties-panel',
      },

      additionalModules: [
        // 左边工具栏以及节点
        propertiesProviderModule,
        // 右边的工具栏
        propertiesPanelModule,
        // CustomPaletteProvider
        //汉化
        customTranslateModule,
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
    });
    transformCanvas(props.xmlStr);
  };

  //将字符串转化为图形并渲染方法
  const transformCanvas = async (bpmnXmlStr) => {
    try {
      const result = await bpmnModeler.value.importXML(bpmnXmlStr);
      const bpmnCanvas = bpmnModeler.value.get('canvas');
      bpmnCanvas.zoom('fit-viewport');
      console.log(result);
    } catch (error) {
      console.log('error--->', error);
    }
  };
  //保存方法
  const saveData = (suffix, data) => {
    const dataTrack = `${suffix}`;
    const a = document.createElement('a');
    const name = `diagram.${dataTrack}`;
    a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
    a.setAttribute('download', name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  //以bpmn形式保存
  const saveBpmn = () => {
    bpmnModeler.value.saveXML({ format: true }, (err, data) => {
      saveData('bpmn', data);
    });
  };
  const inputfile = () => {
    const file = document.getElementById('fileItem').files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      transformCanvas(reader.result);
    };
  };

  const updateDeployment = async () => {};
  const emits = defineEmits('getBack');
  const getBack = () => {
    emits('getBack');
  };

  onMounted(initBpmn);
</script>
<style scoped>
  .containers {
    display: flex;
    background-color: #ffffff;
    /* height: 72vh; */
    height: calc(100vh - 245px);
    margin-top: 16px;
  }
  .canvas {
    flex: 8;
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+)
      repeat !important;
  }
  .panel {
    flex: 2;
    overflow: scroll;
    height: 100%;
  }
</style>
