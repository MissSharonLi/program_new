<template>
  <view class="content bind__wrapper">
    <view class="bind__content">
      <view class="bind__list">
        <view class="bind__success">
          <image class="img" :src="require('@/assets/images/phone.png')"></image>
          <view class="text">已绑定手机</view>
          <view class="text">{{ mobile }}</view>
        </view>
        <view class="bind__button" @click="handleSubmit">更换绑定手机</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      mobile: ''
    }
  },
  methods: {
    handleSubmit() {
      uni.redirectTo({ url: '/pages/personal/bindPhone' })
    }
  },
  onLoad(options) {
    this.mobile = options.mobile
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.bind {
  &__list {
    height: 100vh;
    padding: 0 pxTorpx(15);
  }
  &__success {
    @include flex(center, center, wrap);
    padding-top: pxTorpx(50);
    .img {
      width: pxTorpx(100);
      height: pxTorpx(100);
      display: block;
      margin-bottom: pxTorpx(20);
    }
    .text {
      font-family: $PingFang;
      font-weight: 400;
      font-size: pxTorpx(14);
      color: rgba(16, 16, 16, 1);
      display: block;
      width: 100%;
      text-align: center;
    }
  }
  &__button {
    height: pxTorpx(35);
    background-color: $sub-nav-theme-color;
    color: $white;
    border-radius: pxTorpx(10);
    font-size: pxTorpx(14);
    text-align: center;
    margin-top: pxTorpx(30);
    line-height: pxTorpx(35);
  }
}
</style>
