<template>
  <view class="recharge__wrapper">
    <view class="recharge__top__content">
      <view class="left">
        <text class="label">当前余额</text>
        <view class="input">
          <text class="number">{{ userInfo.money }}</text>
          元
        </view>
      </view>
      <view class="right">
        <text class="label">累计充值</text>
        <view class="input">
          <text class="number">{{ userInfo.total_money }}</text>
          元
          <text class="path" @click="handleOperation">充值记录</text>
        </view>
      </view>
    </view>
    <view class="recharge__content">
      <view class="recharge__title">微信充值</view>
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
      <view v-if="listIndex === 5" class="recharge__custom">
        <input v-model.number="modelForm.money" type="number" class="recharge__input" />
        <text class="em">自定义充值金额</text>
      </view>
    </view>
    <view class="recharge__tips">
      <view class="recharge__tips__title">充值提示</view>
      <view class="recharge__tips__list">
        <view class="recharge__tips__item">
          {{ modelForm.money_notice }}
        </view>
      </view>
    </view>
    <view class="recharge__submit" @click="handleSubmit">确认</view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  data() {
    return {
      listIndex: 5,
      modelForm: {
        money: ''
      },
      list: [],
      tipsList: ['', '', '']
    }
  },
  onLoad() {
    this.network().runApiToGetConfigList()
  },
  methods: {
    handleTabs(item, index) {
      this.listIndex = index
      this.modelForm.money = item
    },
    handleOperation() {
      wx.navigateTo({
        url: '/pages/personal/rechargeRecords'
      })
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
            uni.navigateBack()
          },
          fail: () => {
            this.$toast('充值失败！')
          },
          compelete: () => {
            this.$hideLoading()
          }
        })
      }
    },
    network() {
      return {
        runApiToGetConfigList: async () => {
          const { code, data } = await api.getConfigList()
          if (code === 1 && data) {
            this.list = data.moneylist || []
            this.modelForm = { ...data, money: data.defaultmoney || '' }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.recharge {
  &__wrapper {
    min-height: 100vh;
  }
  &__top__content {
    color: $white;
    height: pxTorpx(94);
    font-size: pxTorpx(14);
    font-weight: normal;
    background-color: $theme-light-color;
    padding: pxTorpx(10) pxTorpx(20);
    padding-right: 0;
    @include flex(center, space-between);
    .label {
      font-family: $SourceHanSansSC;
      font-weight: 400;
      font-size: pxTorpx(14);
      color: $white;
    }
    .number {
      line-height: pxTorpx(54);
    }
    .left {
      width: 40%;
      position: relative;
      .number {
        font-size: pxTorpx(28);
        margin-right: pxTorpx(10);
      }
      &::after {
        content: '';
        border-right: 1px dashed $white;
        width: 0;
        height: pxTorpx(50);
        display: block;
        position: absolute;
        right: 0;
        top: pxTorpx(5);
      }
    }
    .right {
      width: 45%;
      margin-left: 10%;
      .number {
        font-size: pxTorpx(18);
        margin-right: pxTorpx(10);
      }
      .path {
        text-decoration: underline;
        font-size: pxTorpx(14);
        margin-left: pxTorpx(10);
      }
    }
  }
  &__content {
    padding: pxTorpx(10) pxTorpx(20);
    background-color: $sub-nav-theme-color;
  }
  &__title {
    font-family: $SourceHanSansSC;
    font-weight: 400;
    font-size: pxTorpx(14);
    color: $white;
    margin-bottom: pxTorpx(15);
    margin-top: pxTorpx(5);
    @include flex(center, '');
    &::before {
      content: '';
      display: block;
      width: pxTorpx(21);
      height: pxTorpx(21);
      background: url('@/assets/images/weixin.png') no-repeat;
      background-size: 100% 100%;
      margin-right: pxTorpx(10);
    }
  }
  &__list {
    @include flex(center, '', wrap);
  }
  &__item {
    height: pxTorpx(46);
    line-height: pxTorpx(46);
    border: 1px solid #10101014;
    text-align: center;
    margin-bottom: pxTorpx(10);
    border-radius: pxTorpx(4);
    font-family: $SourceHanSansSC;
    font-weight: 700;
    color: $white;
    font-size: pxTorpx(16);
    margin-bottom: pxTorpx(10);
    width: 29%;
    margin-right: 5%;
    &:nth-child(3n) {
      margin-right: 0;
    }
    &.active {
      color: $theme-light-color;
      border-color: $theme-light-color;
    }
  }
  &__custom {
    margin-top: pxTorpx(10);
    font-family: $SourceHanSansSC;
    font-weight: 400;
    font-size: pxTorpx(12);
    .em {
      color: $theme-light-color;
      display: block;
      margin-top: pxTorpx(5);
    }
  }
  &__input {
    font-size: pxTorpx(35);
    color: $white;
    border-bottom: 1px solid #10101014;
    position: relative;
    height: pxTorpx(65);
    line-height: pxTorpx(65);
    width: calc(100% - 80rpx);
    overflow: visible;
    &::after {
      content: '元';
      display: block;
      position: absolute;
      width: pxTorpx(40);
      text-align: right;
      right: -80rpx;
      bottom: 0;
      height: pxTorpx(44);
      font-size: pxTorpx(20);
    }
  }
  &__tips {
    background-color: $sub-nav-theme-color;
    // border-top: pxTorpx(10) solid #f8f8f8;
    font-family: $SourceHanSansSC;
    font-weight: 400;
    font-size: pxTorpx(14);
    color: $white;
    padding: pxTorpx(10) pxTorpx(20);
    margin-top: pxTorpx(10);
    &__title {
      @include flex(center, '');
      margin-bottom: pxTorpx(10);
      &::before {
        content: '';
        width: pxTorpx(4);
        display: block;
        height: pxTorpx(12);
        background-color: $theme-light-color;
        margin-right: pxTorpx(8);
      }
    }
    &__item {
      line-height: 1.8;
      text-align: justify;
      margin-bottom: pxTorpx(5);
    }
  }
  &__submit {
    height: pxTorpx(43);
    background-color: $theme-light-color;
    box-shadow: #00000066 0px 2px 6px 0px;
    color: $white;
    border-radius: pxTorpx(20);
    font-size: pxTorpx(14);
    line-height: pxTorpx(43);
    text-align: center;
    margin-top: pxTorpx(30);
    width: calc(100% - 80rpx);
    position: fixed;
    bottom: pxTorpx(20);
    left: pxTorpx(20);
  }
}
</style>
