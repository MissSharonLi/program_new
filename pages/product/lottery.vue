<template>
  <view class="lottery__list">
    <view v-for="(item, index) in list" :key="index" class="lottery__item first">
      <view class="left">
        <view class="rank__num">
          <view class="text yellow">{{ item.rank_num }}</view>
          <view class="text yellow">{{ item.nickname }}</view>
        </view>
        <view class="images__content speacial">
          <view class="text">{{ item.pay_time }}</view>
          <view class="text">{{ item.item_name }}</view>
        </view>
      </view>
      <view class="right"></view>
    </view>
    <view v-for="(item, index) in returnData" :key="index" class="lottery__item second">
      <view class="left">
        <view class="rank__num">
          <view class="text">{{ item.rank_num }}</view>
          <view class="text">{{ item.nickname }}</view>
        </view>
        <view class="images__content">
          <view class="text">{{ item.pay_time }}</view>
          <view class="text">{{ item.item_name }}</view>
        </view>
      </view>
      <view class="right"></view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  name: 'Lottery',
  data() {
    return {
      list: [],
      params: { id: '', page: 1 },
      returnData: []
    }
  },
  onLoad(options) {
    this.params.id = options.id
    this.getData()
    this.query()
  },
  onReachBottom() {
    this.params.page++
    this.getData()
  },
  methods: {
    async query(id) {
      this.params.id = id
      const { code, data } = await api.getBuyOrderwinlog({ ...this.params, token: this.token })
      if (code === 1) {
        this.list = data || data
      }
    },
    async getData(init) {
      if (init) {
        this.params.page = 1
        this.returnData = []
      } else {
        this.params.page++
      }
      const { code, data } = await api.getBuyorderLogList({ ...this.params, token: this.token })
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
.lottery {
  &__list {
    padding: pxTorpx(10) pxTorpx(10) 0;
  }
  &__item {
    height: pxTorpx(70);
    border-radius: pxTorpx(5);
    @include flex(bottom, space-between);
    padding: pxTorpx(10) pxTorpx(12);
    &.first {
      .right {
        background: url('@/assets/images/reward1.png') no-repeat center;
        background-size: 100% 100%;
        width: pxTorpx(60);
        height: pxTorpx(20);
      }
    }
    &.second {
      .rank__num {
        .text {
          &:nth-child(2) {
            color: $white;
          }
        }
      }
      .right {
        width: pxTorpx(20);
        height: pxTorpx(25);
        background: url('@/assets/images/A.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
    .left {
      margin-right: pxTorpx(5);
      .rank__num {
        @include flex(bottom, '');
        font-family: $Yuanti;
        text-align: center;
        margin-right: pxTorpx(30);
        .text {
          &:first-child {
            color: $white;
            font-size: pxTorpx(18);
          }
        }
        .yellow {
          color: #f15a24;
        }
      }
      .images__content {
        @include flex(bottom, '');
        .text {
          &:first-child {
            color: $white;
            font-size: pxTorpx(12);
          }
          &:nth-child(2) {
            color: #ff0000;
          }
        }
      }
      .text {
        font-family: $Yuanti;
        font-size: pxTorpx(14);
        text-align: left;
        margin-bottom: pxTorpx(10);
        &:nth-child(1) {
          min-width: 50px;
          max-width: 50px;
        }
        &:nth-child(2) {
          font-size: pxTorpx(15);
          min-width: 180px;
          max-width: 180px;
        }
      }
      .speacial {
        .text {
          &:first-child {
            color: $white;
          }
          &:nth-child(2) {
            color: #f15a24 !important;
          }
        }
      }
    }
  }
}
</style>
