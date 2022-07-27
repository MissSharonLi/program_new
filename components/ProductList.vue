<template>
  <view class="product__list__content">
    <view
      v-for="(item, index) in dataSource"
      :key="index"
      class="list__item"
      @click="handleClick(item)"
    >
      <image
        class="list__item__image"
        :class="{ sold__out: item.stock_num === 0 }"
        :src="item.goods_image"
      ></image>
      <text class="label">{{ item.tag_title }}:{{ item.stock_num }}/{{ item.goods_num }}</text>
      <text class="number">{{ item.stock_num }}/{{ item.goods_num }}</text>
      <view class="title">{{ item.goods_name }}</view>
      <view class="sub__title">
        {{ item.goods_price }}{{ item.is_score === 0 ? '元' : '积分' }}/张
      </view>
    </view>
    <view v-if="dataSource.length === 0" class="empty">暂无数据哦~</view>
  </view>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClick(item) {
      uni.navigateTo({
        url: '/pages/product/detailV2?id=' + item.id
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.product__list__content {
  @include flex(center, space-between, wrap);
  padding: pxTorpx(5) pxTorpx(15);
  .list__item {
    width: calc(50% - 20rpx);
    min-height: pxTorpx(40);
    margin-bottom: pxTorpx(10);
    position: relative;
    &__image {
      width: pxTorpx(160);
      height: pxTorpx(165);
      border-radius: pxTorpx(26);
      position: relative;
      &.sold__out {
        &::after {
          content: '售罄';
          display: block;
          width: pxTorpx(50);
          height: pxTorpx(28);
          line-height: pxTorpx(28);
          background-color: $sub-nav-theme-color;
          border-radius: pxTorpx(10);
          text-align: center;
          position: absolute;
          top: pxTorpx(70);
          left: pxTorpx(60);
          color: $theme-light-color;
          font-size: pxTorpx(16);
        }
        &::before {
          content: '';
          position: absolute;
          width: pxTorpx(160);
          height: pxTorpx(165);
          border-radius: pxTorpx(26);
          display: block;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.6);
        }
      }
    }
    .label {
      position: absolute;
      top: pxTorpx(8);
      left: pxTorpx(10);
      font-family: $FZYuan;
      font-size: pxTorpx(12);
      color: #ff0000;
      letter-spacing: 1px;
      padding: pxTorpx(2);
      background-color: $white;
      border-radius: pxTorpx(20);
    }
    .number {
      position: absolute;
      top: pxTorpx(8);
      right: pxTorpx(15);
      font-family: $FZYuan;
      font-size: pxTorpx(12);
      color: #000;
      letter-spacing: 1px;
      padding: pxTorpx(2);
      background-color: $white;
      border-radius: pxTorpx(20);
    }
    .title {
      font-family: $FZYuan;
      font-weight: 700;
      font-size: pxTorpx(14);
      color: $white;
      letter-spacing: 1px;
      margin-top: pxTorpx(5);
    }
    .sub__title {
      font-family: $FZYuan;
      font-weight: 700;
      font-size: 16px;
      color: $tips-color;
      margin-top: pxTorpx(5);
    }
  }
  .empty {
    color: #999;
    font-size: 14px;
    text-align: center;
    margin: 20px auto;
  }
}
</style>
