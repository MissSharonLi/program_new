<template>
  <view class="content product__detail__content" :style="{ 'margin-top': navHeight + 'px' }">
    <HomeNavBar class="nav__wrapper" :isBack="true" :title="returnObj.goods_name"></HomeNavBar>
    <view class="product__detail__top">
      <view class="product__detail__swiper">
        <view class="lottery">
          <image
            class="lottery_img"
            :src="returnObj.goods_image"
            referrerPolicy="no-referrer"
          ></image>
          <view class="lottery_title">
            <view class="amount">{{ returnObj.stock_num || 0 }}积分</view>
            <view class="amount">
              剩余：{{ returnObj.stock_num || 0 }}/{{ returnObj.goods_num || 0 }}
            </view>
          </view>
          <view class="price">
            {{ returnObj.goods_price || 0 }}{{ returnObj.is_score === 0 ? '浪币' : '积分' }}/枚
          </view>
        </view>
      </view>
      <view class="product__detail__rank">
        <view class="rank__top">
          <view>
            <view class="love" :class="{ active: is_collect }" @click="handleToCollect"></view>
            <view class="tips">收藏</view>
          </view>
          <view>
            <button class="share" data-name="shareBtn" open-type="share"></button>
            <view class="tips toshare">分享</view>
          </view>
        </view>
        <view class="rank__middle">
          <image
            class="img"
            :src="require('@/assets/images/gameinfo.png')"
            @click="handleShowTips(1)"
          ></image>
          <image
            class="img"
            :src="require('@/assets/images/presale.png')"
            @click="handleShowTips"
          ></image>
        </view>
        <view class="rank__bottom">
          <view class="item">
            {{ returnObj.whole_tickets_text || '' }}
          </view>
          <view class="item">{{ returnObj.a_tickets_text || '' }}</view>
          <view class="item">{{ returnObj.b_tickets_text || '' }}</view>
        </view>
      </view>
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
    <view class="product__detail__bottom">
      <view class="bottom__title__content">
        剩余：{{ returnObj.stock_num || 0 }}/{{ returnObj.goods_num || 0 }}
      </view>

      <view v-if="tabIndex === 0" class="product__detail__list">
        <view v-for="(item, index) in dataSource" :key="index" class="list__item">
          <image
            class="list__item__image"
            :class="{ sold__out: item.stock_num === 0 }"
            :src="item.item_image"
            referrerPolicy="no-referrer"
          ></image>
          <text class="num">{{ item.stock_num }}/{{ item.item_num }}</text>
          <view class="title">
            <text class="name">{{ item.item_name }}</text>
          </view>
        </view>
      </view>
      <view v-if="tabIndex === 1" class="lottery__list">
        <Lottery ref="lotteryProps"></Lottery>
      </view>
    </view>
    <view class="product__detail__footer">
      <view v-if="!returnObj.onlyOne" class="product__detail__lang">
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
        <!-- <image
          class="img"
          :src="require('@/assets/images/lang3.png')"
          @click="handleToBuy(5)"
        ></image> -->
        <image
          class="img"
          :src="require('@/assets/images/lang4.png')"
          @click="handleToBuy(10)"
        ></image>
      </view>
      <view v-else class="product__detail__lang">
        <image
          class="img"
          :src="require('@/assets/images/lang1.png')"
          style="width: 128px; height: 98px"
          @click="handleToBuy(1)"
        ></image>
      </view>
    </view>
    <view class="refresh" @click="handleRefresh"></view>
    <BuyDetail ref="buyProps" :params="buyParams" @success="handleSuccess"></BuyDetail>
    <BuySuccess
      ref="rankProps"
      :dataSource="rankProps.dataSource"
      @success="handleRefresh"
    ></BuySuccess>
    <VanDialog id="van-dialog"></VanDialog>
    <BuyTips ref="buyTipsProps" :notice="returnObj.pre_sale_content"></BuyTips>
    <DeliveryTips ref="tipsProps" :notice="returnObj.introduce_content"></DeliveryTips>
  </view>
