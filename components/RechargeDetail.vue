<template>
  <VanPopup
    custom-class="custom__van__popup"
    :show="show"
    round
    custom-style="height:600rpx;background:transparent;padding-bottom: 0;padding:0 5px"
    position="bottom"
    @close.native="handleClose"
  >
    <view class="buy__content">
      <view class="buy__top__content">微信充值</view>
      <view class="recharge__wrapper">
        <view class="recharge__content">
          <view class="recharge__custom">
            <text class="em">自定义金额</text>
            <view class="submit__content">
              <input v-model.number="modelForm.money" type="number" class="recharge__input" />
              <text class="submit" @click="handleSubmit"></text>
            </view>
          </view>
        </view>
        <view class="recharge__tips">
          <view class="recharge__tips__item">
            {{ modelForm.money_notice }}
          </view>
        </view>
      </view>
    </view>
  </VanPopup>
</template>
<script>
import { api } from '@/api'
import VanPopup from '@/wxcomponents/vant/popup/index'

export default {
  name: 'RechargeDetail',
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
      show: false,
      modelForm: {
        money: ''
      },
      list: []
    }
  },
  methods: {
    handleClose(val) {
      this.show = false
    },
    handleSuccess(data) {
      this.$toast('充值成功！')
      this.$emit('success', data)
      this.show = false
    },
    async runApiToGetConfigList() {
      const { code, data } = await api.getConfigList()
      if (code === 1 && data) {
        this.list = data.moneylist || []
        this.modelForm = { ...data, money: data.defaultmoney || '' }
      }
    },
    // 提交充值
    async handleSubmit() {
      const { money } = this.modelForm
      if (!money) return this.$toast('请输入充值金额')
      if (Number(money) === 0) return this.$toast('充值金额不能为0')
      const { code, data } = await api.handleSubmitAmount({ money, token: this.token })
      if (code === 1 && data) {
        this.$loading('跳转中...')
        uni.requestPayment({
          provider: 'wxpay', // 微信支付
          ...data,
          success: (res) => {
            this.$toast('充值成功！')
            this.handleSuccess()
          },
          fail: () => {
            this.$toast('充值失败！')
          },
          compelete: () => {
            this.$hideLoading()
          }
        })
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
    min-height: calc(100% - 50rpx);
    padding: pxTorpx(10);
    border-radius: 20px;
    border: 2px solid #2e3192;
    background-color: #fff;
    .recharge {
      &__wrapper {
        border: 2px solid #2e3192;
        background-color: #d7fdff;
        border-radius: 20px;
      }
      &__content {
        padding: pxTorpx(5) pxTorpx(10);
      }
      &__list {
        @include flex(center, '', wrap);
      }
      &__item {
        height: pxTorpx(40);
        line-height: pxTorpx(40);
        border: 2px solid #808080;
        text-align: center;
        margin-bottom: pxTorpx(10);
        border-radius: pxTorpx(40);
        font-family: $Yuanti;
        color: $white;
        font-size: pxTorpx(16);
        margin-bottom: pxTorpx(10);
        width: 28%;
        margin-right: 5%;
        background-color: #333333;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &.active {
          color: #333;
          background-color: $white;
        }
      }
      &__custom {
        margin-top: pxTorpx(10);
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(12);
        .submit__content {
          margin-top: pxTorpx(20);
          @include flex(center, space-between);
        }
        .em {
          color: #000;
          display: block;
        }
        .submit {
          width: pxTorpx(60);
          height: pxTorpx(30);
          color: $white;
          background: url('@/assets/images/confirm.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      &__input {
        font-size: pxTorpx(35);
        color: #333;
        position: relative;
        height: pxTorpx(44);
        line-height: pxTorpx(44);
        width: calc(100% - 160rpx);
        background-color: $white;
        padding-left: pxTorpx(15);
      }
      &__tips {
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(14);
        color: $white;
        padding: pxTorpx(10) pxTorpx(20);
        margin-top: pxTorpx(10);
        &__item {
          line-height: 1.8;
          text-align: justify;
          margin-bottom: pxTorpx(5);
          font-size: pxTorpx(12);
          color: #f15a24;
          padding-top: pxTorpx(10);
        }
      }
    }
  }
  &__top__content {
    border: 2px solid #2e3192;
    color: #000;
    font-size: pxTorpx(16);
    max-width: pxTorpx(120);
    line-height: pxTorpx(44);
    height: pxTorpx(44);
    text-align: center;
    margin: pxTorpx(10) auto;
    border-radius: pxTorpx(20);
    font-family: $Yuanti;
  }
  &__price__content {
    .buy__price__item {
      &:first-child {
        padding-bottom: pxTorpx(5);
        margin-bottom: pxTorpx(5);
        border-bottom: 3px solid #808080;
      }
      @include flex(bottom, space-between);
      color: $white;
      font-size: pxTorpx(15);
      .price {
        color: #f15a24;
        font-size: pxTorpx(13);
      }
    }
  }
}
</style>
