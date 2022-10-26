<template>
  <view class="content gold__wrapper" :style="{ 'margin-top': navHeight + 'px' }">
    <HomeNavBar class="nav__wrapper" :isBack="true" title="排行榜"></HomeNavBar>
    <view class="gold__self">
      <view class="ranking">第 {{ returnObj.ranking }} 名</view>
      <view class="userinfo__content">
        <image class="img" referrerPolicy="no-referrer" :src="userInfo.avatar"></image>
        <view class="info__content">
          <view class="custom__id">客户ID：{{ userInfo.uuid || '' }}</view>
          <view class="nickname">客户昵称：{{ userInfo.nickname || '' }}</view>
        </view>
      </view>
    </view>
    <view class="gold__list" :style="{ 'min-height': listHeight + 'px' }">
      <view v-for="(item, index) in returnData" :key="index" class="gold__item">
        <view class="left">
          <view class="images__content" :class="{ champion: index === 0 }">
            <image class="img" referrerPolicy="no-referrer" :src="item.avatar"></image>
            <view class="text">{{ item.nickname }}</view>
          </view>
          <view class="ranking__content">第 {{ item.ranking }} 名</view>
        </view>
        <view class="right">冲浪：{{ item.total }}</view>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  data() {
    return {
      params: {
        page: 1
      },
      returnObj: {},
      returnData: []
    }
  },
  onLoad() {
    this.getData()
  },
  onReachBottom() {
    this.params.page++
    this.getData()
  },
  computed: {
    listHeight() {
      const _this = this
      uni.getSystemInfo({
        success: function (res) {
          _this.screenHeight = res.windowHeight - _this.navHeight - 140
        }
      })
      return this.screenHeight
    }
  },
  methods: {
    async getData() {
      const { code, data } = await api.getBuyRankingList({ ...this.params, token: this.token })
      if (code === 1 && data) {
        const { my, list } = data
        this.returnObj = my
        if (list.data.length > 0) {
          this.returnData = this.returnData.concat(list.data)
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
.content {
  min-height: auto;
}
.gold {
  &__wrapper {
    padding: pxTorpx(10);
  }
  &__self {
    height: pxTorpx(80);
    background-color: #29abe2;
    border: 2px solid #366ba3;
    border-radius: pxTorpx(5);
    font-size: pxTorpx(14);
    text-align: center;
    margin-bottom: pxTorpx(10);
    @include flex(center, space-between);
    .ranking {
      color: #fab03a;
      font-family: $Yuanti;
      font-size: pxTorpx(18);
      text-indent: pxTorpx(20);
    }
    .userinfo__content {
      @include flex(center, space-between);
      .img {
        width: pxTorpx(60);
        height: pxTorpx(60);
        border-radius: 50%;
        margin-right: pxTorpx(10);
      }
      .custom__id,
      .nickname {
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(15);
        color: #000;
        text-align: left;
        margin-right: pxTorpx(10);
      }
      .custom__id {
        margin-bottom: pxTorpx(3);
      }
    }
  }
  &__list {
    border: pxTorpx(6) solid #29abe2;
    background-color: #fff;
    border-radius: pxTorpx(16);
  }
  &__item {
    height: pxTorpx(70);
    border-radius: pxTorpx(5);
    @include flex(center, space-between);
    padding: pxTorpx(12);
    .left {
      @include flex(center, '');
      .images__content {
        &.champion {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            display: block;
            width: pxTorpx(20);
            height: pxTorpx(20);
            background: url('@/assets/images/crown.png') no-repeat;
            background-size: 100% 100%;
            left: 55rpx;
            top: -16rpx;
            transform: rotate(-45deg);
          }
        }
      }
      .img {
        width: pxTorpx(44);
        height: pxTorpx(44);
        border-radius: 50%;
        margin: 0 auto;
        display: block;
        margin-bottom: pxTorpx(5);
        z-index: 9;
        position: relative;
      }
      .text {
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(12);
        color: #000;
        min-width: 100px;
        max-width: 100px;
        text-align: center;
      }
      .ranking__content {
        font-family: $Yuanti;
        font-weight: 400;
        font-size: pxTorpx(16);
        color: #f15924;
        margin-left: pxTorpx(30);
      }
    }
    .right {
      font-family: $Yuanti;
      font-weight: 400;
      font-size: pxTorpx(16);
      color: #000;
    }
  }
}
</style>
