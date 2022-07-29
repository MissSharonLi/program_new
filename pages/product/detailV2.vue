<template>
  <view class="product__detail__content" :style="{ 'padding-top': navBarHeight }">
    <HomeNavBar class="nav__wrapper" :title="returnObj.goods_name"></HomeNavBar>
    <view class="product__detail__top">
      <view class="product__detail__swiper">
        <image v-if="tabIndex === 0" class="img" :src="returnObj.goods_image"></image>
        <view v-if="tabIndex === 1" class="lottery">
          <image class="lottery_img" :src="returnObj.goods_image"></image>
          <view class="lottery_title">{{ returnObj.goods_name }}</view>
        </view>
      </view>
      <view class="product__detail__rank">
        <view class="rank__top">
          <button class="share" data-name="shareBtn" open-type="share"></button>
          <image class="img" :src="require('@/assets/images/gameinfo.png')"></image>
        </view>
        <view class="rank__bottom">
          <view class="love" :class="{ active: is_collect }" @click="handleToCollect"></view>
          <image class="img" :src="require('@/assets/images/presale.png')"></image>
        </view>
      </view>
    </view>
    <view class="product__detail__bottom">
      <view class="bottom__title__content">
        剩余：{{ returnObj.stock_num || 0 }}/{{ returnObj.goods_num || 0 }}
      </view>
      <view class="bottom__tab__content">
        <text
          v-for="(item, index) in tabList"
          :key="index"
          class="tab__item"
          :class="{ active: tabIndex === index }"
          @click="handleTab(index)"
        >
          {{ item.label }}
        </text>
      </view>
      <view class="product__detail__list">
        <view v-for="(item, index) in dataSource" :key="index" class="list__item">
          <image
            class="list__item__image"
            :class="{ sold__out: item.stock_num === 0 }"
            :src="item.item_image"
          ></image>
          <view class="title">
            <text class="name">{{ item.tag_title }}</text>
            <text class="num">{{ item.stock_num }}/{{ item.item_num }}</text>
          </view>
        </view>
      </view>
      <view class="lottery__list">
        <Lottery :id="params" ref="lotteryProps"></Lottery>
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
import HomeNavBar from '@/components/HomeNavBar'
import Dialog from '@/wxcomponents/vant/dialog/dialog'
import Lottery from './lottery'
export default {
  name: 'DetailV2',
  components: {
    BuyTips,
    BuyDetail,
    BuySuccess,
    HomeNavBar,
    Lottery
  },
  data() {
    return {
      current: 0,
      isLock: false,
      is_collect: false,
      tabIndex: 0,
      tabList: [
        { label: '商品', value: 0 },
        { label: '抽奖记录', value: 1 }
      ],
      rankProps: {
        show: false,
        dataSource: []
      },
      buyParams: {},
      params: {
        id: ''
      },
      returnObj: {
        box_num: 0
      },
      dataSource: []
    }
  },
  onLoad(options) {
    this.params.id = options.id
    this.$refs.lotteryProps.query(options.id)
    this.query()
  },
  onShareAppMessage() {
    return {
      title: this.returnObj.goods_name,
      imageUrl: this.returnObj.goods_image // 图片 URL
    }
  },
  methods: {
    async query() {
      const { code, data } = await api.getProductDetail(this.params)
      if (code === 1 && data) {
        this.returnObj = data || {}
        this.is_collect = data.is_collect
        this.dataSource = data.item_list || []
      }
    },
    // 切换商品Tab
    handleTab(index) {
      this.tabIndex = index
    },
    async handleLottery() {
      uni.navigateTo({ url: '/pages/product/lottery?id=' + this.params.id })
    },
    async runApiToGetUserInfo() {
      const { code, data } = await api.getUseriInfo({ token: this.token })
      if (code === 1 && data) {
        this.$store.commit('setUserInfo', JSON.stringify(data))
        uni.setStorageSync('storage_userInfo', JSON.stringify(data))
      }
    },
    async handleSuccess(log_sn) {
      this.query()
      this.runApiToGetUserInfo()
      this.$refs.rankProps.show = true
      const { code, data } = await api.getBuyLogDetial({
        token: this.token,
        log_sn
      })
      if (code === 1) {
        this.rankProps.dataSource = data
      }
    },
    handleToRewards() {
      uni.navigateTo({ url: '/pages/personal/myAwardBag' })
    },
    handleToBuy(num) {
      this.commonUtils.login().then(async (res) => {
        this.buyParams = {
          ...this.params,
          num,
          token: this.token,
          money: this.userInfo.money,
          notice: this.returnObj.buy_notice,
          is_score: this.returnObj.is_score,
          goods_name: this.returnObj.goods_name,
          goods_price: this.returnObj.goods_price,
          stock_num: this.returnObj.stock_num,
          goods_num: this.returnObj.goods_num
        }
        this.$refs.buyProps.show = true
      })
    },
    // 收藏
    async handleToCollect() {
      const { id: goods_id } = this.params
      const { code, data } = await api.handleAddCollect({ goods_id, token: this.token })
      if (code === 1 && data) {
        this.is_collect = !this.is_collect
        this.is_collect ? this.$toast('已成功收藏') : this.$toast('已取消收藏')
      }
    },
    handleOperation(title = '提示', message) {
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
// page {
//   background-position-y: 25%;
// }
</style>

<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.product__detail {
  &__swiper {
    width: pxTorpx(135);
    margin: 0 auto;
    min-height: pxTorpx(170);
    padding: pxTorpx(15) 0;
    @include flex(center, space-around);
    .img {
      width: pxTorpx(125);
      height: pxTorpx(150);
      border: pxTorpx(10) solid $white;
      margin: 0 auto;
      display: block;
    }
    .lottery {
      width: pxTorpx(135);
      min-height: pxTorpx(150);
      background-color: $white;
      margin: 0 auto;
      border-bottom-left-radius: pxTorpx(10);
      border-bottom-right-radius: pxTorpx(10);
      &_img {
        width: 100%;
        height: pxTorpx(120);
      }
      &_title {
        font-family: $Yuanti;
        font-size: pxTorpx(12);
        padding: pxTorpx(5) pxTorpx(10);
      }
    }
  }
  &__content {
    min-height: 100vh;
    padding-bottom: pxTorpx(60);
  }
  &__top {
    position: relative;
    width: calc(100% - 20px);
    margin: pxTorpx(15) auto;
    background-color: $theme-title-bg-color;
    border-radius: pxTorpx(20);
  }
  &__rank {
    .img {
      width: pxTorpx(48);
      height: pxTorpx(48);
      margin-right: pxTorpx(20);
    }
    .rank__top {
      width: calc(100% - 40rpx);
      position: absolute;
      top: pxTorpx(10);
      left: pxTorpx(20);
      @include flex(center, space-between);
      .share {
        width: pxTorpx(24);
        height: pxTorpx(28);
        display: block;
        background: url('@/assets/images/share.png') no-repeat center;
        background-size: pxTorpx(24) pxTorpx(28);
        margin-left: 0;
      }
    }
    .rank__bottom {
      width: calc(100% - 40rpx);
      position: absolute;
      bottom: pxTorpx(10);
      left: pxTorpx(20);
      @include flex(center, space-between);
      .love {
        width: pxTorpx(24);
        height: pxTorpx(24);
        display: block;
        background: url('@/assets/images/love.png') no-repeat center;
        background-size: pxTorpx(24) pxTorpx(24);
        margin-left: pxTorpx(5);
        &.active {
          background: url('@/assets/images/loved.png') no-repeat center;
          background-size: pxTorpx(24) pxTorpx(24);
          margin-left: pxTorpx(5);
        }
      }
    }
  }
  &__bottom {
    background-color: $theme-title-bg-color;
    border-radius: pxTorpx(20);
    width: calc(100% - 20px);
    margin: pxTorpx(15) auto;
    .bottom__title__content {
      font-family: $Yuanti;
      color: $white;
      font-size: pxTorpx(20);
      text-align: center;
      padding: pxTorpx(20) 0 pxTorpx(10);
    }
    .bottom__tab__content {
      @include flex(center, space-around);
      font-family: $Yuanti;
      color: $white;
      font-size: pxTorpx(16);
      margin-bottom: pxTorpx(15);
      .tab__item {
        display: block;
        line-height: 2;
        padding: 0 pxTorpx(10);
        &.active {
          border-bottom: 1px solid red;
        }
      }
    }
  }
  &__buttons {
    @include flex(center, space-between);
    margin: pxTorpx(10) pxTorpx(15);
    .button {
      background-color: $sub-nav-theme-color;
      line-height: pxTorpx(30);
      width: pxTorpx(80);
      border-radius: pxTorpx(5);
      font-size: pxTorpx(14);
      text-align: center;
      color: $theme-light-color;
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
          background: url('@/assets/images/refresh1.png') no-repeat center;
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
        font-family: $PingFang;
        font-weight: 400;
        font-size: pxTorpx(14);
        color: $theme-light-color;
        width: 100%;
      }
      .subtitle {
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(18);
        color: $theme-light-color;
        width: 100%;
        @include flex(center, space-between);
      }
    }
  }
  &__list {
    @include flex(top, flex-start, wrap);
    padding: pxTorpx(5) pxTorpx(10);
    .list__item {
      width: calc(33% - 16rpx);
      min-height: pxTorpx(40);
      margin-bottom: pxTorpx(10);
      position: relative;
      background-color: $white;
      border-bottom-left-radius: pxTorpx(5);
      border-bottom-right-radius: pxTorpx(5);
      padding-bottom: pxTorpx(10);
      &:not(:nth-child(3n)) {
        margin-right: 25rpx;
      }
      &__image {
        width: 100%;
        height: pxTorpx(80);
        position: relative;
        &.sold__out {
          &::after {
            content: '售罄';
            display: block;
            width: pxTorpx(40);
            height: pxTorpx(20);
            background-color: $sub-nav-theme-color;
            border-radius: pxTorpx(10);
            text-align: center;
            position: absolute;
            top: pxTorpx(30);
            left: pxTorpx(20);
            color: $theme-light-color;
            font-size: pxTorpx(12);
            line-height: pxTorpx(20);
          }
          &::before {
            content: '';
            position: absolute;
            width: pxTorpx(80);
            height: pxTorpx(80);
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, 0.5);
          }
        }
      }
      .label {
        position: absolute;
        top: 0;
        left: pxTorpx(3);
        font-family: $Yuanti;
        font-weight: 700;
        font-size: pxTorpx(12);
        color: $white;
        letter-spacing: 1px;
        padding: pxTorpx(5);
        font-style: italic;
        letter-spacing: 1px;
      }
      .title {
        font-family: $Yuanti;
        margin-top: pxTorpx(4);
        padding: 0 pxTorpx(5);
        @include flex(center, space-between);
        .name {
          font-weight: 700;
          font-size: pxTorpx(14);
          color: #231815;
        }
        .num {
          font-weight: 400;
          color: #231815;
          font-size: pxTorpx(10);
        }
      }
      .sub__title {
        font-family: $PingFang;
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
        width: 100%;
        line-height: pxTorpx(40);
        height: pxTorpx(40);
        text-align: center;
        background-color: $sub-nav-theme-color;
        .lint {
          font-size: pxTorpx(26);
        }
      }
    }
  }
  &__lang {
    padding: pxTorpx(20);
    @include flex(center, space-between);
    .img {
      width: pxTorpx(60);
      height: pxTorpx(60);
    }
  }
}
</style>
