<template>
  <view class="order__management">
    <view class="order__management__top">
      <view class="search__input__content">
        <input
          v-model="params.keywords"
          class="search__input"
          type="text"
          placeholder="商品名称（仅支持三个月以内的订单）"
          @confirm="getData(true)"
        />
      </view>
      <SubTabs ref="subTabsProps" :dataSource="tabList" @tabClick="handleTab"></SubTabs>
    </view>
    <view class="order__management__list">
      <view v-for="(item, index) in returnData" :key="index" class="order__management__item">
        <view @click="handleOperation(2, item)">
          <view class="order__management__time">
            <text>{{ item.createtime }}</text>
            <text>
              {{
                item.status === 1
                  ? '待处理'
                  : item.status === 2
                  ? '完成回购'
                  : item.status === 3
                  ? '提货待发'
                  : item.status === 4
                  ? '发货中'
                  : '完成交易'
              }}
            </text>
          </view>
          <view class="order__management__images">
            <image class="img" :src="item.item_image"></image>
            <view class="order__management__detail">
              <text class="title">{{ item.goods_name }}</text>
              <view class="price">
                <text>{{ item.item_name }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="order__management__footer">
          <view v-if="!item.success">回购价格：￥{{ item.back_price }}</view>
          <view>
            <!-- <text>共1件</text> -->
            <text class="price">
              价格：
              <text class="em">￥{{ item.price }}</text>
            </text>
          </view>
        </view>
        <view class="order__management__buttons">
          <text v-if="item.status === 1" class="button" @click="handleOperation(0, item)">
            回购
          </text>
          <text v-if="item.status === 1" class="button" @click="handleOperation(1, item)">
            提货
          </text>
          <text v-if="item.status === 4" class="button" @click="handleOperation(3, item)">
            确认收货
          </text>
          <text
            v-if="item.status === 4 || item.status === 5"
            class="button"
            @click="handleOperation(null, item)"
          >
            查看物流
          </text>
        </view>
      </view>
    </view>
    <SelectAddress ref="addressProps"></SelectAddress>
  </view>
</template>
<script>
import { api } from '@/api'
import SubTabs from '@/components/SubTabs'
import SelectAddress from '@/components/SelectAddress'
export default {
  components: {
    SubTabs,
    SelectAddress
  },
  data() {
    return {
      params: {
        page: 1,
        status: 0,
        keywords: ''
      },
      tabList: [
        { label: '全部', value: 0 },
        { label: '待处理', value: 1 },
        { label: '完成回购', value: 2 },
        { label: '提货待发', value: 3 },
        { label: '发货中', value: 4 },
        { label: '完成交易', value: 5 }
      ],
      returnData: []
    }
  },
  onLoad(options) {
    this.$nextTick(() => {
      this.$refs.subTabsProps.handleTab(Number(options.status || 0))
    })
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
      this.$toast('操作成功')
      this.params.page = 1
      this.returnData = []
      this.getData()
    },
    async getData(search) {
      const { code, data } = await api.getOrderList({ ...this.params, token: this.token })
      if (code === 1 && data) {
        if (data.data.length > 0) {
          this.returnData = search ? data.data : this.returnData.concat(data.data)
        } else {
          this.params.page > 1 ? this.$toast('没有更多数据了') : this.$toast('暂无数据')
          this.params.page > 1 ? this.params.page-- : (this.returnData = [])
        }
      }
    },
    handleOperation(type, item) {
      switch (type) {
        case 0:
          {
            const { id: order_id } = item
            api
              .handleOrderBackbuy({
                token: this.token,
                order_id
              })
              .then((res) => {
                if (res.code === 1) {
                  this.refresh()
                }
              })
          }
          break
        case 1:
          this.$refs.addressProps.order_id = item.id
          this.$refs.addressProps.network().runApiToGetAddressList()
          break
        case 2:
          uni.navigateTo({ url: '/pages/personal/orderDetail?order_id=' + item.id })
          break
        case 3:
          {
            const { id: order_id } = item
            api
              .handleToReceipt({
                token: this.token,
                order_id
              })
              .then((res) => {
                if (res.code === 1) {
                  this.refresh()
                }
              })
          }
          break
        default:
          uni.navigateTo({ url: '/pages/personal/deliveryInfo?order_id=' + item.id })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.order__management {
  padding-top: pxTorpx(90);
  &__top {
    background-color: $sub-nav-theme-color;
    box-shadow: #0000000a 0px 2px 6px 0px;
    padding: pxTorpx(10);
    padding-bottom: 0;
    position: fixed;
    left: 0;
    width: calc(100% - 40rpx);
    top: 0;
    z-index: 9;
    ::v-deep .notify__nav__content {
      position: relative;
    }
  }
  .search__input {
    &__content {
      @include flex(center);
    }
    background-color: $white;
    border-radius: pxTorpx(15);
    font-size: pxTorpx(14);
    height: pxTorpx(34);
    line-height: pxTorpx(34);
    position: relative;
    width: 100%;
    padding-left: pxTorpx(40);
    &::before {
      content: '';
      display: block;
      width: pxTorpx(21);
      height: pxTorpx(21);
      background: url('@/assets/images/search-grey.png') no-repeat;
      background-size: 100% 100%;
      line-height: pxTorpx(34);
      position: absolute;
      left: pxTorpx(10);
      top: pxTorpx(6);
    }
  }
  &__list {
    padding: pxTorpx(10);
    margin-top: pxTorpx(15);
  }
  &__item {
    background-color: $sub-nav-theme-color;
    padding: pxTorpx(10);
    border-radius: pxTorpx(5);
    margin-bottom: pxTorpx(10);
    &.success {
      .order__management__buttons {
        .button {
          background-color: $theme-light-color;
          color: #f8dc4c;
        }
      }
      .order__management__footer {
        text-align: right;
        display: block;
      }
    }
  }
  &__time {
    font-family: 'PingFangSC';
    font-weight: 400;
    font-size: pxTorpx(13);
    color: $white;
    margin-bottom: pxTorpx(10);
    margin-top: pxTorpx(5);
    display: block;
    @include flex(center, space-between);
  }
  &__images {
    @include flex(center, '');
    padding: pxTorpx(10);
    border-top: 1px solid #10101014;
    border-bottom: 1px solid #10101014;
    .img {
      width: pxTorpx(80);
      height: pxTorpx(80);
      position: relative;
      margin-right: pxTorpx(20);
    }
    .title {
      font-family: 'PingFangSC';
      font-weight: 700;
      font-size: pxTorpx(14);
      color: $white;
      margin-bottom: pxTorpx(30);
      display: block;
    }
    .price {
      font-family: $SFUIText;
      font-weight: 400;
      font-size: pxTorpx(12);
      color: $white;
      display: block;
      @include flex(center, space-between);
    }
  }
  &__detail {
    width: calc(100% - 200rpx);
  }
  &__footer {
    font-family: 'PingFangSC';
    font-weight: 400;
    font-size: pxTorpx(12);
    color: $white;
    margin-top: pxTorpx(12);
    @include flex(center, space-between);
    .price {
      margin-left: pxTorpx(20);
      .em {
        font-weight: 700;
        font-size: pxTorpx(14);
        color: $white;
      }
    }
  }
  &__buttons {
    font-family: 'PingFangSC';
    font-weight: 400;
    font-size: pxTorpx(13);
    color: $theme-light-color;
    text-align: right;
    margin-top: pxTorpx(20);
    .button {
      min-width: pxTorpx(80);
      height: pxTorpx(26);
      line-height: pxTorpx(26);
      text-align: center;
      border: 1px solid $theme-light-color;
      display: inline-block;
      border-radius: pxTorpx(22);
      & + .button {
        margin-left: pxTorpx(15);
      }
    }
  }
}
</style>
