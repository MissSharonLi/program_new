<template>
  <view class="content consumption__content" :style="{ 'margin-top': navHeight + 'px' }">
    <HomeNavBar class="nav__wrapper" :isBack="true" title="消费记录"></HomeNavBar>
    <view class="consumption__tab__content">
      <text
        v-for="(item, index) in tabList"
        :key="index"
        class="tab__item"
        :class="{ active: tabIndex === index }"
        @click="handleTab(index)"
      >
        {{ item.label }}
      </text>
    </view>
    <view class="consumption__main" :style="{ 'min-height': listHeight + 'px' }">
      <view class="consumption__list">
        <view v-for="(item, index) in returnData" :key="index" class="consumption__item">
          <view class="text">操作: {{ item.memo }}</view>
          <view class="text">
            <text class="span">变更前: {{ item.before }}</text>
            <text class="span">变更后: {{ item.after }}</text>
          </view>
          <view class="em">变更时间 - {{ item.createtime }}</view>
          <view class="consumption__images">
            <view
              v-for="(item1, index1) in item.children"
              :key="index1"
              class="consumption__images__item"
            >
              <image class="img" referrerPolicy="no-referrer" :src="item1.item_image"></image>
              <view class="title">{{ item1.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  name: 'ConsumptionHistory',
  data() {
    return {
      tabIndex: 0,
      params: { page: 1 },
      returnData: [],
      tabList: [
        { label: '浪值列表', value: 0 },
        { label: '积分列表', value: 1 }
      ]
    }
  },
  onReachBottom() {
    this.params.page++
    this.getData()
  },
  async onPullDownRefresh() {
    await this.getData(true)
    uni.stopPullDownRefresh()
  },
  onLoad(options) {
    this.tabIndex = Number(options.type)
    this.getData(true)
  },
  computed: {
    listHeight() {
      const _this = this
      uni.getSystemInfo({
        success: function (res) {
          _this.screenHeight = res.windowHeight - _this.navHeight - 100
        }
      })
      return this.screenHeight
    }
  },
  methods: {
    async getData(init) {
      const fieldApai = this.tabIndex === 0 ? 'getMoneylogv2' : 'getScorelog'
      if (init) {
        this.params.page = 1
        this.returnData = []
      } else {
        this.params.page++
      }
      const { code, data } = await api[fieldApai]({ ...this.params, token: this.token })
      if (code === 1 && data) {
        if (data.data.length > 0) {
          this.returnData = this.returnData.concat(data.data)
        } else {
          this.params.page > 1 ? this.$toast('没有更多数据了') : this.$toast('暂无数据')
          this.params.page > 1 ? this.params.page-- : (this.returnData = [])
        }
      }
    },
    // 切换商品Tab
    handleTab(index) {
      this.tabIndex = index
      this.getData(true)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.content {
  min-height: auto;
}
.consumption {
  &__tab__content {
    @include flex(center, space-around);
    font-family: $Yuanti;
    color: $white;
    font-size: pxTorpx(16);
    margin-bottom: pxTorpx(2);
    padding-top: pxTorpx(10);
    .tab__item {
      display: block;
      line-height: 2;
      padding: pxTorpx(1) pxTorpx(15);
      background-color: #29abe2;
      border-radius: pxTorpx(10);
      margin-bottom: -4px;
      border: pxTorpx(4) solid #29abe2;
      &.active {
        color: #fff;
        background-color: #0071bc;
      }
    }
  }
  &__main {
    width: calc(100% - 36px);
    background-color: #f0fcff;
    border-radius: pxTorpx(16);
    margin: 0 auto pxTorpx(20);
    border: pxTorpx(6) solid #29abe2;
  }
  &__list {
    padding: pxTorpx(15);
  }
  &__item {
    margin-bottom: pxTorpx(10);
    font-family: $Yuanti;
    .text {
      @include flex(center, flex-start);
      font-size: pxTorpx(14);
      color: #2d3192;
      font-family: $Yuanti;
      margin-bottom: pxTorpx(8);
      .span {
        &:last-child {
          margin-left: pxTorpx(30);
        }
      }
    }
    .em {
      font-size: pxTorpx(12);
      color: #f15924;
    }
  }
  &__images {
    margin-top: pxTorpx(20);
    @include flex(center, flex-start, wrap);
    &__item {
      width: calc(20% - 30rpx);
      padding: pxTorpx(5);
      background-color: #fff;
      border-bottom-left-radius: pxTorpx(10);
      border-bottom-right-radius: pxTorpx(10);
      margin-bottom: pxTorpx(5);
      &:not(:nth-child(5n)) {
        margin-right: pxTorpx(6);
      }
      .img {
        width: 100%;
        height: pxTorpx(50);
      }
      .title {
        font-size: pxTorpx(12);
        color: #000000;
        max-width: 99%;
        text-overflow: ellipsis;
        overflow: hidden;
        font-family: $Yuanti;
        white-space: nowrap;
      }
    }
  }
}
</style>
