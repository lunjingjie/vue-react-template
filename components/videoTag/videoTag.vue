<template>
  <div class="wrap">
    <div class="point"></div>
    <div class="line"></div>
    <div class="line2"></div>
    <div class="body" @click="handleClick">
      <span class="text">
        <slot name="name"></slot>
      </span>
    </div>
  </div>
</template>
<script setup>
  const emits = defineEmits(['click']);

  const handleClick = () => {
    emits('click');
  };
</script>
<style scoped lang="scss">
  $color: #e6c820;
  $bodyWidth: 50px;
  $bodyHeight: 30px;
  $bodyBoderColor: #f0eb92;

  .wrap {
    .point {
      width: 18px;
      height: 18px;
      background-color: none;
      border-radius: 50%;
      border: 2px solid $bodyBoderColor;
      padding: 3px;
    }
    .point:before {
      content: '';
      position: absolute;
      top: 9px;
      left: 9px;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $bodyBoderColor;
    }
    .line {
      height: 0px;
      border: 1px solid $bodyBoderColor;
      width: 24px;
      transform: rotate(130deg);
      -o-transform: rotate(130deg);
      -moz-transform: rotate(130deg);
      -webkit-transform: rotate(130deg);
      position: absolute;
      top: -8px;
      left: 10px;
    }
    .line2 {
      height: 0px;
      border: 1px solid $bodyBoderColor;
      width: $bodyWidth;
      position: absolute;
      top: -17px;
      left: 29px;
    }
    .body {
      position: relative;
      top: -57px;
      left: 53px;
      background-color: $color;
      border-radius: 10px;
      border: 2px solid $bodyBoderColor;
      padding: 0 4px;

      &:hover {
        cursor: pointer;
      }

      .text {
        top: 3px;
        left: 8px;
        color: #fff;
      }
    }
  }
</style>
