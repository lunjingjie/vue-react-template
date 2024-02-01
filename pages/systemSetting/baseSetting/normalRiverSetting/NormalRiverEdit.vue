<template>
  <div>
    <a-form
      :model="formState"
      ref="formRef"
      name="basic"
      :label-col="{
        style: {
          width: '150px',
        },
      }"
      autocomplete="off"
    >
      <a-form-item
        v-for="header in editHeaders"
        :key="header.dataIndex"
        :label="header.title"
        :name="header.dataIndex"
        :rules="{ required: header.required, message: `请输入${header.title}` }"
      >
        <CSelect
          v-if="header.dataIndex === 'basinId'"
          style="width: 400px"
          :placeholder="`${header.title}选择`"
          v-model:value="formState[header.dataIndex]"
          :options="props.basinRiverOptions"
        ></CSelect>
        <div v-else-if="header.dataIndex === 'coordinateSet'">
          <a-textarea :rows="4" v-model:value="formState[header.dataIndex]" style="width: 400px" />
          <div style="text-align: right; margin-top: 3px; margin-right: 15px">
            <a-tooltip placement="top">
              <template #title>
                <span>复制</span>
              </template>
              <a-button type="link" @click="copyCoordinateSet(formState[header.dataIndex])">
                <template #icon>
                  <Icon icon="mdi:clipboard-multiple"></Icon>
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip placement="top">
              <template #title>
                <span>{{ formState[header.dataIndex] ? '编辑' : '河涌绘制' }}</span>
              </template>
              <a-button type="link" @click="openRiverMapEdit">
                <template #icon>
                  <Icon icon="mdi:map-marker-radius"></Icon>
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </div>
        <a-input
          v-else
          style="width: 400px"
          v-model:value="formState[header.dataIndex]"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </div>
  <EditModel
    v-model:visible="visible"
    :mask="false"
    :maskClosable="false"
    width="90%"
    wrap-class-name="full-modal"
    centered
    @ok="saveFunc"
    title="河涌坐标集合"
    :confirm-loading="confirmLoading"
  >
    <div
      id="riverEditId"
      style="width: 100%; height: 100%; display: inline-block; position: relative"
    ></div>
    <CSelect
      style="position: absolute; top: 67px; left: 60px; z-index: 10000"
      :options="stationOptions"
      v-model:value="stationId"
      placeholder="关联站点"
    ></CSelect>
    <div id="tooltip"></div>
  </EditModel>
</template>
<script setup>
  import { editHeaders } from './headers';
  import { ref, onMounted, watch, nextTick, createVNode, computed } from 'vue';
  import { Modal, message as Message } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { useClipboard } from '@vueuse/core';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { useMapLayerEdit, initEditControl } from '@/hooks/web/useMapLayerEdit';
  import { useStationStore } from '@/stores/station';

  const props = defineProps({
    editInfo: Object,
    basinRiverOptions: Array,
  });

  const visible = ref(false);
  const confirmLoading = ref(false);
  const mapInstance = ref(null);

  const formState = ref({});

  const formRef = ref(null);

  const stationId = ref(null);

  watch(stationId, (val) => {
    const target = stationOptions.value.find((item) => item.value === val);
    if (target.stationLat && target.stationLng) {
      mapInstance.value.setView([target.stationLat, target.stationLng], 18);
    } else {
      Message.warning('该站点暂无经纬度信息，无法定位');
    }
  });

  const stationOptions = computed(() => {
    return useStationStore().stationOptions;
  });

  const saveFunc = () => {
    Modal.confirm({
      title: '是否生成所绘制线段的坐标集合？',
      icon: createVNode(ExclamationCircleOutlined),
      onOk() {
        formState.value.coordinateSet = JSON.stringify(currentLineList);
        visible.value = false;
        currentLineList = [];
      },
    });
  };

  let polyline = null;
  let currentLineList = [];

  // 绘制河涌
  const openRiverMapEdit = async () => {
    polyline = null;
    visible.value = true;
    await nextTick();
    if (mapInstance.value) {
      mapInstance.value.remove();
    }
    initMap();
    initEditControl(mapInstance.value);
    if (formState.value.coordinateSet && formState.value.coordinateSet !== '') {
      const lineArr = JSON.parse(JSON.parse(formState.value.coordinateSet)).map((item) => [
        item.lat,
        item.lng,
      ]);
      polyline = L.polyline(lineArr).addTo(mapInstance.value);
    }
    useMapLayerEdit(mapInstance.value, polyline, completeCb);
  };

  const completeCb = (e) => {
    if (!e) {
      // 无任何操作保存
      if (formState.value.coordinateSet && formState.value.coordinateSet !== '') {
        const lineArr = JSON.parse(JSON.parse(formState.value.coordinateSet));
        currentLineList = lineArr;
      }
      return;
    }

    // 修改保存
    const target = e.layer._latlngs.map((item) => ({
      lat: item.lat,
      lng: item.lng,
    }));
    currentLineList = target;
  };

  const initMap = () => {
    mapInstance.value = L.map('riverEditId', {
      attributionControl: false,
      maxZoom: 18,
      preferCanvas: true,
      editable: true,
    }).setView([23.00917, 113.121493], 12);
    L.tileLayer(
      'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
    ).addTo(mapInstance.value);
  };

  const validateForm = async () => {
    try {
      await formRef.value.validateFields();
      return true;
    } catch (errorInfo) {
      return false;
    }
  };

  watch(
    () => props.editInfo,
    () => {
      if (JSON.stringify(props.editInfo) === '{}') {
        formState.value = {};
        editHeaders.forEach((item) => {
          formState.value[item.dataIndex] = null;
        });
      } else {
        formatItems();
      }
    },
  );

  const copyCoordinateSet = (str) => {
    if (!str || str === '') {
      Message.warning('坐标集为空，暂无内容复制');
      return;
    }

    const { copy, isSupported } = useClipboard({ source: str });
    if (!isSupported) {
      Message.warning('复制失败');
      return;
    }

    copy(str);
    Message.success('已复制');
  };

  const formatItems = () => {
    Object.keys(props.editInfo).forEach((key) => {
      formState.value[key] = props.editInfo[key];
    });
  };

  onMounted(() => {
    if (JSON.stringify(props.editInfo) === '{}') {
      formState.value = {};
      editHeaders.forEach((item) => {
        formState.value[item.dataIndex] = null;
      });
    } else {
      formatItems();
    }
  });

  defineExpose({
    formState,
    validateForm,
  });
</script>
<style scoped>
  #tooltip {
    display: none;
    position: relative;
    top: -20px;
    background: #666;
    color: white;
    opacity: 0.8;
    padding: 10px;
    border: 1px dashed #999;
    font-family: sans-serif;
    font-size: 12px;
    height: 20px;
    line-height: 0px;
    z-index: 1000;
    text-align: center;
  }
</style>
<style lang="scss">
  .full-modal {
    .custom-modal {
      max-width: 100%;
      /* top: 0;
      padding-bottom: 0;
      margin: 0; */
    }
    .custom-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(90vh);
    }
    .custom-modal-body {
      flex: 1;
      padding: 0;
    }
  }
</style>
