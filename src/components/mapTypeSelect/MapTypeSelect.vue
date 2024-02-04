<template>
  <div class="custom-card-shadow wrap">
    <a-popover
      arrow-point-at-center
      title="地图选择"
      trigger="click"
      placement="topRight"
      style="width: 100px"
    >
      <template #content>
        <a-radio-group v-model:value="mapTypeSelect">
          <a-radio
            v-for="(data, index) in mapType"
            :key="index"
            :style="radioStyle"
            :value="data.label"
            >{{ data.label }}</a-radio
          >
        </a-radio-group>
      </template>
      <div class="map-wrap-Style">
        <Icon icon="mdi-map" size="25" style="color: var(--custom-primary-color)"></Icon>
      </div>
    </a-popover>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';

  defineProps({
    mapTypeValue: String || Array,
  });

  const emits = defineEmits(['update:mapTypeValue']);

  const radioStyle = {
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
  };

  const mapType = [
    {
      label: '街道',
      value:
        'http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    },
    {
      label: '卫星',
      value: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    },
    // {
    //   label: '卫星混合',
    //   value: [
    //     'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    //     'https://webst02.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
    //   ],
    // },
    {
      label: '简洁',
      value:
        'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
    },
  ];

  const mapTypeSelect = ref('街道');

  watch(
    () => mapTypeSelect.value,
    () => {
      emits(
        'update:mapTypeValue',
        mapType.find((item) => item.label === mapTypeSelect.value).value,
      );
    },
    {
      immediate: true,
    },
  );
</script>
<style scoped lang="scss">
  .wrap {
    border-radius: 8px;
  }
  .map-wrap-Style {
    padding: 5px;
    background-color: #fff;
    border-radius: 8px;

    &:hover {
      cursor: pointer;
    }
  }
</style>
