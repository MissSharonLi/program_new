<template>
  <view class="delivery__wrapper">
    <view class="delivery__status">
      <text>已签收</text>
      <image class="img" :src="require('@/assets/images/logistics.png')"></image>
    </view>
    <view class="delivery__list">
      <view
        v-for="(item, index) in returnData"
        :key="index"
        class="delivery__item"
        :class="{ success: item.status === '签收' }"
      >
        <text class="context">{{ item.context }}</text>
        <text class="time">{{ item.time }}</text>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  data() {
    return {
      returnData: []
    }
  },
  onLoad(options) {
    this.getData(options.order_id)
  },
  methods: {
    async getData(id) {
      const { code, data } = await api.handleCheckLogistics({ token: this.token, order_id: id })
      if (code === 1) {
        this.returnData = data.data || []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.delivery {
  &__status {
    height: pxTorpx(100);
    background-color: $theme-light-color;
    padding: 0 pxTorpx(20);
    @include flex(center, space-between);
    font-family: $SourceHanSansSC;
    font-weight: 400;
    font-size: pxTorpx(16);
    color: $white;
    .img {
      width: pxTorpx(54);
      height: pxTorpx(42);
    }
  }
  &__list {
    padding: pxTorpx(20);
  }
  &__item {
    padding-left: pxTorpx(40);
    position: relative;
    min-height: pxTorpx(30);
    padding-bottom: pxTorpx(30);
    &::before {
      content: '';
      display: block;
      width: pxTorpx(20);
      height: pxTorpx(20);
      background: url('@/assets/images/to.png') no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    &.success {
      &::before {
        content: '收';
        font-size: pxTorpx(12);
        color: $white;
        line-height: pxTorpx(20);
        text-align: center;
        background: $theme-light-color;
        border-radius: 50%;
      }
      .context {
        color: $theme-light-color;
      }
    }
    &:not(:last-child) {
      &::after {
        content: '';
        width: pxTorpx(1);
        height: calc(100% - 80rpx);
        position: absolute;
        background-color: #bbbbbb;
        left: pxTorpx(10);
        top: pxTorpx(30);
      }
    }
    .context {
      font-family: 'PingFangSC';
      font-weight: 400;
      font-size: pxTorpx(14);
      color: rgb(16, 16, 16);
      display: block;
      text-align: justify;
      line-height: 1.8;
      margin-bottom: pxTorpx(10);
    }
    .time {
      font-family: 'PingFangSC';
      font-weight: 400;
      font-size: pxTorpx(12);
      color: rgba(168, 168, 168, 1);
    }
  }
}
</style>
