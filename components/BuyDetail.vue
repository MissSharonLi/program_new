<template>
  <VanPopup
    custom-class="custom__van__popup"
    :show="show"
    round
    custom-style="height:900rpx;background:transparent;padding-bottom: 0;padding:0 5px"
    position="bottom"
    @close.native="handleClose"
  >
    <view class="buy__content">
      <view class="buy__top__content">
        <view class="buy__title">下单即送浪积分</view>
        <view class="buy__product__detail">
          <image class="img" :src="params.goods_image"></image>
          <view class="product__info">
            <view class="title">{{ params.goods_name }}</view>
            <view class="price">￥{{ params.goods_price }}/{{ params.sub_title }}</view>
          </view>
          <view class="num">
            ×
            <text class="text">{{ params.num }}</text>
          </view>
        </view>
        <view class="buy__price__content">
          <view class="buy__price__item">
            <text class="text">购买金额</text>
            <text class="em price">￥{{ params.goods_price }}</text>
          </view>
          <view class="buy__price__item">
            {{ params.is_score === 0 ? '剩余浪值' : '积分数' }}：{{
              params.is_score === 0 ? userInfo.money || 0 : userInfo.score || 0
            }}
          </view>
        </view>
      </view>
      <view class="buy__list__content">
        <view v-if="params.is_score === 0" class="buy__list">
          <view class="button" @click="handleToPay(1)">浪值余额支付</view>
          <view class="button" @click="handleToPay(2)">微信支付</view>
        </view>
        <view v-else class="buy__list">
          <view class="button" @click="handleToPay(3)">积分支付</view>
        </view>
        <VanCheckbox
          :value="checked"
          shape="square"
          custom-class="special"
          icon-class="icon__class"
          icon-size="10px"
          @change="handleChange"
        >
          同意
          <text class="em">{用户购买协议 } { 发货须知 }</text>
        </VanCheckbox>
        <view class="buy__tips em">
          {{ params.notice }}
        </view>
      </view>
    </view>
  </VanPopup>
</template>
<script>
import { api } from '@/api'
import VanPopup from '@/wxcomponents/vant/popup/index'
import VanCheckbox from '@/wxcomponents/vant/checkbox/index'
export default {
  name: 'BuyDetail',
  components: {
    VanPopup,
    VanCheckbox
  },
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      checked: false
    }
  },
  methods: {
    handleClose(val) {
      this.show = false
    },
    handleChange(val) {
      this.checked = !this.checked
    },
    handleSuccess(data) {
      this.$toast('购买成功！')
      this.$emit('success', data)
      this.show = false
    },
    async handleToPay(type) {
      if (!this.checked) return this.$toast('请先勾选同意')
      const params = { ...this.params, type }
      const { code, data } = await api.handleToBuy(params)
      if (code === 1) {
        if (type === 2) {
          this.$loading()
          uni.requestPayment({
            provider: 'wxpay', // 微信支付
            ...data,
            success: (res) => {
              this.handleSuccess(data.log_sn)
            },
            fail: () => {
              this.$toast('购买失败！')
            },
            compelete: () => {
              this.$hideLoading()
            }
          })
        } else {
          this.handleSuccess(data.log_sn)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
::v-deep .special,
.icon__class {
  font-size: 12px;
  .em {
    color: #f15a24;
  }
}
.buy {
  &__content {
    min-height: calc(100% - 40rpx);
    background: url('@/assets/images/bg.png') no-repeat center;
    background-size: 100% 100%;
    padding: pxTorpx(10);
  }
  &__list__content {
    padding: 0 pxTorpx(20);
  }
  &__top__content {
    .buy__title {
      width: 70%;
      height: pxTorpx(50);
      background: url('@/assets/images/bg3.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      padding-left: 30%;
      color: $white;
      line-height: pxTorpx(50);
      margin-bottom: pxTorpx(20);
      margin-top: pxTorpx(10);
      font-size: pxTorpx(14);
      padding-right: pxTorpx(10);
      &::before {
        content: '赏';
        left: 0;
        position: absolute;
        width: pxTorpx(50);
        height: pxTorpx(50);
        text-align: center;
        font-size: pxTorpx(20);
      }
    }
  }
  &__product__detail {
    position: relative;
    @include flex(top, flex-start);
    margin-bottom: pxTorpx(10);
    .img {
      width: pxTorpx(100);
      height: pxTorpx(90);
      border: pxTorpx(5) solid $white;
      margin-right: pxTorpx(15);
    }
    .product__info {
      color: $white;
      max-width: calc(100% - 500rpx);
      font-size: pxTorpx(14);
      .title {
        margin-bottom: pxTorpx(20);
      }
      .price {
        font-size: pxTorpx(12);
      }
    }
    .num {
      position: absolute;
      right: pxTorpx(20);
      bottom: pxTorpx(30);
      color: #f7931e;
      font-size: pxTorpx(12);
      .text {
        padding-left: pxTorpx(10);
        font-size: pxTorpx(18);
      }
    }
  }
  &__price__content {
    .buy__price__item {
      &:first-child {
        padding-bottom: pxTorpx(5);
        margin-bottom: pxTorpx(5);
        border-bottom: 1px solid #808080;
      }
      @include flex(bottom, space-between);
      color: $white;
      font-size: pxTorpx(14);
      .price {
        color: #f15a24;
        font-size: pxTorpx(13);
      }
    }
  }
  &__list {
    @include flex(center, center);
    margin: pxTorpx(5) 0 pxTorpx(20);

    .button {
      width: pxTorpx(120);
      height: pxTorpx(50);
      line-height: pxTorpx(50);
      box-shadow: #808080 5px 5px 0px 0px;
      color: $white;
      border-radius: pxTorpx(4);
      font-size: pxTorpx(18);
      text-align: center;
      background: #f7931e;
      font-family: $Yuanti;
      &:last-child {
        margin-left: pxTorpx(40);
      }
    }
  }
  &__tips {
    font-family: $PingFang;
    font-size: pxTorpx(12);
    color: #f15a24;
    text-align: justify;
    line-height: 1.5;
    margin: pxTorpx(25) 0 pxTorpx(5);
  }
}
</style>
