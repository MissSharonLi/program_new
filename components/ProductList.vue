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
      <view class="list__item__content">
        <text class="number">{{ item.stock_num }}/{{ item.goods_num }}</text>
        <view class="title">{{ item.goods_name }}</view>
        <view class="sub_label">
          {{ item.is_score === 0 ? '￥' : '' }}
          <text class="sub__title">{{ item.goods_price }}</text>
          {{ item.is_score === 0 ? '' : '积分' }}/张
        </view>
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
    background-color: $white;
    border-bottom-left-radius: pxTorpx(10);
    border-bottom-right-radius: pxTorpx(10);
    &__image {
      width: 100%;
      height: pxTorpx(130);
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
          width: 100%;
          height: pxTorpx(165);
          display: block;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.6);
        }
      }
    }
    &__content {
      padding: pxTorpx(5) pxTorpx(5) pxTorpx(10);
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
      top: 0;
      right: 0;
      font-family: $FZYuan;
      font-size: pxTorpx(12);
      color: $white;
      letter-spacing: 1px;
      padding: pxTorpx(4);
      background-color: rgba(0, 0, 0, 0.6);
    }
    .title {
      font-family: $FZYuan;
      font-weight: 700;
      color: #231815;
      font-size: pxTorpx(14);
      letter-spacing: 1px;
    }
    .sub__title {
      font-family: $FZYuan;
      font-weight: 700;
      font-size: pxTorpx(16);
      color: $tips-color;
      margin-top: pxTorpx(5);
      padding: 0 pxTorpx(5) 0 0;
    }
    .sub_label {
      font-size: pxTorpx(14);
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
