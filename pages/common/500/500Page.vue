<template>
  <div class="wscn-http500-container">
    <div class="wscn-http500">
      <div class="pic-500">
        <img class="pic-500__parent" src="@/assets/500_images/500.png" alt="500" />
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>

        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info"
          >Please make sure that the server is healthy, or click the button below to return to the
          homepage.</div
        >
        <a @click="$router.push({ path: '/' })" class="bullshit__return-home">Back to home</a>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  const message = computed(() => {
    return 'Sorry, there was an error with the server...';
  });
</script>

<style lang="scss" scoped>
  .wscn-http500-container {
    transform: translate(-50%, -50%);
    position: absolute;
    top: 40%;
    left: 50%;
  }
  .wscn-http500 {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 50px;
    overflow: hidden;
    .pic-500 {
      width: 360px;
      position: relative;
      float: left;
      margin-right: 50px;
      overflow: hidden;
      &__parent {
        width: 100%;
      }
    }
    .bullshit {
      position: relative;
      float: left;
      width: 300px;
      padding: 30px 0;
      overflow: hidden;
      &__oops {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        color: #1482f0;
        opacity: 0;
        margin-bottom: 20px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      &__headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        font-weight: bold;
        opacity: 0;
        margin-bottom: 10px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }
      &__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        opacity: 0;
        margin-bottom: 30px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }
      &__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #ffffff;
        opacity: 0;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }
      @keyframes slideUp {
        0% {
          transform: translateY(60px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
</style>
