<template>
  <VanPopup
    :show="show"
    round
    custom-style="border-radius:10px;background-color:#fff;border:2px solid #0071bc"
    @close.native="handleClose"
  >
    <view class="rank__content">
      <view class="rank__title">中奖商品</view>
      <view class="rank__list">
        <view v-for="(item, index) in dataSource" :key="index" class="rank__item">
          <view class="nickname">
            <image class="img" referrerPolicy="no-referrer" :src="item.item_image"></image>
            <text>{{ item.item_name }}</text>
          </view>
          <view class="number">
            ￥
            <text class="em">{{ item.item_price }}</text>
          </view>
        </view>
      </view>
      <view class="rank__footer">
        <view class="close" @click="handleClose">关闭</view>
        <!-- <view class="check" @click="handleToDetail">查看订单</view> -->
      </view>
    </view>
  </VanPopup>
</template>
<script>
import VanPopup from '@/wxcomponents/vant/popup/index'
export default {
  name: 'BuySuccess',
  components: {
    VanPopup
  },
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    handleClose(val) {
      this.show = false
      this.$emit('success')
    },
    handleToDetail() {
      uni.navigateTo({ url: '/pages/personal/orderManagement?status=1' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.rank {
  &__content {
    width: pxTorpx(300);
    height: pxTorpx(400);
    border-radius: pxTorpx(5);
    font-family: $Yuanti;
    background-color: $white;
    &::after {
      content: '';
      position: absolute;
      width: pxTorpx(45);
      height: pxTorpx(30);
      background: url('@/assets/images/dolphin.png') no-repeat;
      background-size: 100% 100%;
      right: 0;
      top: 0;
    }
  }
  &__title {
    font-family: $PingFang;
    font-weight: 400;
    font-size: pxTorpx(14);
    color: #000;
    text-align: center;
    line-height: pxTorpx(40);
  }
  &__list {
    padding: pxTorpx(10);
    padding-top: 0;
    height: pxTorpx(300);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  &__item {
    font-size: pxTorpx(14);
    height: 50px;
    background-color: #f8dc4c;
    border: 1px solid $uni-theme-color;
    @include flex(center, space-between);
    padding: 0 pxTorpx(10);
    margin-bottom: pxTorpx(5);
    border-radius: pxTorpx(5);
    .nickname {
      font-family: $PingFang;
      font-weight: 400;
      font-size: pxTorpx(12);
      color: rgba(16, 16, 16, 1);
      @include flex(center, '');
      .img {
        width: pxTorpx(28);
        height: pxTorpx(28);
        border-radius: 50%;
        margin-right: pxTorpx(10);
      }
    }
    .number {
      font-size: pxTorpx(12);
      .em {
        color: $uni-theme-color;
      }
    }
  }
  &__footer {
    @include flex(center, center);
    .close {
      width: pxTorpx(128);
      height: pxTorpx(44);
      line-height: pxTorpx(44);
      background-color: #f8dc4c;
      color: $white;
      text-align: center;
      margin: pxTorpx(3) auto 0;
      border-radius: pxTorpx(5);
    }
    .check {
      width: pxTorpx(80);
      height: pxTorpx(30);
      line-height: pxTorpx(30);
      background-color: $sub-nav-theme-color;
      color: $white;
      text-align: center;
      margin: pxTorpx(10) auto;
      border-radius: pxTorpx(5);
    }
  }
}
</style>
