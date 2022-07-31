<template>
  <view class="my__award__bag" :style="{ 'padding-top': navBarHeight }">
    <HomeNavBar class="nav__wrapper" title="我的赏袋"></HomeNavBar>
    <view class="my__award__bag__content">
      <view class="subtitle">
        <text
          v-for="item in subDatas"
          :key="item.value"
          class="item"
          :class="{ active: params.status === item.value }"
          @click="handleTab(item.value)"
        >
          {{ item.label }}
        </text>
      </view>
    </view>
    <view class="my__award__bag__tips">
      <image class="img" :src="require('@/assets/images/bag1.png')" @click="handleTips"></image>
      <view class="select__all" :class="{ select: select }" @click="handleSelectAll">全选</view>
    </view>
    <view class="my__award__bag__list">
      <view v-for="(item, index) in returnData" :key="index" class="my__award__bag__item">
        <image :src="item.item_image" class="img" @click="handleSelect(index)" />
        <text
          class="select__icon"
          :class="{ selected: item.selected }"
          @click="handleSelect(index)"
        ></text>
        <view class="text__content">
          <view class="title">{{ item.item_name }}</view>
        </view>
      </view>
    </view>
    <view class="my__award__bag__footer">
      <view v-if="params.status === 0" class="button" @click="handleOperation">赏品寄售</view>
      <view v-if="params.status === 0" class="button" @click="handleOperation(1)">打包发货</view>
      <view v-if="params.status === 0" class="button" @click="handleOperation(2)">移入保险柜</view>
    </view>
    <SelectAddress ref="addressProps" type="batch"></SelectAddress>
    <VanDialog id="van-dialog"></VanDialog>
    <DeliveryTips
      ref="deliveryProps"
      :type="0"
      :notice="siteConfig.shipping_instructions"
    ></DeliveryTips>
  </view>