</template>
<script>
import { api } from '@/api'
import BuySuccess from '@/components/BuySuccess'
import BuyDetail from '@/components/BuyDetail'
import BuyTips from '@/components/BuyTips'
import DeliveryTips from '@/components/DeliveryTips'
import Lottery from './lottery'
export default {
  name: 'DetailV2',
  components: {
    BuyTips,
    BuyDetail,
    BuySuccess,
    Lottery,
    DeliveryTips
  },
  data() {
    return {
      current: 0,
      page: 1,
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
    this.query()
  },
  onReachBottom() {
    this.tabIndex === 1 && this.$nextTick(() => this.$refs.lotteryProps.getData())
  },
  onShareAppMessage() {
    return {
      title: this.returnObj.goods_name,
      imageUrl: this.returnObj.goods_image // 图片 URL
    }
  },
  methods: {
    handleRefresh() {
      this.query()
      if (this.tabIndex === 1) {
        this.$refs.lotteryProps.query(this.params.id)
        this.$refs.lotteryProps.getData(true)
      }
    },
    async query() {
      const { code, data } = await api.getProductDetail({ ...this.params, token: this.token })
      if (code === 1 && data) {
        this.returnObj = data || {}
        this.is_collect = data.is_collect
        this.dataSource = data.item_list || []
        this.$forceUpdate()
      }
    },
    // 切换商品Tab
    handleTab(index) {
      this.tabIndex = index
      if (index === 1) {
        this.commonUtils.login().then(async (res) => {
          await this.$nextTick()
          this.$refs.lotteryProps.query(this.params.id)
          this.$refs.lotteryProps.getData(true)
        })
      }
    },
    // 获取用户信息
    async runApiToGetUserInfo() {
      const { code, data } = await api.getUseriInfo({ token: this.token })
      if (code === 1 && data) {
        this.$store.commit('setUserInfo', JSON.stringify(data))
        uni.setStorageSync('storage_userInfo', JSON.stringify(data))
      }
    },
    // 购买成功
    async handleSuccess(log_sn) {
      this.query()
      this.runApiToGetUserInfo()
      this.$refs.rankProps.show = true
      const { code, data } = await api.getBuyLogDetial({
        token: this.token,
        log_sn
      })
      if (code === 1) this.rankProps.dataSource = data
    },
    // 点击购买
    handleToBuy(num) {
      const handle = () => {
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
          goods_num: this.returnObj.goods_num,
          goods_image: this.returnObj.goods_image,
          sub_title: this.returnObj.sub_title
        }
        this.$refs.buyProps.show = true
      }
      !this.token ? this.commonUtils.login().then(async (res) => handle()) : handle()
    },
    // 收藏
    async handleToCollect() {
      const { id: goods_id } = this.params
      const { code, data } = await api.handleAddCollect({
        goods_id,
        token: this.token,
        is_collect: this.is_collect === 0 ? 1 : 0
      })
      if (code === 1 && data) {
        this.is_collect = !this.is_collect
        this.is_collect ? this.$toast('已成功收藏') : this.$toast('已取消收藏')
      }
    },
    // 购买说明
    handleShowTips(type) {
      type === 1 ? (this.$refs.tipsProps.show = true) : (this.$refs.buyTipsProps.show = true)
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
  &__swiper {
    width: pxTorpx(170);
    margin: 0 auto;
    min-height: pxTorpx(190);
    padding: pxTorpx(15) 0;
    @include flex(center, space-around);
    .img {
      width: pxTorpx(150);
      height: pxTorpx(170);
      border: pxTorpx(10) solid $white;
      margin: 0 auto;
      display: block;
    }
    .lottery {
      width: pxTorpx(144);
      height: pxTorpx(150);
      background-color: #366ba3;
      margin: 0 auto;
      border-radius: pxTorpx(10);
      padding: pxTorpx(6);
      position: relative;
      &_img {
        width: 100%;
        height: pxTorpx(149);
        border: 1px solid #000;
      }
      &_title {
        font-family: $Yuanti;
        position: absolute;
        top: 0;
        width: calc(100% - 14px);
        top: 7px;
        left: 7px;
        @include flex(center, space-between);
        .amount {
          background-color: $white;
          color: #c0262c;
          font-size: pxTorpx(12);
          border-radius: pxTorpx(25);
          padding: pxTorpx(5);
        }
      }
      .price {
        font-family: $Yuanti;
        position: absolute;
        bottom: 7px;
        right: 7px;
        background-color: #fff;
        color: #c0262c;
        font-size: pxTorpx(12);
        border-radius: pxTorpx(25);
        min-width: pxTorpx(50);
        text-align: center;
        padding: pxTorpx(5);
      }
    }
  }
  &__content {
    min-height: 100vh;
    padding-bottom: pxTorpx(60);
    .refresh {
      position: fixed;
      right: 0;
      top: 70%;
      width: pxTorpx(64);
      height: pxTorpx(64);
      background: url('@/assets/images/refresh1.png') no-repeat center;
      background-size: 100%;
    }
    .bottom__tab__content {
      @include flex(center, space-around);
      font-family: $Yuanti;
      color: $white;
      font-size: pxTorpx(16);
      position: relative;
      .tab__item {
        display: block;
        line-height: 2;
        padding: 0 pxTorpx(15);
        background-color: #29abe2;
        border-top-left-radius: pxTorpx(10);
        border-top-right-radius: pxTorpx(10);
        min-width: pxTorpx(50);
        position: relative;
        text-align: center;
        &.active {
          color: #2d3192;
        }
      }
    }
  }
  &__top {
    width: calc(100% - 20px);
    margin: pxTorpx(15) auto;
    background-color: #29abe2;
    border: 2px solid #366ba3;
    border-radius: pxTorpx(16);
    position: relative;
    &:before {
      content: '';
      width: pxTorpx(50);
      height: pxTorpx(50);
      display: block;
      // background: url('@/assets/images/bg8.png') no-repeat center;
      background-size: 100%;
      left: 0;
      top: -40px;
      position: absolute;
      z-index: 99999999;
    }
  }
  &__rank {
    .img {
      width: pxTorpx(45);
      height: pxTorpx(45);
    }
    .rank__top {
      width: calc(100% - 110rpx);
      position: absolute;
      top: pxTorpx(15);
      left: pxTorpx(25);
      @include flex(center, space-between);
      .share {
        width: pxTorpx(40);
        height: pxTorpx(40);
        display: block;
        background: url('@/assets/images/share.png') no-repeat center;
        background-size: 100% 100%;
        margin-left: 0;
        padding-left: 0;
        padding-right: 0;
      }
      .tips {
        color: #c0262c;
        font-size: pxTorpx(16);
        display: block;
        text-align: center;
        margin-top: pxTorpx(2);
        font-family: $Yuanti;
        &.toshare {
          color: #12264a;
        }
      }
      .love {
        width: pxTorpx(40);
        height: pxTorpx(40);
        display: block;
        background: url('@/assets/images/love.png') no-repeat center;
        background-size: 100% 100%;
        &.active {
          background: url('@/assets/images/loved.png') no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
    .rank__middle {
      width: pxTorpx(94);
      position: absolute;
      bottom: pxTorpx(70);
      right: pxTorpx(3);
      @include flex(center, space-between);
    }
    .rank__bottom {
      width: pxTorpx(80);
      min-height: pxTorpx(89);
      position: absolute;
      top: pxTorpx(90);
      left: pxTorpx(5);
      font-size: pxTorpx(12);
      padding: pxTorpx(5);
      border-radius: pxTorpx(10);
      background-color: $white;
      .item {
        color: #932727;
        font-family: $Yuanti;
        font-size: pxTorpx(12);
      }
    }
  }

  &__bottom {
    background-color: #f0fcff;
    border-radius: pxTorpx(20);
    width: calc(100% - 32px);
    margin: 0 auto;
    border: pxTorpx(6) solid #29abe2;
    min-height: pxTorpx(400);
    .bottom__title__content {
      font-family: $Yuanti;
      color: #2d3192;
      font-size: pxTorpx(20);
      text-align: center;
      padding: pxTorpx(20) 0 pxTorpx(10);
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
      background: url('@/assets/images/bg10.png') no-repeat center;
      background-size: 100% 100%;
      border-bottom-left-radius: pxTorpx(5);
      border-bottom-right-radius: pxTorpx(5);
      padding-bottom: pxTorpx(10);
      &:not(:nth-child(3n)) {
        margin-right: 25rpx;
      }
      .num {
        position: absolute;
        background-color: $white;
        padding: pxTorpx(2) pxTorpx(15);
        border-radius: pxTorpx(5);
        right: pxTorpx(5);
        font-family: $Yuanti;
        font-size: pxTorpx(16);
        top: pxTorpx(80);
      }
      &__image {
        width: calc(100% - 20rpx);
        height: pxTorpx(100);
        position: relative;
        margin: pxTorpx(5) pxTorpx(5) 0;
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
            top: pxTorpx(40);
            left: calc(50% - 45rpx);
            color: $theme-light-color;
            font-size: pxTorpx(12);
            line-height: pxTorpx(20);
          }
          &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: pxTorpx(100);
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
        .name {
          font-weight: 700;
          font-size: pxTorpx(10);
          color: #231815;
          max-width: 99%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-break: break-all;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: center;
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
    @include flex(center, space-around);
    .img {
      width: pxTorpx(118);
      height: pxTorpx(88);
    }
  }
}
</style>
