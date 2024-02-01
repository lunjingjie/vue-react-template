<template>
  <a-button
    v-bind="{ ...attrs, ...btnAttrs }"
    style="border-radius: 6px"
    :style="{ ...btnStyle }"
    v-auth="getKeyByValue()"
  >
    <template #icon>
      <Icon v-if="icon" :icon="icon" :size="16" />
    </template>
    <slot v-if="slotDefault && isValid"></slot>
    <span v-else-if="isValid">{{ showType }}</span>
  </a-button>
</template>
<script>
  export default {
    inheritAttrs: false,
  };
</script>
<script setup name="CBtn">
  import { computed, useAttrs, useSlots } from 'vue';
  import { BTN_TYPE, BTN_ICON_TYPE } from '@/constants';

  const slotDefault = !!useSlots().default;
  const attrs = useAttrs();
  const props = defineProps({
    showType: {
      type: String,
      required: true,
    },
  });

  const isValid = computed(() => {
    return Object.values(BTN_TYPE).includes(props.showType);
  });

  const attrsMap = new Map([
    [BTN_TYPE.search, { type: 'primary' }],
    [BTN_TYPE.reset, { type: 'default' }],
    [BTN_TYPE.add, { type: 'primary' }],
    [BTN_TYPE.upload, { type: 'info' }],
    [BTN_TYPE.download, { type: 'info' }],
    [BTN_TYPE.edit, { type: 'text' }],
    [BTN_TYPE.delete, { type: 'text' }],
    [BTN_TYPE.return, { type: 'primary' }],
    [BTN_TYPE.view, { type: 'text' }],
    [BTN_TYPE.save, { type: 'primary' }],
    [BTN_TYPE.back, { type: 'text' }],
    [BTN_TYPE.reset, { type: 'primary' }],
    [BTN_TYPE.formDownload, { type: 'text' }],
    [BTN_TYPE.preview, { type: 'text' }],
    [BTN_TYPE.dispreview, { type: 'text' }],
    [BTN_TYPE.addCompare, { type: 'primary' }],
    [BTN_TYPE.filter, { type: 'primary' }],
    [BTN_TYPE.close, { type: 'primary' }],
    [BTN_TYPE.addKey, { type: 'text' }],
    [BTN_TYPE.addmenu, { type: 'text' }],
    [BTN_TYPE.addrole, { type: 'text' }],
    [BTN_TYPE.configure, { type: 'text' }],
    [BTN_TYPE.bindDevice, { type: 'text' }],
    [BTN_TYPE.pass, { type: 'primary' }],
    [BTN_TYPE.reject, { type: 'primary' }],
    [BTN_TYPE.apply, { type: 'primary' }],
    [BTN_TYPE.disabled, { type: 'text' }],
    [BTN_TYPE.serviceIndexConfig, { type: 'primary' }],
  ]);

  const styleMap = new Map([
    [BTN_TYPE.search, {}],
    [BTN_TYPE.reset, { color: '#696B6F' }],
    [BTN_TYPE.add, { type: 'primary' }],
    [BTN_TYPE.upload, { color: '#2E5CF6', 'background-color': 'var(--info-type-btn-background)' }],
    [
      BTN_TYPE.download,
      { color: '#2E5CF6', 'background-color': 'var(--info-type-btn-background)' },
    ],
    [BTN_TYPE.edit, { color: '#2E5CF6' }],
    [BTN_TYPE.delete, { color: '#FF0000' }],
    [BTN_TYPE.view, { color: '#2E5CF6' }],
    [
      BTN_TYPE.upload,
      {
        color: 'var(--custom-primary-color)',
        'background-color': 'var(--info-type-btn-background)',
      },
    ],
    [
      BTN_TYPE.download,
      {
        color: 'var(--custom-primary-color)',
        'background-color': 'var(--info-type-btn-background)',
      },
    ],
    [BTN_TYPE.edit, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.disabled, { color: 'rgb(162 171 175)' }],
    [BTN_TYPE.delete, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.save, {}],
    [BTN_TYPE.back, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.reset, {}],
    [BTN_TYPE.formDownload, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.preview, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.dispreview, { color: 'rgb(162 171 175)' }],
    [BTN_TYPE.addCompare, {}],
    [BTN_TYPE.addKey, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.addmenu, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.addrole, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.configure, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.bindDevice, { color: 'var(--custom-primary-color)' }],
    [BTN_TYPE.pass, {}],
    [BTN_TYPE.reject, {}],
    [BTN_TYPE.apply, {}],
    [BTN_TYPE.serviceIndexConfig, { color: '#fff' }],
  ]);

  const getKeyByValue = () => {
    function objkey(obj, value, compare = (a, b) => a === b) {
      return Object.keys(obj).find((k) => compare(obj[k], value));
    }
    return objkey(BTN_TYPE, props.showType);
  };

  const btnAttrs = computed(() => {
    const showType = props.showType;
    return attrsMap.get(showType);
  });

  const btnStyle = computed(() => {
    const showType = props.showType;
    return styleMap.get(showType);
  });

  const icon = computed(() => BTN_ICON_TYPE[props.showType]);
</script>
