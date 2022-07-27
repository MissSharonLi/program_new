<template>
  <view class="order__detail__wrapper">
    <view class="order__detail__status">
      <text>{{ returnObj.status_text }}</text>
      <image class="img" :src="require('@/assets/images/logistics.png')"></image>
    </view>
    <view class="order__detail__list">
      <view
        v-if="returnObj.status === 4 || returnObj.status === 5"
        class="order__detail__item logistics"
        @click="handleOperation"
      >
        查看物流
      </view>
      <view
        v-if="returnObj.status === 3 || returnObj.status === 4 || returnObj.status === 5"
        class="order__detail__item addresses"
      >
        <view class="information">
          <view class="text">
            <text class="name">{{ returnObj.address.name }}</text>
            <text class="address">{{ returnObj.address.mobile }}</text>
          </view>
          <view class="address">
            {{ returnObj.address.address_full }}
          </view>
        </view>
      </view>
    </view>
    <view class="collection__list">
      <view class="collection__item">
        <text class="collection__time">{{ returnObj.createtime }}</text>
        <view class="collection__images">
          <image class="img" :src="returnObj.goods.goods_image"></image>
          <view class="collection__detail">
            <text class="title">{{ returnObj.goods.goods_name }}</text>
            <view class="price">
              <text>{{ returnObj.goods.item_name }}</text>
              <text>￥{{ returnObj.goods.goods_price }}/张</text>
            </view>
          </view>
        </view>
        <view class="collection__footer">
          <text class="label">订单总价</text>
          <text class="price">￥{{ returnObj.price }}</text>
        </view>
      </view>
    </view>
    <view class="order__detail__footer">
      <view class="order__detail__footer__title">订单信息</view>
      <view class="order__detail__footer__list">
        <view class="order__detail__footer__item">
          <text class="label">订单编号</text>
          <view class="time">
            <text>{{ returnObj.order_sn }}</text>
            <text class="copy" @click="handleCopy(returnObj.order_sn)">复制</text>
          </view>
        </view>
        <view class="order__detail__footer__item">
          <text class="label">下单时间</text>
          <text class="time">{{ returnObj.createtime }}</text>
        </view>
        <view class="order__detail__footer__item">
          <text class="label">付款时间</text>
          <text class="time">{{ returnObj.pay_time }}</text>
        </view>
        <view class="order__detail__footer__item">
          <text class="label">发货时间</text>
          <text class="time">{{ returnObj.express_time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  data() {
    return {
      returnObj: {}
    }
  },
  onLoad(options) {
    this.query(options.order_id)
  },
  methods: {
    async query(id) {
      const { code, data } = await api.getOrderDetail({ token: this.token, order_id: id })
      if (code === 1 && data) {
        this.returnObj = data || {}
      }
    },
    handleCopy(data) {
      uni.setClipboardData({ data })
    },
    handleOperation() {
      wx.navigateTo({ url: '/pages/personal/deliveryInfo?order_id=' + this.returnObj.id })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.order__detail {
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
    background-color: $sub-nav-theme-color;
    padding: pxTorpx(20);
  }
  &__item {
    position: relative;
    padding-left: pxTorpx(40);
    font-family: 'SourceHanSansSC';
    font-weight: 400;
    font-size: pxTorpx(14);
    color: $white;
    text-align: justify;
    @include flex(center, '', 'wrap');
    &.logistics {
      padding-bottom: pxTorpx(20);
      border-bottom: 1px solid #10101014;
      margin-bottom: pxTorpx(20);
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        width: pxTorpx(21);
        height: pxTorpx(21);
        background: url('@/assets/images/arrow.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    &::before {
      content: '';
      display: block;
      width: pxTorpx(27);
      height: pxTorpx(27);
      border-radius: 50%;
      position: absolute;
      background: url('@/assets/images/logistics.png') no-repeat center center;
      background-color: $theme-light-color;
      background-size: 60%;
      left: 0;
    }
    &.addresses {
      &::before {
        content: '';
        display: block;
        width: pxTorpx(27);
        height: pxTorpx(27);
        border-radius: 50%;
        position: absolute;
        background: url('@/assets/images/location_a.png') no-repeat center center;
        background-color: $theme-light-color;
        background-size: 60%;
        left: 0;
      }
    }
    .name {
      margin-right: pxTorpx(10);
    }
    .address {
      font-size: pxTorpx(12);
    }
  }
  &__footer {
    padding: pxTorpx(15) pxTorpx(20);
    margin-top: pxTorpx(10);
    background-color: $sub-nav-theme-color;
    font-size: pxTorpx(14);
    font-family: $SourceHanSansSC;
    color: $white;
    &__title {
      font-weight: 700;
      font-size: pxTorpx(14);
      color: $white;
      @include flex(center, '');
      margin-bottom: pxTorpx(15);
      &::before {
        content: '';
        display: block;
        width: pxTorpx(4);
        height: pxTorpx(15);
        background-color: #ea5402;
        margin-right: pxTorpx(5);
      }
    }
    &__list {
      font-weight: 400;
    }
    &__item {
      @include flex(center, space-between);
      margin-bottom: pxTorpx(10);
      .time {
        font-size: pxTorpx(12);
      }
      &:first-child {
        .time {
          @include flex(center, space-between);
          .copy {
            color: #ea5404;
            display: block;
            margin-left: pxTorpx(10);
          }
        }
      }
    }
  }
}
.collection {
  &__list {
    background-color: $sub-nav-theme-color;
    padding: pxTorpx(15) pxTorpx(20);
    margin-top: pxTorpx(10);
  }
  &__item {
    border-radius: pxTorpx(5);
  }
  &__time {
    font-family: 'PingFangSC';
    font-weight: 400;
    font-size: pxTorpx(13);
    color: $white;
    margin-bottom: pxTorpx(10);
    margin-top: pxTorpx(5);
    display: block;
  }
  &__images {
    @include flex(center, '');
    padding: pxTorpx(10) 0;
    border-top: 1px solid #10101014;
    border-bottom: 1px solid #10101014;
    .img {
      width: pxTorpx(80);
      height: pxTorpx(80);
      position: relative;
      margin-right: pxTorpx(20);
    }
    .title {
      font-family: 'PingFangSC';
      font-weight: 700;
      font-size: pxTorpx(14);
      color: $white;
      margin-bottom: pxTorpx(30);
      display: block;
    }
    .price {
      font-family: $SFUIText;
      font-weight: 400;
      font-size: pxTorpx(12);
      color: $white;
      display: block;
      @include flex(center, space-between);
    }
  }
  &__detail {
    width: calc(100% - 200rpx);
  }
  &__footer {
    font-family: $SourceHanSansSC;
    font-weight: 400;
    font-size: pxTorpx(14);
    color: $white;
    margin-top: pxTorpx(15);
    @include flex(center, space-between);
    .price {
      font-size: pxTorpx(12);
    }
  }
}
</style>