</template>
<script>
import { api } from '@/api'
import HomeNavBar from '@/components/HomeNavBar'
import SelectAddress from '@/components/SelectAddress'
import DeliveryTips from '@/components/DeliveryTips'
export default {
  name: 'MyAwardBag',
  components: {
    HomeNavBar,
    SelectAddress,
    DeliveryTips
  },
  data() {
    return {
      select: false,
      params: {
        page: 1,
        status: 0
      },
      returnData: [],
      subDatas: [
        { label: '全部', value: 0 },
        { label: '已发货', value: 4 },
        { label: '已寄售', value: 1 },
        { label: '保险柜', value: 6 }
      ]
    }
  },
  onLoad() {
    this.runApiToGetSiteconfig()
    this.getData()
  },
  onReachBottom() {
    this.params.page++
    this.getData()
  },
  methods: {
    handleTab(index) {
      this.returnData = []
      this.params.page = 1
      this.params.status = index
      this.getData()
    },
    refresh() {
      this.returnData = []
      this.params.page = 1
      this.getData()
    },
    // 获取说明
    async runApiToGetSiteconfig() {
      const { code, data } = await api.getSiteconfig({ token: this.token })
      if (code === 1 && data) {
        this.$store.commit('setSiteConfig', JSON.stringify(data))
        uni.setStorageSync('storage_siteConfig', JSON.stringify(data))
      }
    },
    async getData() {
      const { code, data } = await api.getRewardBagList({ ...this.params, token: this.token })
      if (code === 1 && data) {
        if (data.data.length > 0) {
          data.data.forEach((i) => (i.selected = false))
          this.returnData = this.returnData.concat(data.data)
        } else {
          this.params.page > 1 ? this.$toast('没有更多数据了') : this.$toast('暂无数据')
          this.params.page > 1 ? this.params.page-- : (this.returnData = [])
        }
      }
    },
    // 全选
    handleSelectAll() {
      this.select = !this.select
      this.returnData.forEach((i) => (i.selected = this.select))
      this.$forceUpdate()
    },
    // 发货须知
    handleTips() {
      this.$refs.deliveryProps.show = true
    },
    // 单选
    handleSelect(index) {
      this.returnData[index].selected = !this.returnData[index].selected
      this.select = this.returnData.every((i) => i.selected)
      this.$forceUpdate()
    },
    // 操作
    async handleOperation(type) {
      if (!this.returnData.length) return this.$toast('当前无可操作的商品')
      const selectIds = this.returnData
        .filter((i) => i.selected)
        .map((i) => i.id)
        .join(',')
      if (!selectIds) return this.$toast('请先选择商品')
      switch (type) {
        case 1:
          this.$refs.addressProps.order_id = selectIds
          this.$refs.addressProps.network().runApiToGetAddressList()
          break
        case 2:
          // 移入保险柜
          {
            const { code } = await api.handleJoinsafe({
              order_ids: selectIds,
              token: this.token
            })
            if (code === 1) {
              this.$toast('操作成功!')
              this.refresh()
            }
          }
          break
        default: {
          // 批量回购
          const { code } = await api.handleToBackbuy({
            order_ids: selectIds,
            token: this.token
          })
          if (code === 1) {
            this.$toast('操作成功!')
            this.refresh()
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.my__award {
  &__bag {
    margin: pxTorpx(7);
    position: relative;
    padding-bottom: pxTorpx(110);
    &__tips {
      @include flex(center, space-between);
      padding: pxTorpx(10) pxTorpx(20);
      .img {
        width: pxTorpx(50);
        height: pxTorpx(50);
      }
      .select__all {
        color: $white;
        font-size: pxTorpx(14);
        @include flex(center);
        &::before {
          content: '';
          width: pxTorpx(20);
          height: pxTorpx(20);
          display: inline-block;
          background-color: #fff;
          border-radius: 50%;
          margin-right: pxTorpx(5);
        }
        &.select {
          &::before {
            content: '';
            width: pxTorpx(20);
            height: pxTorpx(20);
            display: inline-block;
            background: url('@/assets/images/select.png') no-repeat;
            background-size: 100% 100%;
            margin-right: pxTorpx(5);
          }
        }
      }
    }
    &__content {
      @include flex(center, center, wrap);
      position: relative;
      padding: 0 pxTorpx(10);
      background-color: #4d4d4d;
      height: pxTorpx(88);
      border-radius: pxTorpx(5);
      text-align: center;
      z-index: 9;
      .title {
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(14);
        color: $theme-light-color;
        width: 100%;
      }
      .subtitle {
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(18);
        color: $white;
        width: 100%;
        @include flex(center, space-between);
        .item {
          display: block;
          &:not(&:last-child) {
            margin-right: pxTorpx(10);
          }
          &.active {
            color: #c30d23;
            font-size: pxTorpx(20);
          }
        }
      }
    }
    &__list {
      @include flex(center, '', wrap);
      margin-top: pxTorpx(15);
      padding-bottom: pxTorpx(30);
    }
    &__item {
      width: calc(33% - 26rpx);
      background-color: $white;
      border-bottom-left-radius: pxTorpx(10);
      border-bottom-right-radius: pxTorpx(10);
      padding: pxTorpx(5);
      margin-bottom: pxTorpx(7);
      position: relative;
      &:nth-child(3n-1) {
        margin-left: 10rpx;
        margin-right: 10rpx;
      }
      .img {
        width: 100%;
        height: pxTorpx(118);
        border-radius: pxTorpx(10);
        margin-bottom: pxTorpx(5);
      }
      .text__content {
        padding: 0 pxTorpx(5);
      }
      .title {
        font-family: $Yuanti;
        font-size: pxTorpx(14);
        color: #333;
      }
      .price {
        font-family: $Yuanti;
        font-size: pxTorpx(12);
        color: rgba(168, 168, 168, 1);
        margin-bottom: pxTorpx(10);
      }
      .select {
        &__content {
          text-align: right;
          .price {
            float: left;
            margin-bottom: 0 !important;
          }
        }
        &__icon {
          width: pxTorpx(17);
          height: pxTorpx(17);
          display: block;
          background: url('@/assets/images/unselect.png') no-repeat center;
          background-size: 100% 100%;
          position: absolute;
          right: pxTorpx(10);
          top: pxTorpx(10);
          background-color: $white;
          &.selected {
            background: url('@/assets/images/selected.png') no-repeat center;
            background-size: 100% 100%;
          }
        }
        &__text {
          font-family: $Yuanti;
          font-size: pxTorpx(12);
          color: $theme-light-color;
        }
      }
    }
    &__footer {
      position: fixed;
      bottom: pxTorpx(100);
      left: 0;
      width: 100%;
      @include flex(center, space-around);
      .button {
        min-width: pxTorpx(100);
        height: pxTorpx(40);
        line-height: pxTorpx(40);
        box-shadow: #8c6239 5px -5px 0px 0px;
        color: $white;
        font-size: pxTorpx(14);
        text-align: center;
        background: #fbb03b;
        font-family: $Yuanti;
      }
    }
  }
}
</style>
