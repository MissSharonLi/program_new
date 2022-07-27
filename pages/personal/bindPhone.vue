<template>
  <view class="bind__wrapper">
    <SubTabs :dataSource="tabList" @tabClick="handleTab"></SubTabs>
    <view class="bind__content">
      <view class="bind__list">
        <view v-if="params.type === 1" class="bind__authorize">
          <input
            v-model="params.mobile"
            type="number"
            class="bind__authorize__input"
            placeholder="点击授权获取手机号"
            disabled
          />
          <button
            open-type="getPhoneNumber"
            class="bind__authorize__button"
            @getphonenumber="getPhoneNumber"
          >
            点击授权
          </button>
        </view>
        <view v-else class="bind__authorize">
          <input
            v-model="params.mobile"
            class="bind__authorize__input mobile"
            placeholder="输入手机号"
            type="number"
          />
          <input
            v-model="params.captcha"
            class="bind__authorize__input"
            placeholder="输入验证码"
            type="number"
          />
          <view class="bind__authorize__button" @click="handleGetVerifyCode">
            {{ time === 60 ? '获取验证码' : `${time}s` }}
          </view>
        </view>
        <view class="bind__button" @click="handleSubmit">确认</view>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
import SubTabs from '@/components/SubTabs'
export default {
  components: {
    SubTabs
  },
  data() {
    return {
      time: 60,
      tabList: [
        { label: '直接授权', value: 1 },
        { label: '手动收入', value: 2 }
      ],
      params: {
        type: 1,
        mobile: '',
        captcha: ''
      }
    }
  },
  methods: {
    handleTab(index) {
      this.params.type = index
    },
    // 获取验证码
    async handleGetVerifyCode() {
      const { mobile } = this.params
      if (!mobile) return this.commonUtils.toast('请输入手机号码')
      if (!this.commonUtils.isPhoneAvailable(mobile)) {
        return this.commonUtils.toast('请输入正确的手机号码')
      }
      if (this.time < 60) return this.$toast('请稍后再发送验证码')
      const { code } = await api.getVerifyCode({
        mobile: this.params.mobile,
        token: this.token,
        event: 'changemobile'
      })
      if (code === 1) {
        this.$toast('发送成功！')
        this.time--
        const timer = setInterval(() => {
          if (this.time === 0) {
            this.time = 60
            return clearInterval(timer)
          }
          this.time--
        }, 1000)
      }
    },
    async handleSubmit() {
      const { type, mobile, captcha } = this.params
      if (!mobile) return this.commonUtils.toast('请输入手机号码')
      if (!this.commonUtils.isPhoneAvailable(Number(mobile))) {
        return this.commonUtils.toast('请输入正确的手机号码')
      }
      if (type === 2 && !captcha) return this.$toast('请输入验证码')
      const { code } = await api.handleBindMobile({
        ...this.params,
        type: this.params.type === 1 ? 2 : 1,
        token: this.token
      })
      if (code === 1) {
        this.$toast('绑定成功！')
        uni.redirectTo({ url: '/pages/personal/bindSuccess?mobile=' + this.params.mobile })
      }
    },
    async getPhoneNumber(e) {
      const { code, data } = await api.handleAuthorityToGetPhone({
        code: e.detail.code,
        token: this.token
      })
      if (code === 1 && data) this.params.mobile = data.phone_number
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.bind {
  &__content {
    padding-top: pxTorpx(60);
  }
  &__list {
    height: calc(100vh - 120rpx);
    // background: $white;
    padding: 0 pxTorpx(15);
  }
  &__authorize {
    padding-top: pxTorpx(15);
    @include flex(center, space-between, wrap);
    &__input {
      width: pxTorpx(215);
      height: pxTorpx(35);
      background-color: rgb(245, 245, 245);
      border-radius: pxTorpx(5);
      font-size: pxTorpx(14);
      padding: 0 pxTorpx(10);
      &.mobile {
        width: 100%;
        margin-bottom: pxTorpx(15);
      }
    }
    &__button {
      width: pxTorpx(100);
      height: pxTorpx(35);
      background-color: $sub-nav-theme-color;
      color: $white;
      border-radius: pxTorpx(4);
      font-size: pxTorpx(14);
      line-height: pxTorpx(35);
      text-align: center;
    }
  }
  &__button {
    height: pxTorpx(35);
    background-color: $sub-nav-theme-color;
    color: $white;
    border-radius: pxTorpx(10);
    font-size: pxTorpx(14);
    text-align: center;
    margin-top: pxTorpx(30);
    line-height: pxTorpx(35);
  }
}
</style>
