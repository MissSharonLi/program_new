<template>
  <view class="gold__wrapper">
    <view class="gold__self">
      <image class="img" :src="userInfo.avatar"></image>
      <view class="nickname">{{ userInfo.nickname }}</view>
      <view class="rate">
        <text class="text">
          第
          <text class="em">{{ returnObj.ranking }}</text>
          名
        </text>
        <text class="text">
          冲
          <text class="em">{{ returnObj.total }}</text>
          发
        </text>
      </view>
    </view>
    <view class="gold__list">
      <view v-for="(item, index) in returnData" :key="index" class="gold__item">
        <view class="left">
          <view class="images__content" :class="{ champion: index === 0 }">
            <image class="img" :src="item.avatar"></image>
            <view class="text">{{ item.nickname }}</view>
          </view>
          <view class="ranking__content">
            第
            <text class="em">{{ item.ranking }}</text>
            名
          </view>
        </view>
        <view class="right">
          冲
          <text class="em">{{ item.total }}</text>
          发
        </view>
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
.gold {
  &__wrapper {
    padding: pxTorpx(10);
  }
  &__self {
    height: pxTorpx(119);
    background-color: $sub-nav-theme-color;
    border: 1px solid rgb(248, 220, 76);
    border-radius: pxTorpx(5);
    font-size: pxTorpx(14);
    text-align: center;
    margin-bottom: pxTorpx(10);
    .img {
      width: pxTorpx(50);
      height: pxTorpx(50);
      border-radius: 50%;
      margin-bottom: pxTorpx(3);
      margin-top: pxTorpx(10);
    }
    .nickname {
      font-family: 'PingFangSC';
      font-weight: 400;
      font-size: pxTorpx(14);
      color: $white;
      margin-bottom: pxTorpx(3);
    }
    .rate {
      .text {
        font-family: 'PingFangSC';
        color: $white;
        font-size: pxTorpx(12);
        margin-left: pxTorpx(15);
        font-weight: lighter;
        .em {
          font-size: pxTorpx(14);
          color: rgba(248, 220, 76, 1);
        }
      }
    }
  }
  &__item {
    background-color: $sub-nav-theme-color;
    height: pxTorpx(70);
    border-radius: pxTorpx(5);
    @include flex(center, space-between);
    margin-bottom: pxTorpx(10);
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
            left: 36rpx;
            top: -16rpx;
            transform: rotate(-45deg);
          }
        }
      }
      .img {
        width: pxTorpx(36);
        height: pxTorpx(36);
        border-radius: 50%;
        margin: 0 auto;
        display: block;
        margin-bottom: pxTorpx(5);
        z-index: 9;
        position: relative;
      }
      .text {
        font-family: 'PingFangSC';
        font-weight: 400;
        font-size: pxTorpx(12);
        color: $white;
        min-width: 100px;
        max-width: 100px;
        text-align: center;
      }
      .ranking__content {
        font-family: 'PingFangSC';
        font-weight: 400;
        font-size: pxTorpx(14);
        color: $white;
        margin-left: pxTorpx(30);
        .em {
          font-size: pxTorpx(16);
          color: rgba(248, 220, 76, 1);
        }
      }
    }
    .right {
      font-family: 'PingFangSC';
      font-weight: 400;
      font-size: pxTorpx(14);
      color: $white;
      .em {
        color: $theme-light-color;
      }
    }
  }
}
</style>
