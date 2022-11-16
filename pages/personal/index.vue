<template>
  <view class="content">
    <HomeNavBar class="nav__wrapper" title="我的"></HomeNavBar>
    <view class="personal__content" :style="{ 'margin-top': navHeight + 'px' }">
      <view class="personal__top__background">
        <view class="personal__top__content">
          <view class="personal__top__item">
            <view class="left">
              <image
                v-if="userInfo.avatar"
                referrerPolicy="no-referrer"
                class="left__avator"
                :src="userInfo.avatar"
                @click="handlePreview()"
              ></image>
              <view v-else class="login_btn" @click="doLogin">登录</view>
              <view class="left__detail">
                <text class="left__text">客户ID：{{ userInfo.uuid || '' }}</text>
                <text class="left__text" @click="handleEditNickName">
                  <!-- 客户昵称：{{
                    userInfo.mobile ? commonUtils.getTel(userInfo.mobile) : userInfo.nickname || ''
                  }} -->
                  客户昵称：{{ userInfo.nickname || '' }}
                </text>
              </view>
            </view>
          </view>
          <view class="personal__top__rank">
            <view class="text">
              <text class="block">我的积分</text>
              <text class="block">{{ userInfo.score || 0 }}</text>
              <text class="block"></text>
            </view>
            <view class="text" @click="handleDoRecharge()">
              <text class="block">我的浪值</text>
              <text class="block">{{ userInfo.money || 0 }}</text>
              <text class="block">充值</text>
            </view>
          </view>
        </view>
      </view>
      <view class="personal__images__content">
        <image v-if="imgSrc" referrerPolicy="no-referrer" class="img" :src="imgSrc"></image>
      </view>
      <view class="personal__menu__content">
        <view class="personal__menu__list">
          <view
            v-for="(item, index) in menuData"
            :key="index"
            class="personal__menu__item"
            @click="handleOperation(item)"
          >
            <image
              class="img"
              referrerPolicy="no-referrer"
              :src="require(`@/assets/images/${item.url}`)"
            ></image>
            <p class="personal__menu__text">{{ item.title }}</p>
          </view>
        </view>
      </view>
    </view>
    <view class="refresh" @click="handleRefresh"></view>
    <DeliveryTips
      ref="tipsProps"
      backgroundColor="#fff"
      color="#000"
      :type="1"
      :notice="siteConfig.user_service_agreement"
    ></DeliveryTips>
    <EditNickName ref="nickNameProps" :fileList="fileList" @success="handleRefresh"></EditNickName>
    <RechargeDetail ref="rechargeProps" @success="handleRefresh"></RechargeDetail>
    <MyTabs :activeTab="2"></MyTabs>
  </view>
</template>
<script>
import { api } from '@/api'
import MyTabs from '@/components/MyTabs'
import DeliveryTips from '@/components/DeliveryTips'
import RechargeDetail from '@/components/RechargeDetail'
import EditNickName from '@/components/EditNickName'
export default {
  components: {
    MyTabs,
    DeliveryTips,
    EditNickName,
    RechargeDetail
  },
  data() {
    return {
      imgSrc: '',
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
    await this.runApiToGetSiteconfig()
    await this.runApiToGetUserInfo()
    uni.stopPullDownRefresh()
  },
  onLoad() {
    this.runApiToGetAreaList()
  },
  onShow() {
    this.runApiToGetSiteconfig()
    this.runApiToGetUserInfo()
  },
  computed: {
    fileList() {
      return (this.userInfo.avatar || '').split(' ')
    },
    isNeedUpdate() {
      return this.userInfo.is_need_update
    }
  },
  watch: {
    isNeedUpdate(newVal) {
      if (newVal === 1) {
        this.handleEditNickName()
      }
    }
  },
  methods: {
    // 预览图片
    handlePreview() {
      const len = this.userInfo.avatar.length
      const str = this.userInfo.avatar.substr(len - 4)
      let bigAvatar = this.userInfo.avatar
      if (str === '/132') {
        bigAvatar = this.userInfo.avatar.substring(0, len - 4) + '/0'
      }
      uni.previewImage({
        current: 0,
        urls: [bigAvatar]
      })
    },
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
        this.imgSrc = data.user_center_top_img
        this.$forceUpdate()
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
  min-height: auto;
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
    background-color: #29abe2;
    border-radius: pxTorpx(20);
    min-height: pxTorpx(140);
    position: relative;
    width: 90%;
    margin: 0 auto pxTorpx(6);
    border: pxTorpx(3) solid #366ba3;
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
      background-color: #fff;
      color: #000;
      border: 1px solid #29abe2;
    }
    .left {
      width: 100%;
      @include flex(center, '');
      &__avator {
        width: pxTorpx(55);
        height: pxTorpx(55);
        border-radius: 50%;
        margin-right: pxTorpx(10);
        border: 1px solid #29abe2;
      }
      &__detail {
        width: calc(100% - 140rpx);
        .left {
          &__text {
            font-family: $Yuanti;
            font-weight: 400;
            font-size: pxTorpx(16);
            color: #000;
            text-align: left;
            display: block;
            max-width: 98%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
      font-family: $Yuanti;
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
    @include flex(top, space-between);
    padding: pxTorpx(10) pxTorpx(5);
    background-color: #12264a;
    border: 1px solid #dbb666;
    border-radius: pxTorpx(15);
    .text {
      font-family: $Yuanti;
      font-weight: 400;
      color: $white;
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
      }
      &:last-child {
        .block {
          &:last-child {
            width: pxTorpx(50);
            box-shadow: 1px 1px #29abe2;
            background-color: #0071bc;
            border-radius: pxTorpx(5);
            margin: 0 auto;
          }
        }
      }
    }
  }
}
.personal__content {
  padding-bottom: pxTorpx(80);
}
.personal__images__content {
  border: pxTorpx(6) solid #29abe2;
  width: calc(100% - 30px);
  height: pxTorpx(135);
  border-radius: pxTorpx(20);
  margin: 0 auto;
  overflow: hidden;
  .img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.personal__menu {
  &__content {
    margin: 0 pxTorpx(10);
    padding: pxTorpx(15) pxTorpx(10) 0;
    margin-top: pxTorpx(6);
    border: pxTorpx(6) solid #29abe2;
    border-radius: pxTorpx(20);
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
    font-size: pxTorpx(18);
    color: #00ab97;
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
