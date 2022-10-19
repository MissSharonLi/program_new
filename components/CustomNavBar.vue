<template>
  <view class="custom__nav__wrapper">
    <view
      class="custom__nav__content"
      :class="{ default: isDefault }"
      :style="{ width: '100%', height: navBarHeight }"
    >
      <view class="nav__bar__content" :style="{ height: navBarHeight }">
        <image
          referrerPolicy="no-referrer"
          class="custom__head__bg"
          :src="require('@/assets/images/head_title_bg.png')"
        />
        <image class="dolpin1" :src="require('@/assets/images/dolpin1.png')" />
        <view class="nav__title" :style="{ height: navBarHeight }">
          <view class="title__name">
            <image class="fish" :src="require('@/assets/images/fish1.png')" />
            <image class="title" :src="require('@/assets/images/home_title.png')"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="custom__head__content" :style="{ top: navHeight + 'px' }">
      <image
        referrerPolicy="no-referrer"
        class="custom__head__content__bg"
        :style="{ 'z-index': -1, 'margin-top': -navHeight + 'px' }"
        :src="require('@/assets/images/head_title_bg.png')"
      />
    </view>
  </view>
</template>
<script>
export default {
  name: 'CustomNavBar',
  computed: {
    navBarHeight() {
      return this.$store.getters.getNavBarHeight
    },
    navHeight() {
      return Number(this.$store.getters.getNavBarHeight.replace('px', ''))
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.custom__head__content {
  position: absolute;
  left: pxTorpx(10);
  width: calc(100% - 40rpx);
  overflow: hidden;
  z-index: -1;
  &__bg {
    width: 100%;
    height: pxTorpx(290);
  }
}
.custom__head__bg {
  position: absolute;
  left: pxTorpx(10);
  width: calc(100% - 40rpx);
  top: 0;
  height: pxTorpx(290);
}
.dolpin1 {
  position: absolute;
  left: pxTorpx(30);
  top: 0;
  width: pxTorpx(50);
  height: pxTorpx(40);
}
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
  .nav__bar__content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
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
    &::before {
      content: '';
      position: absolute;
      width: pxTorpx(10);
      height: pxTorpx(10);
      display: block;
      background: url('@/assets/images/point.png') no-repeat top;
      background-size: 100% 100%;
      top: 26%;
      left: 28%;
      z-index: 9;
    }
    &::after {
      content: '';
      position: absolute;
      width: pxTorpx(10);
      height: pxTorpx(10);
      display: block;
      background: url('@/assets/images/point.png') no-repeat top;
      background-size: 100% 100%;
      top: 46%;
      right: 18%;
      z-index: 9;
    }
    .title__name {
      width: pxTorpx(225);
      height: pxTorpx(75);
      position: absolute;
      bottom: 10px;
      left: calc(50% - 250rpx);
      z-index: 1;
      .fish {
        position: absolute;
        width: pxTorpx(50);
        height: pxTorpx(30);
        display: block;
        bottom: -10rpx;
        right: -60rpx;
        z-index: 9;
      }
      &::before {
        content: '';
        position: absolute;
        width: pxTorpx(55);
        height: pxTorpx(75);
        display: block;
        background: url('@/assets/images/lantern.png') no-repeat top;
        background-size: 100% 100%;
        top: 0;
        left: -60rpx;
      }
      &::after {
        content: '';
        position: absolute;
        width: pxTorpx(55);
        height: pxTorpx(75);
        display: block;
        background: url('@/assets/images/lantern.png') no-repeat top;
        background-size: 100% 100%;
        top: 0;
        right: -110rpx;
      }
      .title {
        width: 90%;
        height: pxTorpx(90);
        margin: 0 auto -15px;
      }
    }
  }
}
</style>
