<template>
  <view class="common__nav__wrapper">
    <view
      class="common__nav__content"
      :class="{ default: isDefault }"
      :style="{ width: '100%', height: navHeight + 'px' }"
    >
      <view class="nav__bar__content" :style="{ height: navHeight + 'px' }">
        <image
          referrerPolicy="no-referrer"
          class="common__head__bg"
          :src="require('@/assets/images/head_title_bg.png')"
        />
        <image class="dolpin1" :src="require('@/assets/images/dolpin1.png')" />
        <view class="nav__title" :style="{ height: navHeight + 'px' }">
          <image
            v-if="isBack"
            class="nav__back"
            :src="require('@/assets/images/back.png')"
            @click="handleBack"
          ></image>
          <view class="title__name">
            <image class="fish" :src="require('@/assets/images/shell.png')" />
            <image class="sugar" :src="require('@/assets/images/sugar.png')" />
            <text class="title">{{ title }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="common__head__content" :style="{ top: navHeight + 'px' }">
      <image
        referrerPolicy="no-referrer"
        class="common__head__content__bg"
        :style="{ 'z-index': -1, 'margin-top': -navHeight + 'px' }"
        :src="require('@/assets/images/head_title_bg.png')"
      />
    </view>
  </view>
</template>
<script>
export default {
  name: 'CommonNavBar',
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
    },
    navHeight() {
      return Number(this.$store.getters.getNavBarHeight.replace('px', '')) - 20
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
.common__head__content {
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
.common__head__bg {
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
.common__nav__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: bottom;
  display: flex;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999999;
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
      bottom: 0;
      left: calc(50% - 250rpx);
      z-index: 1;
      .fish {
        position: absolute;
        width: pxTorpx(30);
        height: pxTorpx(40);
        display: block;
        bottom: 10rpx;
        left: 30rpx;
        z-index: 9;
      }
      .sugar {
        position: absolute;
        width: pxTorpx(20);
        height: pxTorpx(23);
        display: block;
        bottom: 10rpx;
        right: 20rpx;
        z-index: 9;
      }
      &::before {
        content: '';
        position: absolute;
        width: pxTorpx(45);
        height: pxTorpx(65);
        display: block;
        background: url('@/assets/images/lantern.png') no-repeat top;
        background-size: 100% 100%;
        top: 10px;
        left: -60rpx;
      }
      &::after {
        content: '';
        position: absolute;
        width: pxTorpx(45);
        height: pxTorpx(65);
        display: block;
        background: url('@/assets/images/lantern.png') no-repeat top;
        background-size: 100% 100%;
        top: 10px;
        right: -110rpx;
      }
      .title {
        height: pxTorpx(44);
        margin: pxTorpx(30) auto 0;
        background: url('@/assets/images/main_title.png') no-repeat center;
        background-size: 100% 100%;
        text-align: center;
        display: block;
        color: #3e54a4;
        line-height: pxTorpx(42);
        max-width: calc(54% - 70rpx);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 pxTorpx(25) 0 pxTorpx(10);
      }
    }
  }
  .nav__back {
    position: absolute;
    width: pxTorpx(32);
    height: pxTorpx(32);
    left: pxTorpx(10);
    bottom: pxTorpx(10);
    z-index: 99999999;
  }
}
</style>
