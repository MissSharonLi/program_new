<template>
  <view class="set__address__content">
    <view class="set__address__list">
      <view class="set__address__item">
        <view class="label">收货人</view>
        <view class="input">
          <input v-model="formProps.name" placeholder="请填写收货人姓名" />
        </view>
      </view>
      <view class="set__address__item">
        <view class="label">手机号码</view>
        <view class="input">
          <input v-model.number="formProps.mobile" type="number" placeholder="请填写收货人手机号" />
        </view>
      </view>
      <view class="set__address__item province">
        <view class="label">所在地区</view>
        <view class="input" @click="show = true">
          {{ formProps.province_name }}{{ formProps.city_name }}{{ formProps.area_name }}
        </view>
      </view>
      <view class="set__address__item address">
        <view class="label">详细地址</view>
        <view class="input">
          <textarea
            v-model="formProps.address"
            class="textarea"
            placeholder="街道、楼牌号等"
          ></textarea>
        </view>
      </view>
    </view>
    <view class="set__address__default">
      <view class="title__content">
        <view class="title">设置默认地址</view>
        <view class="tips">提醒：每次下单会默认推荐该地址</view>
      </view>
      <view class="shift__content">
        <view class="switch" :class="{ active: formProps.is_default }" @click="handleShift"></view>
      </view>
    </view>
    <view class="set__address__footer">
      <view class="button" @click="handleSubmit()">保存</view>
    </view>
    <VanPopup :show="show" custom-style="height:60%" :duration="300" position="bottom">
      <VanArea
        :area-list="areaList"
        :columns-num="3"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </VanPopup>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  name: 'SetAddress',
  data() {
    return {
      formProps: {
        name: '',
        mobile: '',
        address: '',
        province: '',
        city: '',
        area: '',
        province_name: '',
        city_name: '',
        area_name: '',
        is_default: false
      },
      value: '',
      show: false,
      shift: false
    }
  },
  onLoad(options) {
    const data = options.data ? options.data : '{}'
    this.formProps = Object.assign(this.formProps, JSON.parse(data))
  },
  methods: {
    handleConfirm(val) {
      this.formProps.province = val.detail.values[0].code
      this.formProps.city = val.detail.values[1].code
      this.formProps.area = val.detail.values[2].code
      this.formProps.province_name = val.detail.values[0].name
      this.formProps.city_name = val.detail.values[1].name
      this.formProps.area_name = val.detail.values[2].name
      this.handleCancel()
    },
    handleCancel(val) {
      this.show = false
    },
    handleShift() {
      this.formProps.is_default = !this.formProps.is_default
    },
    async handleSubmit() {
      const { name, province, city, area, mobile, address } = this.formProps
      if (!name) return this.$toast('请输入收货人姓名')
      if (!mobile) return this.$toast('请输入手机号码')
      if (!/^1[0-9]{10}$/.test(mobile)) return this.$toast('请输入正确的手机号码')
      if (!province || !city || !area) return this.$toast('请选择所在地区')
      if (!address) return this.$toast('请输入详细地址')
      const { code } = await api.handleSetAddress({
        ...this.formProps,
        token: this.token
      })
      if (code === 1) {
        this.$toast('操作成功')
        uni.navigateBack()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.set__address {
  &__list {
    padding-bottom: pxTorpx(40);
    background-color: $sub-nav-theme-color;
  }
  &__item {
    @include flex(center, '');
    padding: pxTorpx(20) pxTorpx(15);
    border-bottom: 1px solid #10101014;
    font-family: $SourceHanSansSC;
    font-weight: 400;
    font-size: pxTorpx(14);
    color: $white;
    &:first-child {
      border-top: 1px solid #10101014;
    }
    .input {
      width: calc(100% - 180rpx);
    }
    &.province {
      padding: 0 pxTorpx(15);
      .input {
        min-height: pxTorpx(60);
        line-height: pxTorpx(60);
      }
    }
    &.address {
      @include flex(flex-start, '');
      padding-bottom: 0;
      .textarea {
        width: 100%;
        height: 80px;
      }
    }
    .label {
      font-size: pxTorpx(14);
      margin-right: pxTorpx(15);
      min-width: pxTorpx(58);
    }
  }
  &__default {
    background-color: $sub-nav-theme-color;
    margin-top: pxTorpx(30);
    padding: pxTorpx(20);
    @include flex(center, space-between);
    .title__content {
      font-family: $SourceHanSansSC;
      font-weight: 400;
      font-size: pxTorpx(14);
      color: $white;
      .tips {
        font-size: pxTorpx(12);
        color: $white;
        margin-top: pxTorpx(5);
      }
    }
    .shift__content {
      width: pxTorpx(37);
      height: pxTorpx(20);
      .switch {
        position: relative;
        height: 70%;
        -webkit-box-pack: start;
        justify-content: flex-start;
        background-color: rgb(158, 158, 158);
        border-radius: 10px;
        transition: background 0.25s ease-in-out 0s;
        &::after {
          content: '';
          position: relative;
          display: block;
          top: -6rpx;
          width: pxTorpx(20);
          padding-bottom: pxTorpx(20);
          background-color: rgb(255, 255, 255);
          border-radius: 50%;
          box-shadow: #0000001f 0px 0px 1px 0px, #0000003d 0px 1px 1px 0px;
          transition: transform 0.25s ease-in-out 0s;
          transform: translate(0px, 0px);
        }
        &.active {
          background-color: #adbcf9;
          &::after {
            background-color: rgb(90, 123, 244);
            box-shadow: #0000001f 0px 0px 1px 0px, #0000003d 0px 1px 1px 0px;
            transform: translate(17.12px, 0px);
          }
        }
      }
    }
  }
  &__footer {
    position: fixed;
    width: calc(100% - 60rpx);
    bottom: 0;
    left: 0;
    background-color: $sub-nav-theme-color;
    padding: pxTorpx(20) pxTorpx(15);
    .button {
      width: 100%;
      line-height: pxTorpx(40);
      height: pxTorpx(40);
      text-align: center;
      background-color: $theme-light-color;
      color: $white;
      font-size: pxTorpx(14);
      border-radius: pxTorpx(100);
    }
  }
}
</style>
