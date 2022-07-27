<template>
  <view class="product__detail__content">
    <view class="product__detail__top">
      <CustomSwiper :isBanner="true" :dataSource="imgDataSource"></CustomSwiper>
      <view class="rank__content">
        <view class="love" :class="{ active: is_collect }" @click="handleToCollect"></view>
        <view class="rank">
          <view class="button" @click="handleToRewards">我的赏袋</view>
          <view class="button" @click="handleLottery">抽奖记录</view>
        </view>
      </view>
    </view>
    <view class="product__detail__buttons">
      <view class="button" @click="$refs.buyTipsProps.show = true">购买说明</view>
      <view class="button" @click="query()">刷新</view>
    </view>
    <view class="product__detail__rate">
      <view class="product__detail__rate__content">
        <view class="title">锁箱机会剩余{{ returnObj.lock_times || 0 }}次</view>
        <view class="subtitle">
          <text class="left">赏品一览</text>
          <text class="right">赏品余量</text>
        </view>
        <view class="pages">
          <view class="prev" @click="prev">上一箱</view>
          <view class="context">
            <view class="text">第</view>
            <text class="em">{{ returnObj.current_box_id }}</text>
            <view class="text">/{{ returnObj.box_num }}</view>
            <view class="text">箱</view>
          </view>
          <view class="context">
            <view class="text">剩余</view>
            <text class="em">{{ returnObj.current_box_stock_num }}</text>
            <view class="text">/{{ returnObj.current_box_total_num }}</view>
            <view class="text">张</view>
          </view>
          <view class="next" @click="next">下一箱</view>
        </view>
      </view>
    </view>
    <view class="product__detail__list">
      <view v-for="(item, index) in dataSource" :key="index" class="list__item">
        <image
          class="list__item__image"
          :class="{ sold__out: item.stock_num === 0 }"
          :src="item.item_image"
        ></image>
        <view class="title">{{ item.item_name }}</view>
        <view class="sub__title">{{ item.buy_num }}/{{ item.item_num }}</view>
        <view class="sub__title">获得概率：{{ item.parcent }}%</view>
      </view>
    </view>
    <view class="product__detail__footer">
      <view class="product__detail__lang">
        <image
          class="img"
          :src="require('@/assets/images/lang1.png')"
          @click="handleToBuy(1)"
        ></image>
        <image
          class="img"
          :src="require('@/assets/images/lang2.png')"
          @click="handleToBuy(3)"
        ></image>
        <image
          class="img"
          :src="require('@/assets/images/lang3.png')"
          @click="handleToBuy(5)"
        ></image>
        <image
          class="img"
          :src="require('@/assets/images/lang4.png')"
          @click="handleToBuy(10)"
        ></image>
      </view>
      <view class="product__detail__footer__buttons">
        <view class="button" @click="handleOperation(null, '换箱')">换箱</view>
        <view class="button" @click="handleOperation(null, '锁箱')">锁箱</view>
      </view>
    </view>
    <BuyDetail ref="buyProps" :params="buyParams" @success="handleSuccess"></BuyDetail>
    <BuySuccess ref="rankProps" :dataSource="rankProps.dataSource"></BuySuccess>
    <VanDialog id="van-dialog"></VanDialog>
    <BuyTips ref="buyTipsProps" :notice="returnObj.notice"></BuyTips>
  </view>
