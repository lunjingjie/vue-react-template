<template>
  <span class="flex items-center">
    <Icon v-if="getIcon" :icon="getIcon" :size="18" class="mr-2" />
    {{ getName }}
  </span>
</template>
<script>
  import { computed, defineComponent } from 'vue';

  import { isNull2ReturnValue } from '@/utils';
  import { contentProps } from '../../props';

  export default defineComponent({
    name: 'MenuItemContent',
    props: contentProps,
    setup(props) {
      const getName = computed(() => isNull2ReturnValue(props.item, 'title', ''));
      const getIcon = computed(() => isNull2ReturnValue(props.item, 'icon', ''));

      return {
        getName,
        getIcon,
      };
    },
  });
</script>
