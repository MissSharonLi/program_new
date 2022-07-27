<template>
  <view>
    <VanPopup :show="show" round custom-style="border-radius:10px;width:90%">
      <view class="address__wrapper">
        <view class="address__list">
          <view
            v-for="(item, index) in returnData"
            :key="index"
            class="address__item"
            :class="{ default: item.is_default === 1 }"
            @click="handleToClick(item)"
          >
            <view class="address__title">
              <text class="text">{{ item.name }}</text>
              <text class="text">{{ item.mobile }}</text>
            </view>
            <view class="address__detail">
              <text>{{ item.province_name }}{{ item.city_name }}{{ item.area_name }}</text>
            </view>
          </view>
        </view>
      </view>
    </VanPopup>
    <VanDialog id="van-dialog"></VanDialog>
  </view>
</template>
<script>
import { api } from '@/api'
import VanPopup from '@/wxcomponents/vant/popup/index'
import VanDialog from '@/wxcomponents/vant/dialog/index'
import Dialog from '@/wxcomponents/vant/dialog/dialog'
export default {
  name: 'SelectAddress',
  components: {
    VanPopup,
    VanDialog
  },
  props: {
    type: null
  },
  data() {
    return {
      show: false,
      order_id: null,
      returnData: []
    }
  },
  methods: {
    handleClose(val) {
      this.show = false
    },
    handleToEdit(item) {
      uni.navigateTo({ url: '/pages/personal/setAddress?data=' + JSON.stringify(item) })
    },
    async handleToClick(item) {
      const { id: address_id } = item
      const { token, order_id } = this
      const apiField = this.type ? 'handleToTakegoods' : 'handleTakeGoods'
      const params = this.type
        ? { order_ids: order_id, token, address_id }
        : { order_id, token, address_id }
      const { code, msg } = await api[apiField](params)
      if (code === 1) {
        this.$toast(msg)
        this.$parent.refresh()
        this.handleClose()
      } else {
        this.show = false
      }
    },
    network() {
      return {
        runApiToGetAddressList: async () => {
          const { code, data } = await api.getAddressList({ token: this.token })
          if (code === 1) {
            this.returnData = data
            if (!data.length) {
              Dialog.alert({
                title: '提示',
                message: `您暂未添加地址，前往添加地址?`,
                showCancelButton: true,
                theme: 'round-button'
              })
                .then(async () => {
                  uni.navigateTo({ url: '/pages/personal/setAddress' })
                })
                .catch(() => {})
            } else {
              this.show = true
            }
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
.address {
  &__list {
    margin-top: pxTorpx(1);
  }
  &__item {
    background-color: $sub-nav-theme-color;
    padding: pxTorpx(20);
    margin-bottom: pxTorpx(1);
    &.default {
      position: relative;
      padding-left: pxTorpx(40);
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: pxTorpx(17);
        height: pxTorpx(17);
        background: url('@/assets/images/select.png') no-repeat;
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
              color: $white;
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
    font-family: $SourceHanSansSC;
    font-weight: 700;
    font-size: 14px;
    color: $white;
    margin-bottom: pxTorpx(10);
    .text {
      &:first-child {
        margin-right: pxTorpx(20);
      }
    }
  }
  &__detail {
    font-family: $SourceHanSansSC;
    font-weight: 400;
    font-size: pxTorpx(14);
    color: $white;
    @include flex(center, space-between);
    .img {
      width: pxTorpx(21);
      height: pxTorpx(21);
    }
  }
  &__footer {
    height: pxTorpx(40);
    background-color: $theme-light-color;
    border: 1px solid $theme-light-color;
    color: $white;
    border-radius: pxTorpx(100);
    font-size: pxTorpx(14);
    text-align: center;
    line-height: pxTorpx(40);
    position: fixed;
    bottom: pxTorpx(20);
    left: pxTorpx(20);
    width: calc(100% - 80rpx);
  }
}
</style>
