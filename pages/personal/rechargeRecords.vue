<template>
  <view class="recharge__records__wrapper">
    <view class="recharge__records__list">
      <view v-for="(item, index) in returnData" :key="index" class="recharge__records__item">
        <view class="left">
          <text class="em">{{ item.money }}元</text>
          <view class="time">充值时间：{{ item.createtime }}</view>
        </view>
        <view class="right">余额：{{ item.after }}元</view>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  data() {
    return {
      params: { page: 1 },
      returnData: []
    }
  },
  onReachBottom() {
    this.params.page++
    this.getData()
  },
  onLoad() {
    this.getData()
  },
  methods: {
    async getData() {
      const { code, data } = await api.getMoneyRecords({ ...this.params, token: this.token })
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
.recharge__records {
  &__list {
    padding: pxTorpx(10);
  }
  &__item {
    border-radius: pxTorpx(5);
    font-size: pxTorpx(14);
    padding: pxTorpx(10);
    background-color: $sub-nav-theme-color;
    margin-bottom: pxTorpx(10);
    @include flex(center, space-between, wrap);
    &::after {
      content: '';
      width: 100%;
      display: block;
      margin: 0 auto;
      height: pxTorpx(1);
      background: #10101014;
      margin-top: pxTorpx(15);
    }
    .left {
      font-family: 'PingFangSC';
      font-weight: 700;
      font-size: pxTorpx(20);
      color: $theme-light-color;
      .time {
        font-weight: 400;
        font-size: pxTorpx(12);
        color: $white;
        margin-top: pxTorpx(5);
      }
    }
    .right {
      font-family: 'PingFangSC';
      font-weight: 400;
      font-size: pxTorpx(14);
      color: rgba(248, 220, 76, 1);
    }
  }
}
</style>
