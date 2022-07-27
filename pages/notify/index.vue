<template>
  <view class="content">
    <!-- <HomeNavBar :title="navTitle" isDefault></HomeNavBar> -->
    <view class="notify__wrapper">
      <SubTabs ref="subTabsProps" :dataSource="tabList" @tabClick="handleTab"></SubTabs>
      <view v-if="returnData.length > 0" class="notify__content">
        <view class="notify__progress__bar">
          <view v-for="(item, index) in returnData" :key="index" class="notify__progress__item">
            <text class="progress__text">
              <text>{{ params.type === 3 ? `每日${item.timing}` : item.advancetime }}</text>
              <text v-if="item.num" style="padding-left: 5px">{{ ` 补${item.num}箱` }}</text>
            </text>
            <view class="progress__image">
              <image class="img" :src="item.thumb_image"></image>
              <view>
                <text class="progress__title">{{ item.title }}</text>
                <text class="progress__price">￥{{ item.price }}/张</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- <MyTabs></MyTabs> -->
  </view>
</template>

<script>
import { api } from '@/api'
import SubTabs from '@/components/SubTabs'
// import HomeNavBar from '@/components/HomeNavBar'
// import MyTabs from '@/components/MyTabs'
export default {
  components: {
    SubTabs
    // MyTabs
    // HomeNavBar
  },
  data() {
    return {
      params: {
        page: 1,
        type: 1
      },
      tabList: [
        { label: '新品预告', value: 1 },
        { label: '补箱预告', value: 2 },
        { label: '每日补箱', value: 3 }
      ],
      returnData: []
    }
  },
  computed: {
    navTitle() {
      return this.params.type === 1 ? '新品预告' : this.params.type === 2 ? '补箱预告' : '每日补箱'
    }
  },
  onLoad() {
    if (!getApp().globalData.type) this.getData()
  },
  onShow() {
    const { type } = getApp().globalData
    if (type && type === 1) this.$nextTick(() => this.$refs.subTabsProps.handleTab(0, type))
  },
  onHide() {
    getApp().globalData.type = null
  },
  onReachBottom() {
    this.params.page++
    this.getData()
  },
  methods: {
    handleTab(index) {
      this.returnData = []
      this.params.page = 1
      this.params.type = index
      this.getData()
      uni.setNavigationBarTitle({ title: this.navTitle })
    },
    async getData() {
      const { code, data } = await api.getAdvanceList({ ...this.params, token: this.token })
      if (code === 1 && data) {
        if (data.data.length > 0) {
          this.returnData = this.returnData.concat(data.data)
        } else {
          this.params.page > 1 ? this.$toast('没有更多数据了') : this.$toast('暂无数据')
          this.params.page > 1 ? this.params.page-- : (this.returnData = [])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.notify {
  &__wrapper {
    position: relative;
  }
  &__content {
    padding-top: pxTorpx(55);
  }
}
.notify__nav {
  &__content {
    @include flex(center, space-around);
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 9;
    height: pxTorpx(55);
  }
  &__item {
    font-family: 'PingFangSC';
    font-weight: 400;
    font-size: pxTorpx(14);
    color: rgb(16, 16, 16);
    padding-top: pxTorpx(20);
    padding-bottom: pxTorpx(5);
    &::after {
      content: '';
      display: block;
      width: pxTorpx(16);
      height: pxTorpx(3);
      background-color: transparent;
      margin: 0 auto;
      margin-top: pxTorpx(5);
      border-radius: pxTorpx(3);
    }
    &.active {
      color: $theme-light-color;
      &::after {
        background-color: $theme-light-color;
      }
    }
  }
}
.notify__progress {
  &__bar {
    padding: pxTorpx(10) pxTorpx(15);
    background-color: $sub-nav-theme-color;
    margin-top: pxTorpx(5);
  }
  &__item {
    position: relative;
    padding-left: pxTorpx(25);
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      background: url('@/assets/images/timer.png') no-repeat;
      background-size: 100% 100%;
      width: pxTorpx(20);
      height: pxTorpx(20);
      top: -2rpx;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: pxTorpx(10);
      background-color: $theme-light-color;
      background-size: 100% 100%;
      width: pxTorpx(1);
      height: pxTorpx(70);
      top: pxTorpx(30);
    }
    .progress {
      &__text,
      &__title,
      &__price {
        font-family: 'PingFangSC';
        font-weight: 400;
        font-size: pxTorpx(12);
        color: $white;
        display: block;
      }
      &__text {
        margin: pxTorpx(15) 0;
        color: $theme-light-color;
      }
      &__title {
        margin-bottom: pxTorpx(5);
      }
      &__image {
        @include flex(center, '');
        margin-bottom: pxTorpx(20);
        height: pxTorpx(60);
        border-radius: pxTorpx(5);
        background-color: #4040403b;
        overflow: hidden;
        .img {
          width: pxTorpx(60);
          height: pxTorpx(60);
          margin-right: pxTorpx(15);
        }
      }
    }
  }
}
</style>
