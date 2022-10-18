<template>
  <view class="product__list__content">
    <view class="product__list__item" :class="{ noEmpty: dataSource.length }">
      <view
        v-for="(item, index) in dataSource"
        :key="index"
        class="list__item"
        @click="handleClick(item)"
      >
        <view class="list__item__image__content">
          <image
            class="list__item__image"
            referrerPolicy="no-referrer"
            :class="{ sold__out: item.stock_num === 0 }"
            :src="item.goods_image"
          ></image>
        </view>
        <view class="title">
          <text class="text__name">{{ item.goods_name }}</text>
          <text class="text__number">{{ item.stock_num }}/{{ item.goods_num }}</text>
        </view>
        <view class="sub__title">
          {{ item.goods_price }}{{ item.is_score === 0 ? '浪币' : '积分' }}/张
        </view>
      </view>
      <view v-if="isEmpty" class="empty">暂无数据哦~</view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    isEmpty: {
      type: Boolean,
      default: () => false
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
  padding: 0 pxTorpx(15) pxTorpx(5);
  .product__list__item {
    border-radius: pxTorpx(16);
    border: pxTorpx(8) solid transparent;
    @include flex(center, space-between, wrap);
    padding: pxTorpx(6) pxTorpx(6);
    &.noEmpty {
      border-color: #29abe2;
    }
  }
  .list__item {
    width: calc(50% - 44rpx);
    min-height: pxTorpx(40);
    margin-bottom: pxTorpx(10);
    position: relative;
    padding: pxTorpx(7);
    border-radius: pxTorpx(18);
    border: 2px solid #000;
    &__image {
      width: 100%;
      height: pxTorpx(165);
      position: relative;
      border: 1px solid #000;
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
          left: pxTorpx(50);
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
    &__image__content {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: calc(100% + 27rpx);
        height: 340rpx;
        background-color: #2a96ff;
        top: -14rpx;
        left: -14rpx;
        border-radius: pxTorpx(16);
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
      right: pxTorpx(10);
      font-family: $FZYuan;
      font-size: pxTorpx(12);
      color: #000;
      letter-spacing: 1px;
      padding: pxTorpx(2) pxTorpx(5);
      background-color: $white;
      border-radius: pxTorpx(4);
    }
    .price {
      position: absolute;
      bottom: pxTorpx(40);
      right: pxTorpx(10);
      font-family: $FZYuan;
      font-size: pxTorpx(12);
      color: #000;
      letter-spacing: 1px;
      padding: pxTorpx(5);
      background-color: $white;
      color: #ec1b24;
      border-radius: pxTorpx(20);
    }
    .title {
      margin-top: pxTorpx(5);
      @include flex(center, space-between);
      .text__name {
        font-family: $FZYuan;
        font-weight: 700;
        font-size: pxTorpx(14);
        color: #754c24;
        letter-spacing: 1px;
        max-width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .text__number {
        font-size: pxTorpx(12);
        color: #000;
      }
    }
    .sub__title {
      font-family: $FZYuan;
      font-weight: 700;
      font-size: 14px;
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
