<template>
  <view class="content">
    <view class="home__content" :style="{ 'margin-top': navBarHeight }">
      <CustomNavBar class="nav__wrapper" :home="true"></CustomNavBar>
      <view class="nav__background">
        <view class="home__main__content">
          <CustomSwiper :dataSource="bannerList"></CustomSwiper>
        </view>
      </view>
      <view class="home__main__list">
        <HomeScrollView ref="scrollProps"></HomeScrollView>
      </view>
      <view class="refresh" @click="refresh()"></view>
      <MyTabs :activeTab="0"></MyTabs>
    </view>
  </view>
</template>

<script>
import { api } from '@/api'
import MyTabs from '@/components/MyTabs'
import CustomNavBar from '@/components/CustomNavBar'
import CustomSwiper from '@/components/CustomSwiper'
import HomeScrollView from '@/components/HomeScrollView'
export default {
  components: {
    MyTabs,
    CustomNavBar,
    CustomSwiper,
    HomeScrollView
  },
  data() {
    return {
      isRefresh: false,
      bannerList: []
    }
  },
  async onShow() {
    await this.network().runApiToGetBannerList()
    await this.$nextTick()
    this.refresh()
  },
  async onPullDownRefresh() {
    await this.$nextTick()
    this.$refs.scrollProps.params.page = 1
    this.$refs.scrollProps.productDataSource = []
    await this.$refs.scrollProps.network().runApiToGetProductList()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (this.isRefresh) return
    this.$refs.scrollProps.handleOperation(null, 3)
  },
  methods: {
    async refresh() {
      this.isRefresh = true
      this.$refs.scrollProps.params.page = 1
      this.$refs.scrollProps.productDataSource = []
      await this.$refs.scrollProps.network().runApiToGetProductList()
      this.isRefresh = false
    },
    network() {
      return {
        runApiToGetBannerList: async () => {
          const { code, data } = await api.getBannerList()
          if (code === 1) this.bannerList = (data || []).map((i) => i.image)
        }
      }
    },
    handleOperation($event, type) {
      switch (type) {
        case 0:
          uni.navigateTo({
            url: '/pages/product/detailV2'
          })
          break
        case 1:
          getApp().globalData.type = 1
          uni.navigateTo({
            url: '/pages/notify/index'
          })
          break
        case 2:
          this.$refs.tabsProps.handleTab($event)
          break
        case 3:
          this.$refs.scrollProps.current = $event
          break
        default:
          uni.navigateTo({ url: '/pages/product/search' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.font-loaded {
  font-family: $Yuanti;
}
.home__content {
  margin-bottom: pxTorpx(10);
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
.home__main {
  &__content {
    padding: 0 30rpx;
  }
  &__slogan {
    @include flex(center, space-between);
    .slogan {
      width: 450rpx;
      height: 50rpx;
      display: block;
    }
    .notice {
      width: pxTorpx(76);
      height: pxTorpx(30);
      border: 1px solid $uni-text-color-inverse;
      border-radius: 15px 0px 0px 15px;
      margin-right: -30rpx;
      line-height: pxTorpx(30);
      @include flex(center, space-around);
    }
    .icon__notice {
      height: pxTorpx(18);
      width: pxTorpx(18);
      margin-right: pxTorpx(-3);
      margin-top: pxTorpx(-2);
    }
    .text {
      font-family: $Yuanti;
      font-weight: 400;
      font-size: pxTorpx(12);
      text-align: center;
      color: $white;
    }
  }
  &__list {
    min-height: pxTorpx(320);
    border-radius: pxTorpx(26);
    margin-top: pxTorpx(0);
    margin-bottom: pxTorpx(20);
  }
}
</style>
