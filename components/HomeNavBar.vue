<template>
  <view
    class="custom__nav__content"
    :class="{ default: isDefault }"
    :style="{ width: '100%', height: navBarHeight }"
  >
    <view class="nav__title">
      <image
        v-if="isBack"
        class="img"
        :src="require('@/assets/images/back.png')"
        @click="handleBack"
      ></image>
      {{ title }}
    </view>
  </view>
</template>
<script>
export default {
  name: 'HomeNavBar',
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
  background-color: #70171b;
  display: flex;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
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
    position: relative;
    padding-bottom: pxTorpx(10);
    .img {
      display: block;
      width: pxTorpx(20);
      height: pxTorpx(20);
      position: absolute;
      left: pxTorpx(8);
      top: pxTorpx(1);
    }
  }
}
</style>
