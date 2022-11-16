<template>
  <view class="content">
    <HomeNavBar class="nav__wrapper" title="赏袋"></HomeNavBar>
    <view class="my__award__bag" :style="{ 'margin-top': navHeight + 'px' }">
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
        <image
          class="img"
          referrerPolicy="no-referrer"
          :src="require('@/assets/images/bag1.png')"
          @click="handleTips"
        ></image>
        <view class="select__content">
          <view class="select__all" :class="{ select: select }" @click="handleSelectAll">全选</view>
          <view v-if="params.status === 1" class="delivery" @click="handleOperation(1)">发货</view>
        </view>
      </view>
      <view class="my__award__bag__list">
        <view v-for="(item, index) in returnData" :key="index" class="my__award__bag__item">
          <image
            referrerPolicy="no-referrer"
            :src="item.item_image"
            class="img"
            @click="handleSelect(index)"
          />
          <text
            class="select__icon"
            :class="{ selected: item.selected }"
            @click="handleSelect(index)"
          ></text>
          <!-- <text class="number">× {{ item.num }}</text> -->
          <view class="text__content">
            <view class="title">
              <text class="text">{{ item.item_name }}</text>
            </view>
            <view class="title">
              <text>参考价：{{ item.price }}</text>
            </view>
            <view class="title">
              <text>数量：{{ item.num }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="my__award__bag__footer">
        <view v-if="params.status === 1" class="button first" @click="handleOperation(2)">
          移
          <br />
          入
        </view>
        <view v-if="params.status === 6" class="button second" @click="handleOperation(3)">
          移
          <br />
          出
        </view>
      </view>
      <view class="refresh" @click="refresh"></view>
      <SelectAddress ref="addressProps" type="batch"></SelectAddress>
      <VanDialog id="van-dialog"></VanDialog>
      <DeliveryTips
        ref="deliveryProps"
        :type="0"
        :notice="siteConfig.shipping_instructions"
      ></DeliveryTips>
      <MyTabs :activeTab="1"></MyTabs>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
import MyTabs from '@/components/MyTabs'
import DeliveryTips from '@/components/DeliveryTips'
import SelectAddress from '@/components/SelectAddress'
export default {
  name: 'MyAwardBag',
  components: {
    MyTabs,
    SelectAddress,
    DeliveryTips
  },
  data() {
    return {
      select: false,
      isRefresh: false,
      params: {
        page: 1,
        status: 1
      },
      returnData: [],
      subDatas: [
        { label: '全部', value: 1 },
        { label: '已发货', value: 4 },
        { label: '保险柜', value: 6 }
      ]
    }
  },
  onLoad() {
    this.runApiToGetSiteconfig()
  },
  async onShow() {
    await this.refresh()
    this.isRefresh = false
  },
  onReachBottom() {
    if (this.isRefresh) return
    this.params.page++
    this.getData()
  },
  methods: {
    handleTab(index) {
      this.select = false
      this.returnData = []
      this.params.page = 1
      this.params.status = index
      this.getData()
    },
    async refresh() {
      this.isRefresh = false
      this.returnData = []
      this.params.page = 1
      await this.getData()
      this.isRefresh = true
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
        case 3:
          // 移出保险柜
          {
            const { code } = await api.handleRemovesafe({
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
.content {
  min-height: auto;
}
.my__award {
  &__bag {
    margin: pxTorpx(15);
    padding-bottom: pxTorpx(110);
    .refresh {
      position: fixed;
      right: 0;
      top: 70%;
      width: pxTorpx(64);
      height: pxTorpx(64);
      background: url('@/assets/images/refresh1.png') no-repeat center;
      background-size: 100%;
    }
    &__tips {
      @include flex(center, space-between);
      padding: 0 pxTorpx(20);
      margin-top: pxTorpx(20);
      .img {
        width: pxTorpx(40);
        height: pxTorpx(40);
      }
      .select__content {
        @include flex(center, space-between);
        font-family: $Yuanti;
        margin-bottom: -5px;
      }
      .select__all {
        color: $white;
        font-size: pxTorpx(18);
        background: #29abe2;
        border-radius: pxTorpx(10);
        padding: pxTorpx(10) pxTorpx(15);
        @include flex(center);
        &::before {
          content: '';
          width: pxTorpx(15);
          height: pxTorpx(15);
          display: inline-block;
          background-color: #fff;
          border-radius: 50%;
          border: 3px solid #f15a24;
          margin-right: pxTorpx(5);
        }
        &.select {
          &::before {
            content: '';
            width: pxTorpx(15);
            height: pxTorpx(15);
            display: inline-block;
            background: url('@/assets/images/selected.png') no-repeat;
            background-size: 100% 100%;
            margin-right: pxTorpx(5);
            background-color: #fff;
          }
        }
      }
      .delivery {
        color: $white;
        font-size: pxTorpx(18);
        background: #29abe2;
        border-radius: pxTorpx(10);
        padding: pxTorpx(10) pxTorpx(15);
        @include flex(center);
        margin-left: 8px;
      }
    }
    &__content {
      @include flex(center, center, wrap);
      position: relative;
      padding: pxTorpx(10) pxTorpx(8);
      border-radius: pxTorpx(5);
      text-align: center;
      z-index: 9;
      border: 2px solid #366ba3;
      background-color: #29abe2;
      border-radius: pxTorpx(16);
      width: 85%;
      margin: 0 auto;
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
        @include flex(center, space-around);
        .item {
          display: block;
          background: #0071bc;
          border-radius: pxTorpx(5);
          padding: pxTorpx(10) pxTorpx(20);
          &.active {
            color: red;
          }
        }
      }
    }
    &__list {
      @include flex(center, '', wrap);
      border: pxTorpx(8) solid #29abe2;
      background-color: $white;
      border-radius: pxTorpx(16);
      min-height: 300px;
      padding: pxTorpx(8);
      padding-bottom: pxTorpx(30);
    }
    &__item {
      width: calc(33% - 26rpx);
      background-color: $white;
      border-radius: pxTorpx(10);
      border: pxTorpx(5) solid #366ba3;
      margin-bottom: pxTorpx(7);
      position: relative;
      &:nth-child(3n-1) {
        margin-left: 10rpx;
        margin-right: 10rpx;
      }
      .img {
        width: 100%;
        height: pxTorpx(118);
        margin-bottom: pxTorpx(5);
      }
      .number {
        position: absolute;
        right: 0;
        top: pxTorpx(95);
        background: rgba(161, 161, 161, 0.8);
        color: $white;
        border-radius: pxTorpx(5);
        padding: pxTorpx(3) pxTorpx(10);
        text-align: right;
        font-size: pxTorpx(10);
        font-weight: 700;
      }
      .text__content {
        padding: 0;
        position: absolute;
        bottom: 0;
        width: 100%;
        background: rgba(161, 161, 161, 0.8);
      }
      .title {
        font-family: $Yuanti;
        font-size: pxTorpx(10);
        color: $white;
        min-height: pxTorpx(20);
        line-height: pxTorpx(20);
        @include flex(center, space-between);
        text-indent: pxTorpx(5);
        .text {
          max-width: 99%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
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
          width: pxTorpx(15);
          height: pxTorpx(15);
          display: block;
          position: absolute;
          right: pxTorpx(2);
          top: pxTorpx(2);
          background-color: $white;
          border: 3px solid #f15a24;
          border-radius: 50%;
          &.selected {
            background: url('@/assets/images/selected.png') no-repeat center;
            background-size: 100% 100%;
            background-color: #fff;
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
      top: 42%;
      right: pxTorpx(15);
      width: pxTorpx(50);
      @include flex(center, space-around, wrap);
      .button {
        min-height: pxTorpx(40);
        line-height: 1.2;
        color: $white;
        font-size: pxTorpx(18);
        text-align: center;
        font-family: $Yuanti;
        border: 2px solid #29abe2;
        background-color: #29abe2;
        padding: pxTorpx(15) pxTorpx(10);
        border-radius: pxTorpx(8);
        &.first {
          margin-bottom: pxTorpx(10);
        }
        &.second {
          background-color: #0071bc;
        }
      }
    }
  }
}
</style>
