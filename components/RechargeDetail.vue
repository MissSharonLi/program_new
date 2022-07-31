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
        <view class="buy__title">充值</view>
        <view class="buy__price__content">
          <view class="buy__price__item">
            <text class="text">微信充值</text>
          </view>
        </view>
      </view>
      <view class="recharge__wrapper">
        <view class="recharge__content">
          <view class="recharge__list">
            <view
              v-for="(item, index) in list"
              :key="index"
              :class="{ active: listIndex === index }"
              class="recharge__item"
              @click="handleTabs(item, index)"
            >
              {{ item }}元
            </view>
            <view
              class="recharge__item"
              :class="{ active: listIndex === 5 }"
              @click="handleTabs(modelForm.money, 5)"
            >
              其他
            </view>
          </view>
          <view class="recharge__custom">
            <text class="em">自定义金额</text>
            <view class="submit__content">
              <input v-model.number="modelForm.money" type="number" class="recharge__input" />
              <text class="submit" @click="handleSubmit"></text>
            </view>
          </view>
        </view>
        <view class="recharge__tips">
          <view class="recharge__tips__title">充值提示</view>
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
      listIndex: 5,
      modelForm: {
        money: ''
      },
      list: [],
      tipsList: ['', '', '']
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
    handleTabs(item, index) {
      this.listIndex = index
      this.modelForm.money = item
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
    min-height: calc(100% - 40rpx);
    background: url('@/assets/images/bg.png') no-repeat center;
    background-size: 100% 100%;
    padding: pxTorpx(10);
    .recharge {
      &__content {
        padding: pxTorpx(10) pxTorpx(20);
      }
      &__list {
        @include flex(center, '', wrap);
      }
      &__item {
        height: pxTorpx(46);
        line-height: pxTorpx(46);
        border: 1px solid #808080;
        text-align: center;
        margin-bottom: pxTorpx(10);
        border-radius: pxTorpx(4);
        font-family: $Yuanti;
        color: $white;
        font-size: pxTorpx(16);
        margin-bottom: pxTorpx(10);
        width: 29%;
        margin-right: 5%;
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
          @include flex(center, space-between);
        }
        .em {
          color: $white;
          display: block;
          margin-top: pxTorpx(5);
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
        color: $white;
        border-bottom: 1px solid #fff;
        position: relative;
        height: pxTorpx(65);
        line-height: pxTorpx(65);
        width: calc(100% - 80rpx);
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
}
</style>
