<template>
  <span
    ref="elRef"
    :class="[$attrs.class, 'app-iconify anticon', spin && 'app-iconify-spin']"
    :style="getWrapStyle"
  ></span>
</template>
<script>
  import { defineComponent, ref, watch, onMounted, nextTick, unref, computed } from 'vue';
  import { isString } from '@/utils/is';

  export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Icon',
    props: {
      // icon name
      icon: String,
      // icon color
      color: String,
      // icon size
      size: {
        type: [String, Number],
        default: 20,
      },
      spin: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const elRef = ref(null);

      const getIconRef = computed(() => `${props.prefix ? props.prefix + ':' : ''}${props.icon}`);

      const update = async () => {
        const el = unref(elRef);
        if (!el) return;

        await nextTick();
        const icon = unref(getIconRef);
        if (!icon) return;

        const span = document.createElement('span');
        span.className = 'iconify';
        span.dataset.icon = icon;
        el.textContent = '';
        el.appendChild(span);
      };

      const getWrapStyle = computed(() => {
        const { size, color } = props;
        let fs = size;
        if (isString(size)) {
          fs = parseInt(size, 10);
        }

        return {
          fontSize: `${fs}px`,
          color: color,
          display: 'inline-flex',
        };
      });

      watch(() => props.icon, update, { flush: 'post' });

      onMounted(update);

      return { elRef, getWrapStyle };
    },
  });
</script>
<style lang="scss">
  $iconify-bg-color: #5551;

  .app-iconify {
    display: inline-block;
    // vertical-align: middle;
  }

  .app-iconify-spin {
    svg {
      animation: loadingCircle 1s infinite linear;
    }
  }

  span.iconify {
    display: block;
    min-width: 1em;
    min-height: 1em;
    background-color: $iconify-bg-color;
    border-radius: 100%;
  }
</style>
