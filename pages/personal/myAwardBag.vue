<template>
  <view class="my__award__bag">
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
    <view class="my__award__bag__list">
      <view v-for="(item, index) in returnData" :key="index" class="my__award__bag__item">
        <image :src="item.item_image" class="img" @click="handleSelect(index)" />
        <text class="select__icon" :class="{ selected: item.selected }"></text>
        <view class="text__content">
          <view class="title">{{ item.item_name }}</view>
          <view class="price">参考价格：{{ item.back_price }}</view>
          <view class="select__content">
            <text class="price">×{{ item.num }}</text>
            <text class="select__text">{{ item.status_text }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="my__award__bag__footer">
      <view class="button" @click="handleCancelAll">全不选</view>
      <view class="button" @click="handleSelectAll">全选</view>
      <view v-if="params.status === 1" class="button" @click="handleOperation">回购</view>
      <view v-if="params.status === 1" class="button" @click="handleOperation(1)">提货</view>
    </view>
    <SelectAddress ref="addressProps" type="batch"></SelectAddress>
    <VanDialog id="van-dialog"></VanDialog>
    <MyTabs></MyTabs>
  </view>
</template>
<script>
import { api } from '@/api'
import MyTabs from '@/components/MyTabs'
import SelectAddress from '@/components/SelectAddress'
export default {
  name: 'MyAwardBag',
  components: {
    MyTabs,
    SelectAddress
  },
  data() {
    return {
      params: {
        page: 1,
        status: 1
      },
      returnData: [],
      subDatas: [
        { label: '未申请', value: 1 },
        { label: '已发货', value: 4 },
        { label: '全部', value: 0 }
      ]
    }
  },
  onLoad() {
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
      this.returnData.forEach((i) => (i.selected = true))
      this.$forceUpdate()
    },
    // 全不选
    handleCancelAll() {
      this.returnData.forEach((i) => (i.selected = false))
      this.$forceUpdate()
    },
    // 单选
    handleSelect(index) {
      this.returnData[index].selected = !this.returnData[index].selected
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
    &::after {
      content: '';
      position: absolute;
      top: pxTorpx(5);
      left: -10rpx;
      height: pxTorpx(88);
      width: calc(100% + 20rpx);
      background-color: rgba(64, 64, 64, 0.5);
      border-radius: pxTorpx(5);
      z-index: 0;
    }
    &__content {
      @include flex(center, center, wrap);
      position: relative;
      padding: 0 pxTorpx(10);
      background-color: $sub-nav-theme-color;
      height: pxTorpx(88);
      border-radius: pxTorpx(5);
      text-align: center;
      z-index: 9;
      .title {
        font-family: 'PingFangSC';
        font-weight: 400;
        font-size: pxTorpx(14);
        color: $theme-light-color;
        width: 100%;
      }
      .subtitle {
        font-family: $ZKKuaiLeTi;
        font-weight: 400;
        font-size: pxTorpx(18);
        color: $white;
        width: 100%;
        @include flex(center, flex-start);
        .item {
          display: block;
          &:not(&:last-child) {
            margin-right: pxTorpx(10);
          }
          &.active {
            color: $theme-light-color;
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
      width: calc(33% - 7rpx);
      background-color: $sub-nav-theme-color;
      border-radius: pxTorpx(10);
      padding-bottom: pxTorpx(10);
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
        margin-bottom: pxTorpx(10);
      }
      .text__content {
        padding: 0 pxTorpx(10);
      }
      .title {
        font-family: PingFangSC;
        font-weight: 700;
        font-size: pxTorpx(14);
        color: $white;
        margin-bottom: pxTorpx(10);
      }
      .price {
        font-family: PingFangSC;
        font-weight: 400;
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
          &.selected {
            background: url('@/assets/images/selected.png') no-repeat center;
            background-size: 100% 100%;
          }
        }
        &__text {
          font-family: PingFangSC;
          font-weight: 400;
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
        width: pxTorpx(80);
        line-height: pxTorpx(30);
        height: pxTorpx(30);
        background-color: $sub-nav-theme-color;
        color: $theme-light-color;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>