</template>
<script>
import { api } from '@/api'
import BuySuccess from '@/components/BuySuccess'
import BuyDetail from '@/components/BuyDetail'
import BuyTips from '@/components/BuyTips'
import CustomSwiper from '@/components/CustomSwiper'
import Dialog from '@/wxcomponents/vant/dialog/dialog'
export default {
  name: 'Detail',
  components: {
    BuyTips,
    BuyDetail,
    BuySuccess,
    CustomSwiper
  },
  data() {
    return {
      current: 0,
      isLock: false,
      is_collect: false,
      imgDataSource: [],
      rankProps: {
        show: false,
        dataSource: []
      },
      buyParams: {},
      params: {
        id: '',
        box_id: 1
      },
      returnObj: {
        box_num: 0
      },
      dataSource: []
    }
  },
  onLoad(options) {
    this.params.id = options.id
    this.query()
  },
  methods: {
    async query() {
      const { code, data } = await api.getProductDetail(this.params)
      if (code === 1 && data) {
        this.returnObj = data || {}
        this.is_collect = data.is_collect
        this.dataSource = data.item_list || []
        this.imgDataSource = data.goods_image.split(',')
      }
    },
    async handleLottery() {
      uni.navigateTo({ url: '/pages/product/lottery?id=' + this.params.id })
    },
    async handleSuccess(log_sn) {
      this.query()
      this.$refs.rankProps.show = true
      const { code, data } = await api.getBuyLogDetial({
        token: this.token,
        log_sn
      })
      if (code === 1) this.rankProps.dataSource = data
    },
    handleToRewards() {
      uni.navigateTo({ url: '/pages/personal/orderManagement?status=1' })
    },
    handleToBuy(num) {
      this.commonUtils.login().then(async (res) => {
        this.buyParams = {
          ...this.params,
          num,
          token: this.token,
          money: this.userInfo.money,
          notice: this.returnObj.buy_notice,
          goods_name: this.returnObj.goods_name,
          goods_price: this.returnObj.goods_price,
          current_box_stock_num: this.returnObj.current_box_stock_num,
          current_box_total_num: this.returnObj.current_box_total_num
        }
        this.$refs.buyProps.show = true
      })
    },
    // 下一箱
    next() {
      if (this.params.box_id === this.returnObj.box_num) return this.$toast('已经是最后一箱了')
      this.params.box_id++
      this.query()
    },
    // 上一箱
    prev() {
      if (this.params.box_id === 1) return this.$toast('已经是第一箱了')
      this.params.box_id--
      this.query()
    },
    // 收藏
    async handleToCollect() {
      const { id: goods_id, box_id } = this.params
      const { code, data } = await api.handleAddCollect({ goods_id, box_id, token: this.token })
      if (code === 1 && data) {
        this.is_collect = !this.is_collect
        this.is_collect ? this.$toast('已成功收藏') : this.$toast('已取消收藏')
      }
    },
    handleOperation(title = '提示', message) {
      if (message === '换箱') {
        this.params.box_id++
        if (this.params.box_id <= this.returnObj.box_num) this.query()
        if (this.params.box_id >= this.returnObj.box_num) this.params.box_id = 0
        return
      }
      if (!this.returnObj.lock_times) return this.$toast('锁箱机会剩余0次,不可锁箱')
      Dialog.alert({
        title: title,
        message: `确认${message}?`,
        showCancelButton: true,
        theme: 'round-button'
      })
        .then(async () => {
          if (message === '锁箱') {
            const { code } = await api.handleLockBox({ ...this.params, token: this.token })
            if (code === 1) {
              this.$toast('操作成功')
              this.query()
            }
          }
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
@import '@/wxcomponents/vant/dialog/index.wxss';
</style>

<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.product__detail {
  &__content {
    background-color: $white;
    min-height: 100vh;
    padding-bottom: pxTorpx(100);
  }
  &__top {
    position: relative;
    .rank__content {
      position: absolute;
      width: 100%;
      left: 0;
      top: pxTorpx(50);
      @include flex(center, space-between);
      .love {
        width: pxTorpx(30);
        height: pxTorpx(30);
        display: block;
        border-radius: 50%;
        background: url('@/assets/images/love.png') no-repeat center;
        background-size: pxTorpx(20) pxTorpx(20);
        background-color: $uni-theme-color;
        margin-left: pxTorpx(15);
        &.active {
          background: url('@/assets/images/loved.png') no-repeat center;
          background-size: pxTorpx(20) pxTorpx(20);
          background-color: $uni-theme-color;
          margin-left: pxTorpx(15);
        }
      }
      .button {
        background-color: $uni-theme-color;
        line-height: pxTorpx(30);
        border-radius: 15px 0px 0px 15px;
        font-size: pxTorpx(14);
        color: #f8dc4c;
        font-weight: bold;
        width: pxTorpx(100);
        @include flex(center, '');
        margin-bottom: pxTorpx(10);
        &::before {
          content: '';
          display: block;
          width: pxTorpx(16);
          height: pxTorpx(16);
          background: url('@/assets/images/bag.png') no-repeat;
          background-size: 100% 100%;
          margin-left: pxTorpx(10);
          margin-right: pxTorpx(10);
        }
        &:last-child {
          &::before {
            background: url('@/assets/images/rank.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  &__buttons {
    @include flex(center, space-between);
    margin: pxTorpx(10) pxTorpx(15);
    .button {
      background-color: #f8dc4c;
      line-height: pxTorpx(30);
      width: pxTorpx(80);
      border-radius: pxTorpx(5);
      font-size: pxTorpx(14);
      text-align: center;
      color: $uni-theme-color;
      font-weight: bold;
      &:last-child {
        @include flex(center, '');
        &::before {
          content: '';
          display: block;
          width: pxTorpx(20);
          height: pxTorpx(20);
          margin-left: pxTorpx(10);
          margin-right: pxTorpx(5);
          background: url('@/assets/images/refresh.png') no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
  }
  &__rate {
    margin: pxTorpx(10);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: pxTorpx(5);
      left: -10rpx;
      height: pxTorpx(108);
      width: calc(100% + 20rpx);
      background-color: #9fd3e7;
      border-radius: pxTorpx(5);
      z-index: 0;
    }
    &__content {
      @include flex(center, center, wrap);
      position: relative;
      padding: 0 pxTorpx(10);
      background-color: $uni-theme-color;
      background-color: $uni-theme-color;
      height: pxTorpx(108);
      border-radius: pxTorpx(5);
      text-align: center;
      z-index: 9;
      .title {
        font-family: 'PingFangSC';
        font-weight: 400;
        font-size: pxTorpx(14);
        color: #f8dc4c;
        width: 100%;
      }
      .subtitle {
        font-family: $ZKKuaiLeTi;
        font-weight: 400;
        font-size: pxTorpx(20);
        color: $white;
        width: 100%;
        @include flex(center, center);
        .right {
          font-size: pxTorpx(16);
          margin-left: pxTorpx(20);
        }
      }
      .pages {
        @include flex(center, space-between);
        font-family: 'PingFangSC';
        font-weight: 400;
        font-size: pxTorpx(14);
        color: $white;
        width: 100%;
        .prev {
          font-size: pxTorpx(14);
          @include flex(center, '');
          &::before {
            content: '';
            display: block;
            width: pxTorpx(20);
            height: pxTorpx(20);
            background: url('@/assets/images/prev.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .next {
          font-size: pxTorpx(14);
          @include flex(center, '');
          &::after {
            content: '';
            display: block;
            width: pxTorpx(20);
            height: pxTorpx(20);
            background: url('@/assets/images/next.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .context {
          text-align: center;
          color: $white;
          font-size: pxTorpx(12);
          @include flex(center, center);
          .em {
            font-size: pxTorpx(14);
            color: #f8dc4c;
            font-style: italic;
            margin-left: pxTorpx(5);
            & + .text {
              margin-right: pxTorpx(5);
            }
          }
        }
      }
    }
  }
  &__list {
    @include flex(center, flex-start, wrap);
    padding: pxTorpx(5) pxTorpx(10);
    .list__item {
      width: calc(25% - 20rpx);
      min-height: pxTorpx(40);
      margin-bottom: pxTorpx(10);
      position: relative;
      &:not(:nth-child(4n)) {
        margin-right: 25rpx;
      }
      &__image {
        width: pxTorpx(80);
        height: pxTorpx(80);
        border-radius: pxTorpx(5);
        position: relative;
        &.sold__out {
          opacity: 0.5;
          border-radius: pxTorpx(5);
          &::after {
            content: '售罄';
            display: block;
            width: pxTorpx(40);
            height: pxTorpx(20);
            background-color: $uni-theme-color;
            border-radius: pxTorpx(10);
            text-align: center;
            position: absolute;
            top: pxTorpx(30);
            left: pxTorpx(20);
            color: $white;
            font-size: pxTorpx(12);
            line-height: pxTorpx(20);
          }
        }
      }
      .label {
        position: absolute;
        top: 0;
        left: pxTorpx(3);
        font-family: $FZYuan;
        font-weight: 700;
        font-size: pxTorpx(12);
        color: $white;
        letter-spacing: 1px;
        padding: pxTorpx(5);
        font-style: italic;
        letter-spacing: 1px;
      }
      .title {
        font-family: $FZYuan;
        font-weight: 700;
        font-size: pxTorpx(12);
        color: rgb(0, 0, 0);
        margin-top: pxTorpx(4);
      }
      .sub__title {
        font-family: 'PingFangSC';
        font-weight: 400;
        font-size: pxTorpx(10);
        color: rgba(168, 168, 168, 1);
        margin-top: pxTorpx(4);
      }
    }
  }
  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    &__buttons {
      @include flex(center, space-between);
      .button {
        width: 50%;
        line-height: pxTorpx(40);
        height: pxTorpx(40);
        text-align: center;
        color: $white;
        &:first-child {
          background-color: $uni-theme-color;
        }
        &:last-child {
          background-color: #f8dc4c;
        }
      }
    }
  }
  &__lang {
    background-color: rgba(255, 255, 255, 0.5);
    padding: pxTorpx(20);
    @include flex(center, space-between);
    .img {
      width: pxTorpx(60);
      height: pxTorpx(60);
    }
  }
}
</style>
