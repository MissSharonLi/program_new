<template>
  <view>
    <view class="lottery__list">
      <view v-for="(item, index) in list" :key="index" class="lottery__item first">
        <view class="left">
          <view class="rank__num">
            <text class="em" :class="{ yellow: item.is_ticket === 0 }">{{ item.rank_num }}</text>
          </view>
          <view class="images__content" :class="{ speacial: item.is_ticket === 0 }">
            <view class="text">{{ item.nickname }}</view>
            <view class="text">{{ item.item_name }}</view>
          </view>
        </view>
        <view class="right"></view>
      </view>
      <view v-for="(item, index) in returnData" :key="index" class="lottery__item second">
        <view class="left">
          <view class="rank__num">
            <text class="em">{{ item.rank_num }}</text>
          </view>
          <view class="images__content">
            <view class="text">{{ item.nickname }}</view>
            <view class="text">{{ item.item_name }}</view>
          </view>
        </view>
        <view class="right"></view>
      </view>
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
    async query() {
      const { code, data } = await api.getBuyOrderwinlog({ ...this.params, token: this.token })
      if (code === 1) {
        this.list = data || data
      }
    },
    async getData() {
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
    padding: pxTorpx(10);
  }
  &__item {
    &.first {
      background: url('@/assets/images/bg2.png') no-repeat center;
      background-size: 100% 100%;
      .right {
        background: url('@/assets/images/all.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
    &.second {
      background: url('@/assets/images/bg1.png') no-repeat center;
      background-size: 100% 100%;
      .right {
        background: url('@/assets/images/A.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
    height: pxTorpx(70);
    border-radius: pxTorpx(5);
    @include flex(center, space-between);
    margin-bottom: pxTorpx(10);
    padding: pxTorpx(12);
    .left {
      @include flex(center, '');
      margin-right: pxTorpx(5);
      .rank__num {
        font-family: 'PingFangSC';
        font-weight: 700;
        font-size: pxTorpx(14);
        color: #1b1464;
        text-align: center;
        margin-right: pxTorpx(30);
        .em {
          color: #1b1464;
          margin-bottom: pxTorpx(10);
          display: block;
          &.yellow {
            color: #1b1464;
          }
        }
        .time {
          color: #1b1464;
          display: block;
          font-weight: 400;
          font-size: pxTorpx(12);
        }
      }
      .text {
        font-family: 'PingFangSC';
        font-weight: 700;
        font-size: pxTorpx(14);
        color: #1b1464;
        min-width: 100px;
        max-width: 100px;
        text-align: left;
        &:first-child {
          margin-bottom: pxTorpx(10);
        }
      }
      .speacial {
        .text {
          color: #1b1464;
        }
      }
    }
    .right {
      width: pxTorpx(60);
      height: pxTorpx(30);
    }
  }
}
</style>
