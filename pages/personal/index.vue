<template>
  <view class="content">
    <HomeNavBar class="nav__wrapper" title="我的"></HomeNavBar>
    <view class="personal__content" :style="{ 'padding-top': navBarHeight }">
      <view class="personal__top__background">
        <view class="personal__top__content">
          <view class="personal__top__item">
            <view class="left">
              <image v-if="userInfo.avatar" class="left__avator" :src="userInfo.avatar"></image>
              <view v-else class="login_btn" @click="doLogin">登录</view>
              <view class="left__detail">
                <text class="left__text">
                  {{
                    userInfo.mobile ? commonUtils.getTel(userInfo.mobile) : userInfo.nickname || ''
                  }}
                </text>
              </view>
            </view>
          </view>
          <view class="personal__top__rank">
            <view class="text" @click="handleDoRecharge()">
              <text class="block">我的浪值</text>
              <text class="block">{{ userInfo.money || 0 }}</text>
              <text class="block">充值</text>
            </view>
            <view class="text">
              <text class="block">我的积分</text>
              <text class="block">{{ userInfo.score || 0 }}</text>
              <text class="block">兑换</text>
            </view>
          </view>
        </view>
      </view>
      <image class="personal__images__content" :src="siteConfig.user_center_top_img"></image>
      <view class="personal__menu__content">
        <view class="personal__menu__list">
          <view
            v-for="(item, index) in menuData"
            :key="index"
            class="personal__menu__item"
            @click="handleOperation(item)"
          >
            <image class="img" :src="require('@/assets/images/' + item.url)"></image>
          </view>
        </view>
      </view>
      <view class="personal__list__content">
        <view class="personal__list">
          <view class="button" @click="handleOperation(null, 2)">用户服务協议</view>
          <view class="button" @click="handleOperation(null, 2)">用户服务協议</view>
        </view>
      </view>
    </view>
    <DeliveryTips
      ref="tipsProps"
      backgroundColor="#fff"
      color="#000"
      :type="1"
      :notice="siteConfig.user_service_agreement"
    ></DeliveryTips>
    <RechargeDetail ref="rechargeProps" @success="runApiToGetUserInfo"></RechargeDetail>
  </view>
