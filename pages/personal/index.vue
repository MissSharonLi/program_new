<template>
  <view class="content">
    <HomeNavBar class="nav__wrapper" title="MINE"></HomeNavBar>
    <view class="personal__content" :style="{ 'margin-top': navBarHeight }">
      <view class="personal__top__background">
        <view class="personal__top__content">
          <view class="personal__top__item">
            <view class="left">
              <image v-if="userInfo.avatar" class="left__avator" :src="userInfo.avatar"></image>
              <view v-else class="login_btn" @click="doLogin">登录</view>
              <view class="left__detail">
                <text class="left__text" @click="handleEditNickName">
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
            <image class="img" :src="require(`@/assets/images/${item.url}`)"></image>
          </view>
        </view>
      </view>
      <!-- <view class="personal__list__content">
        <view class="personal__list">
          <view class="button" @click="handleOperation(null, 2)">用户服务協议</view>
          <view class="button" @click="handleOperation(null, 2)">用户服务協议</view>
        </view>
      </view> -->
    </view>
    <view class="refresh" @click="handleRefresh"></view>
    <DeliveryTips
      ref="tipsProps"
      backgroundColor="#fff"
      color="#000"
      :type="1"
      :notice="siteConfig.user_service_agreement"
    ></DeliveryTips>
    <EditNickName ref="nickNameProps" @success="handleRefresh"></EditNickName>
    <RechargeDetail ref="rechargeProps" @success="handleRefresh"></RechargeDetail>
    <MyTabs :activeTab="2"></MyTabs>
  </view>
</template>
<script>
import { api } from '@/api'
import MyTabs from '@/components/MyTabs'
import DeliveryTips from '@/components/DeliveryTips'
import HomeNavBar from '@/components/HomeNavBar'
import RechargeDetail from '@/components/RechargeDetail'
import EditNickName from '@/components/EditNickName'
export default {
  components: {
    MyTabs,
    DeliveryTips,
    HomeNavBar,
    EditNickName,
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
    // 重置刷新
    handleRefresh() {
      this.runApiToGetUserInfo()
      this.runApiToGetSiteconfig()
    },
    // 充值
    handleDoRecharge() {
      this.$refs.rechargeProps.show = true
      this.$refs.rechargeProps.runApiToGetConfigList()
    },
    // 修改昵称
    handleEditNickName() {
      this.$refs.nickNameProps.show = true
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
::v-deep .custom__nav__content .nav__title {
  padding-bottom: 0 !important;
}
.content {
  .refresh {
    position: fixed;
    right: 0;
    top: 70%;
    width: pxTorpx(64);
    height: pxTorpx(64);
    background: url('@/assets/images/refresh1.png') no-repeat center;
    background-size: 100%;
  }
}
.personal__top {
  &__background {
    background-color: #12264a;
    border-radius: pxTorpx(20);
    min-height: pxTorpx(140);
    position: relative;
    width: 85%;
    margin: 0 auto pxTorpx(25);
    border: pxTorpx(8) solid #dbb666;
  }
  &__content {
    padding: pxTorpx(15);
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
        border: 1px solid #f7931e;
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
    padding: 0 pxTorpx(5);
    .text {
      font-family: $Yuanti;
      font-weight: 400;
      color: $white;
      border: 1px solid #dbb666;
      padding: 5px 10px;
      border-radius: pxTorpx(10);
      width: 45%;
      &:first-child {
        margin-right: pxTorpx(10);
      }
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
          margin: 0 auto;
        }
      }
    }
  }
}
.personal__content {
  padding-bottom: pxTorpx(80);
}
.personal__images__content {
  width: calc(100% - 30px);
  height: pxTorpx(135);
  border-radius: pxTorpx(20);
  margin: 20rpx auto 0;
  display: block;
  border: pxTorpx(8) solid #dbb666;
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
  bottom: pxTorpx(75);
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
