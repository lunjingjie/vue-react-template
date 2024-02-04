<template>
  <div
    :style="{
      display: 'flex',
      'justify-content': props.justifyContent,
      'flex-direction': props.flexDirection,
      ...(centerStyle || {}),
    }"
  >
    <slot></slot>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'FlexBox',
    props: {
      justifyContent: String,
      flexDirection: String,
    },
    setup(props) {
      const centerStyle =
        props.flexDirection === 'row' ? { 'align-items': 'center' } : { 'text-align': 'center' };

      return {
        centerStyle,
        props,
      };
    },
  });
</script>
