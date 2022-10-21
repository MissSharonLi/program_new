<template>
  <view class="content address__wrapper" :style="{ 'margin-top': navHeight + 'px' }">
    <HomeNavBar class="nav__wrapper" :isBack="true" title="地址"></HomeNavBar>
    <view class="address__list" :style="{ 'min-height': sightHeight + 'px' }">
      <view
        v-for="(item, index) in returnData"
        :key="index"
        class="address__item"
        :class="{ default: item.is_default === 1 }"
      >
        <view class="address__title">
          <text class="text">{{ item.name }}</text>
          <text class="text">{{ item.mobile }}</text>
        </view>
        <view class="address__detail">
          <text>{{ item.province_name }}{{ item.city_name }}{{ item.area_name }}</text>
          <image
            class="delete"
            :src="require('@/assets/images/delete2.png')"
            @click="handleToDelete(item)"
          ></image>
          <image
            class="img"
            :src="require('@/assets/images/edit.png')"
            @click="handleToEdit(item)"
          ></image>
        </view>
      </view>
    </view>
    <VanDialog id="van-dialog"></VanDialog>
    <view class="address__footer" @click="handleToAdd">新增收货地址</view>
  </view>
</template>
<script>
import { api } from '@/api'
import Dialog from '@/wxcomponents/vant/dialog/dialog'
export default {
  data() {
    return {
      returnData: []
    }
  },
  onShow() {
    this.network().runApiToGetAddressList()
  },
  methods: {
    handleToAdd() {
      uni.navigateTo({ url: '/pages/personal/setAddress' })
    },
    async handleToDelete(item) {
      Dialog.alert({
        title: '提示',
        message: `确认删除?`,
        showCancelButton: true,
        theme: 'round-button'
      })
        .then(async () => {
          const { code } = await api.handleDeleteAddress({ token: this.token, id: item.id })
          if (code === 1) {
            this.$toast('操作成功')
            this.network().runApiToGetAddressList()
          }
        })
        .catch(() => {})
    },
    handleToEdit(item) {
      uni.navigateTo({ url: '/pages/personal/setAddress?data=' + JSON.stringify(item) })
    },
    network() {
      return {
        runApiToGetAddressList: async () => {
          const { code, data } = await api.getAddressList({ token: this.token })
          if (code === 1) {
            this.returnData = data || []
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/wxcomponents/vant/dialog/index.wxss';
</style>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.content {
  min-height: auto;
}
.address {
  &__list {
    margin: 0 auto;
    width: calc(100% - 30px);
    border: pxTorpx(6) solid #29abe2;
    background-color: #f0fcff;
    border-radius: pxTorpx(16);
  }
  &__item {
    padding: pxTorpx(20);
    margin-bottom: pxTorpx(1);
    position: relative;
    &:not(:last-child) {
      border-bottom: 1px solid #29abe2;
    }
    &.default {
      position: relative;
      padding-left: pxTorpx(40);
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: pxTorpx(17);
        height: pxTorpx(17);
        background: url('@/assets/images/selected.png') no-repeat;
        background-size: 100% 100%;
        left: pxTorpx(12);
        top: pxTorpx(30);
      }
      .address__title {
        @include flex(center, '');
        .text {
          &:last-child {
            @include flex(center, '');
            &::after {
              content: '默认';
              display: block;
              width: pxTorpx(34);
              height: pxTorpx(18);
              line-height: pxTorpx(18);
              color: #fff;
              text-align: center;
              margin-left: pxTorpx(10);
              background-color: $theme-light-color;
              font-size: pxTorpx(12);
              font-weight: lighter;
            }
          }
        }
      }
    }
  }
  &__title {
    font-family: $Yuanti;
    font-weight: 700;
    font-size: 14px;
    color: #000;
    margin-bottom: pxTorpx(10);
    .text {
      &:first-child {
        margin-right: pxTorpx(20);
      }
    }
  }
  &__detail {
    font-family: $Yuanti;
    font-weight: 400;
    font-size: pxTorpx(14);
    color: #000;
    @include flex(center, space-between);
    .delete {
      width: pxTorpx(18);
      height: pxTorpx(20);
      position: absolute;
      right: pxTorpx(20);
      top: pxTorpx(20);
      display: block;
    }
    .img {
      width: pxTorpx(21);
      height: pxTorpx(21);
    }
  }
  &__footer {
    font-family: $Yuanti;
    height: pxTorpx(50);
    background-color: #12264a;
    border: 2px solid #dbb666;
    color: #dbb666;
    border-radius: pxTorpx(16);
    font-size: pxTorpx(16);
    text-align: center;
    line-height: pxTorpx(50);
    position: fixed;
    bottom: pxTorpx(20);
    left: 20%;
    width: 60%;
  }
}
</style>
