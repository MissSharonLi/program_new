<template>
  <view
    class="custom__nav__content"
    :class="{ default: isDefault }"
    :style="{ width: '100%', height: navBarHeight }"
  >
    <view class="nav__bar__content" :style="{ height: navBarHeight }">
      <view class="nav__title" :style="{ height: navBarHeight }">
        <image
          v-if="isBack"
          class="img"
          :src="require('@/assets/images/back.png')"
          @click="handleBack"
        ></image>
        <image class="beauty" :src="require('@/assets/images/bg8.png')"></image>
        <image class="beauty1" :src="require('@/assets/images/bg8.png')"></image>
        <view class="title__name">
          <image class="title" :src="require('@/assets/images/home.png')"></image>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'CustomNavBar',
  props: {
    type: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    navBarHeight() {
      return this.$store.getters.getNavBarHeight
    }
  },
  methods: {
    handleBack() {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.custom__nav__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: bottom;
  display: flex;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: url('@/assets/images/head_bg.jpg') no-repeat top;
  background-size: 100% 100%;
  .nav__bar__content {
    position: relative;
    width: 100%;
    height: 100%;
    &::before {
      content: '';
      position: absolute;
      width: pxTorpx(35);
      height: pxTorpx(35);
      display: block;
      background: url('@/assets/images/flower.png') no-repeat top;
      background-size: 100% 100%;
      top: pxTorpx(10);
      left: pxTorpx(10);
    }
    &::after {
      content: '';
      position: absolute;
      width: pxTorpx(35);
      height: pxTorpx(35);
      display: block;
      background: url('@/assets/images/flower.png') no-repeat top;
      background-size: 100% 100%;
      top: pxTorpx(10);
      right: pxTorpx(10);
    }
  }
  .nav__title {
    font-family: $PingFang;
    font-weight: 700;
    font-size: pxTorpx(18);
    color: $white;
    text-align: center;
    display: block;
    margin: 0 auto;
    z-index: 99999;
    width: 100%;
    height: 100%;
    position: relative;
    padding-bottom: 0;
    .title__name {
      width: pxTorpx(225);
      min-height: pxTorpx(60);
      margin: 0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      background-color: $white;
      border-top-left-radius: 20px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      border: 8px solid #c69c6d;
      position: absolute;
      bottom: 16px;
      left: calc(50% - 130px);
      z-index: 1;
      .title {
        width: 80%;
        height: pxTorpx(65);
        margin: -10px auto 0;
      }
    }
    .img {
      display: block;
      width: pxTorpx(20);
      height: pxTorpx(20);
      position: absolute;
      left: pxTorpx(8);
      top: pxTorpx(1);
    }
    .beauty {
      display: block;
      width: pxTorpx(50);
      height: pxTorpx(25);
      position: absolute;
      right: 10%;
      bottom: 0;
      z-index: 9;
    }
    .beauty1 {
      display: block;
      width: pxTorpx(50);
      height: pxTorpx(25);
      position: absolute;
      left: 10%;
      bottom: 0;
      z-index: 9;
    }
  }
}
</style>