</template>
<script>
import { api } from '@/api'
import DeliveryTips from '@/components/DeliveryTips'
import HomeNavBar from '@/components/HomeNavBar'
import RechargeDetail from '@/components/RechargeDetail'
export default {
  components: {
    DeliveryTips,
    HomeNavBar,
    RechargeDetail
  },
  data() {
    return {
      menuData: [
        {
          url: 'buy.png',
          title: '积分流水',
          path: '/pages/personal/consumptionHistory?type=1'
        },
        {
          url: 'amount.png',
          title: '余额流水',
          path: '/pages/personal/consumptionHistory?type=0'
        },
        {
          url: 'gold.png',
          title: '冲浪排行',
          path: '/pages/personal/goldRanking'
        },
        {
          url: 'location.png',
          title: '地址管理',
          path: '/pages/personal/addressManagement'
        },
        {
          url: 'like.png',
          title: '我的收藏',
          path: '/pages/personal/collection'
        },
        {
          url: 'about.png',
          title: '联系客服',
          path: '/pages/personal/aboutUs'
        }
      ]
    }
  },
  async onPullDownRefresh() {
    await this.runApiToGetUserInfo()
    await this.runApiToGetSiteconfig()
    uni.stopPullDownRefresh()
  },
  onLoad() {
    this.runApiToGetAreaList()
    this.runApiToGetUserInfo()
    this.runApiToGetSiteconfig()
  },
  methods: {
    // 充值
    handleDoRecharge() {
      this.$refs.rechargeProps.show = true
      this.$refs.rechargeProps.runApiToGetConfigList()
    },
    handleOperation(record, type) {
      switch (type) {
        case 0:
          uni.navigateTo({ url: '/pages/personal/bindPhone' })
          break
        case 1:
          uni.navigateTo({ url: '/pages/personal/goldRanking' })
          break
        case 2:
          this.$refs.tipsProps.show = true
          break
        default: {
          const { path } = record
          uni.navigateTo({ url: path })
        }
      }
    },
    doLogin(item) {
      this.commonUtils.login()
    },
    handleToPath(type) {
      uni.navigateTo({ url: '/pages/personal/orderManagement?status=' + type })
    },
    async runApiToGetUserInfo() {
      const { code, data } = await api.getUseriInfo({ token: this.token })
      if (code === 1 && data) {
        this.$store.commit('setUserInfo', JSON.stringify(data))
        uni.setStorageSync('storage_userInfo', JSON.stringify(data))
      }
    },
    // 获取图片
    async runApiToGetSiteconfig() {
      const { code, data } = await api.getSiteconfig({ token: this.token })
      if (code === 1 && data) {
        this.$store.commit('setSiteConfig', JSON.stringify(data))
        uni.setStorageSync('storage_siteConfig', JSON.stringify(data))
      }
    },
    async runApiToGetAreaList() {
      const { code, data } = await api.getAreaList({ token: this.token })
      if (code === 1) this.$store.commit('setAreaList', JSON.stringify(data))
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.personal__top {
  &__background {
    background-color: #4d4d4d;
    border-radius: pxTorpx(20);
    min-height: pxTorpx(140);
    position: relative;
  }
  &__content {
    padding: pxTorpx(15) pxTorpx(30);
  }
  &__item {
    @include flex(center, space-between);
    margin-bottom: pxTorpx(20);
    .login_btn {
      width: pxTorpx(55);
      height: pxTorpx(55);
      border-radius: 50%;
      margin-right: pxTorpx(10);
      text-align: center;
      font-size: pxTorpx(14);
      line-height: pxTorpx(55);
      background-color: #b5b5b5;
      color: #fff;
    }
    .left {
      @include flex(center, '');
      &__avator {
        width: pxTorpx(55);
        height: pxTorpx(55);
        border-radius: 50%;
        margin-right: pxTorpx(10);
      }
      &__detail {
        .left {
          &__text {
            font-family: $PingFang;
            font-weight: 400;
            font-size: rpxTorpx(16);
            color: $white;
            text-align: center;
          }
          &__button {
            min-width: pxTorpx(100);
            height: pxTorpx(27);
            min-height: pxTorpx(27);
            background-color: rgb(248, 220, 76);
            border: 1px solid $white;
            border-radius: pxTorpx(22);
            font-size: pxTorpx(14);
            @include flex(center, '');
            margin-top: pxTorpx(5);
            padding-right: pxTorpx(5);
            &__left {
              &:nth-child(1) {
                width: pxTorpx(23);
                height: pxTorpx(23);
                background-color: rgb(240, 151, 68);
                color: $white;
                font-size: pxTorpx(12);
                border-radius: 50%;
                text-align: center;
                line-height: pxTorpx(23);
              }
              &:nth-child(2) {
                color: $white;
                margin-left: pxTorpx(5);
                font-size: pxTorpx(13);
              }
            }
          }
        }
      }
    }
    .right {
      font-family: $PingFang;
      font-weight: 400;
      font-size: pxTorpx(12);
      color: $white;
      @include flex(center, space-between);
      &::after {
        content: '';
        display: block;
        width: pxTorpx(18);
        height: pxTorpx(18);
        margin-left: pxTorpx(5);
        background: url('@/assets/images/go.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  &__rank {
    @include flex(center, space-between);
    padding: 0 pxTorpx(30);
    .text {
      font-family: $Yuanti;
      font-weight: 400;
      color: $white;
      .block {
        display: block;
        text-align: center;
        line-height: 1.5;
        font-size: pxTorpx(12);
        &:nth-child(2) {
          font-size: pxTorpx(22);
        }
        &:last-child {
          width: pxTorpx(50);
          border: 2px solid #fff;
          background-color: #c1272d;
          border-radius: pxTorpx(25);
        }
      }
    }
  }
}
.personal__content {
  padding-bottom: pxTorpx(20);
}
.personal__images__content {
  width: 100%;
  height: pxTorpx(135);
  border-radius: pxTorpx(20);
  margin: pxTorpx(10) 0 0;
}
.personal__menu {
  &__content {
    margin: pxTorpx(10);
    padding-bottom: pxTorpx(35);
    margin-top: pxTorpx(40);
  }
  &__list {
    font-size: pxTorpx(14);
    @include flex(center, '', wrap);
  }
  &__item {
    width: 33%;
    @include flex(center, space-between, wrap);
    margin-bottom: pxTorpx(25);
    color: $white;
    .img {
      width: pxTorpx(60);
      height: pxTorpx(60);
      margin: 0 auto pxTorpx(10);
    }
  }
  &__text {
    display: block;
    width: 100%;
    text-align: center;
    font-family: $Yuanti;
    font-weight: 400;
    font-size: pxTorpx(15);
    color: $white;
  }
}
.personal__list__content {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  .personal__list {
    @include flex(center, space-between);
    margin: pxTorpx(5) 0 pxTorpx(20);
    padding: 0 pxTorpx(30);
    .button {
      width: pxTorpx(120);
      height: pxTorpx(40);
      line-height: pxTorpx(40);
      box-shadow: #808080 5px 5px 0px 0px;
      color: $white;
      border-radius: pxTorpx(4);
      font-size: pxTorpx(14);
      text-align: center;
      background: #f7931e;
      font-family: $Yuanti;
    }
  }
}
</style>
