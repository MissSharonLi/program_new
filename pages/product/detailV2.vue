<template>
  <view class="product__detail__content">
    <view class="product__detail__top">
      <CustomSwiper :isBanner="true" :dataSource="imgDataSource" :isUnique="true"></CustomSwiper>
      <view class="rank__content">
        <view class="like">
          <view class="love" :class="{ active: is_collect }" @click="handleToCollect"></view>
          <button class="share" data-name="shareBtn" open-type="share"></button>
        </view>
        <view class="rank">
          <view class="button" @click="handleToRewards">
            <text class="lint">我</text>
            <text class="lint">的</text>
            <text class="lint">赏</text>
            <text class="lint">袋</text>
          </view>
          <view class="button" @click="handleLottery">
            <text class="lint">抽</text>
            <text class="lint">奖</text>
            <text class="lint">记</text>
            <text class="lint">录</text>
          </view>
        </view>
      </view>
    </view>
    <view class="product__detail__buttons">
      <view class="button" @click="$refs.buyTipsProps.show = true">
        <text class="lint">活</text>
        <text class="lint">动</text>
        <text class="lint">说</text>
        <text class="lint">明</text>
      </view>
      <view class="button" @click="query()">
        <text class="lint">刷</text>
        <text class="lint">新</text>
      </view>
    </view>
    <view class="product__detail__rate">
      <view class="product__detail__rate__content">
        <view class="title">
          <text class="lint">锁</text>
          <text class="lint">箱</text>
          <text class="lint">机</text>
          <text class="lint">会</text>
          <text class="lint">剩</text>
          <text class="lint">余</text>
          <text class="lint">{{ returnObj.lock_times || 0 }}</text>
          <text class="lint">次</text>
        </view>
        <view class="subtitle">
          <text class="left">
            <text class="lint" style="font-size: 50rpx">{{ returnObj.goods_price || '' }}</text>
            <text class="lint" style="font-size: 30rpx">
              {{ returnObj.is_score === 0 ? '元' : '点数' }}/
            </text>
            <text class="lint" style="font-size: 30rpx">张</text>
            <text class="lint" style="font-size: 30rpx">明</text>
            <text class="lint" style="font-size: 30rpx">信</text>
            <text class="lint" style="font-size: 30rpx">片</text>
          </text>
          <text class="right lint">
            <text class="lint" style="font-size: 30rpx">剩</text>
            <text class="lint" style="font-size: 30rpx">余：</text>
            <text class="lint">{{ returnObj.stock_num || 0 }}/{{ returnObj.goods_num || 0 }}</text>
          </text>
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
        <view class="title">
          <text class="name">{{ item.tag_title }}</text>
          <text class="num">{{ item.stock_num }}/{{ item.item_num }}</text>
        </view>
        <view class="sub__title">{{ item.item_name }}</view>
        <view class="sub__title">{{ item.tip }}</view>
        <view class="sub__title">{{ item.parcent_title }}</view>
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
      <!-- <view class="product__detail__footer__buttons">
        <view class="button" @click="handleOperation(null, '锁箱')">
          <text class="lint">锁</text>
          <text class="lint">箱</text>
        </view>
      </view> -->
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
  name: 'DetailV2',
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
        this.imgDataSource = data.goods_image.split(',')
      }
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
page {
  background-position-y: 25%;
}
</style>

<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.product__detail {
  &__content {
    min-height: 100vh;
    padding-bottom: pxTorpx(60);
  }
  &__top {
    position: relative;
    .rank__content {
      position: absolute;
      width: 100%;
      left: 0;
      top: pxTorpx(40);
      @include flex(center, space-between);
      .love {
        width: pxTorpx(40);
        height: pxTorpx(40);
        display: block;
        background: url('@/assets/images/love.png') no-repeat center;
        background-size: pxTorpx(40) pxTorpx(40);
        margin-left: pxTorpx(15);
        margin-bottom: pxTorpx(10);
        &.active {
          background: url('@/assets/images/loved.png') no-repeat center;
          background-size: pxTorpx(40) pxTorpx(40);
          margin-left: pxTorpx(15);
        }
      }
      .share {
        width: pxTorpx(40);
        height: pxTorpx(40);
        display: block;
        background: url('@/assets/images/share.png') no-repeat center;
        background-size: pxTorpx(40) pxTorpx(40);
        margin-left: pxTorpx(15);
      }
      .button {
        background-color: $sub-nav-theme-color;
        line-height: pxTorpx(30);
        border-radius: 15px 0px 0px 15px;
        font-size: pxTorpx(14);
        color: $theme-light-color;
        font-weight: bold;
        width: pxTorpx(100);
        text-align: center;
        margin-bottom: pxTorpx(10);
        // &::before {
        //   content: '';
        //   display: block;
        //   width: pxTorpx(16);
        //   height: pxTorpx(16);
        //   background: url('@/assets/images/bag.png') no-repeat;
        //   background-size: 100% 100%;
        //   margin-left: pxTorpx(10);
        //   margin-right: pxTorpx(10);
        // }
        // &:last-child {
        //   &::before {
        //     background: url('@/assets/images/rank.png') no-repeat;
        //     background-size: 100% 100%;
        //   }
        // }
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
          border-radius: pxTorpx(5);
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
        margin-top: pxTorpx(4);
        @include flex(center, space-between);
        .name {
          font-weight: 700;
          font-size: pxTorpx(14);
          color: #ff0000;
        }
        .num {
          font-weight: 400;
          color: #a8a8a8;
          font-size: pxTorpx(10);
        }
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
