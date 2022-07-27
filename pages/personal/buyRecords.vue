<template>
  <view class="collection__wrapper">
    <view class="collection__list">
      <view v-for="(item, index) in returnData" :key="index" class="collection__item">
        <text class="collection__time">{{ item.pay_time }}</text>
        <view class="collection__images">
          <image class="img" :src="item.goods_image"></image>
          <view class="collection__detail">
            <text class="title">{{ item.goods_name }}</text>
            <view class="price">￥{{ item.goods_price }}/张</view>
          </view>
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
      params: { page: 1 },
      returnData: []
    }
  },
  onLoad() {
    this.getData()
  },
  onReachBottom() {
    this.params.page++
    this.getData()
  },
  methods: {
    async getData() {
      const { code, data } = await api.getBuyLogList({ ...this.params, token: this.token })
      if (code === 1 && data) {
        if (data.data.length > 0) {
          this.returnData = this.returnData.concat(data.data)
        } else {
          this.params.page > 1 ? this.$toast('没有更多数据了') : this.$toast('暂无数据')
          this.params.page > 1 ? this.params.page-- : (this.returnData = [])
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.collection {
  &__list {
    padding: pxTorpx(10);
  }
  &__item {
    background-color: $sub-nav-theme-color;
    padding: pxTorpx(10);
    border-radius: pxTorpx(5);
    margin-bottom: pxTorpx(10);
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
    padding: pxTorpx(10);
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
      text-align: right;
    }
  }
  &__detail {
    width: calc(100% - 200rpx);
  }
}
</style>
