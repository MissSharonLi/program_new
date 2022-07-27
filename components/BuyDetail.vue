<template>
  <VanPopup
    custom-class="custom__van__popup"
    :show="show"
    round
    custom-style="height:700rpx;background:transparent;padding-bottom: 0;padding:0 5px"
    position="bottom"
    @close.native="handleClose"
  >
    <view class="buy__content">
      <view class="buy__list__content">
        <view class="buy__number">{{ params.num }}发</view>
        <view class="buy__way">
          {{ params.is_score === 0 ? '点数余额' : '积分数' }}：{{
            params.is_score === 0 ? userInfo.money || 0 : userInfo.score || 0
          }}
        </view>
        <view v-if="params.is_score === 0" class="buy__list">
          <view class="button" @click="handleToPay(1)">钱袋余额支付</view>
          <view class="button" @click="handleToPay(2)">微信支付</view>
        </view>
        <view v-else class="buy__list">
          <view class="button" @click="handleToPay(3)">积分支付</view>
        </view>
        <view class="special">购买则表示已阅读并同意协议</view>
        <view class="buy__tips">
          {{ params.notice }}
        </view>
      </view>
    </view>
  </VanPopup>
</template>
<script>
import { api } from '@/api'
import VanPopup from '@/wxcomponents/vant/popup/index'
export default {
  name: 'BuyDetail',
  components: {
    VanPopup
  },
  props: {
    params: {
      type: Object,
      default: () => {}
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
    },
    handleSuccess(data) {
      this.$toast('购买成功！')
      this.$emit('success', data)
      this.show = false
    },
    async handleToPay(type) {
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
.special {
  font-size: pxTorpx(14);
  color: $white;
}
.buy {
  &__content {
    min-height: 100%;
    background: url('@/assets/images/bg.png') no-repeat center;
    background-size: 100% 100%;
  }
  &__list__content {
    padding: pxTorpx(20) pxTorpx(20);
  }
  &__number {
    width: pxTorpx(180);
    height: pxTorpx(60);
    line-height: pxTorpx(60);
    display: block;
    box-shadow: #8c4300 5px 5px 0px 0px;
    color: rgb(255, 0, 0);
    border-radius: pxTorpx(15);
    font-size: pxTorpx(36);
    text-align: center;
    font-weight: bold;
    background: url('@/assets/images/bt.png') no-repeat center;
    background-size: 100% 100%;
    margin: pxTorpx(25) auto;
    font-family: $STHupo;
  }
  &__way {
    font-family: 'PingFangSC';
    font-weight: 700;
    font-size: 16px;
    color: rgba(251, 176, 59, 1);
  }
  &__list {
    @include flex(center, center);
    margin: pxTorpx(25) 0;
    .button {
      width: pxTorpx(120);
      height: pxTorpx(50);
      line-height: pxTorpx(50);
      box-shadow: #8c4300 5px 5px 0px 0px;
      color: rgb(66, 33, 11);
      border-radius: pxTorpx(4);
      font-size: pxTorpx(18);
      text-align: center;
      font-weight: bold;
      background: rgb(251, 176, 59);
      &:last-child {
        margin-left: pxTorpx(40);
      }
    }
  }
  &__tips {
    font-family: 'PingFangSC';
    font-size: pxTorpx(12);
    color: $white;
    text-align: justify;
    line-height: 1.5;
    margin: pxTorpx(25) 0 pxTorpx(5);
  }
}
</style>
