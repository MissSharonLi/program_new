<template>
  <view class="collection__wrapper">
    <SubTabs :dataSource="tabList" @tabClick="handleTab"></SubTabs>
    <view class="collection__list">
      <view v-for="(item, index) in returnData" :key="index" class="collection__item">
        <text class="collection__time">{{ item.createtime }}</text>
        <view class="collection__images">
          <image
            class="img"
            :class="{ sold__out: item.stock_num === 0 }"
            :src="item.goods_image"
          ></image>
          <view>
            <text class="title">{{ item.goods_name }}</text>
            <text class="price">￥{{ item.goods_price }}/张</text>
          </view>
        </view>
        <view class="collection__footer">
          <text class="footer__text">
            剩余
            <text class="speacial">{{ item.stock_num }}</text>
            /{{ item.goods_num }}张
          </text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
import SubTabs from '@/components/SubTabs'
export default {
  components: {
    SubTabs
  },
  data() {
    return {
      params: { page: 1, type: 0 },
      tabList: [
        { label: '全部', value: 0 },
        { label: '在售', value: 1 },
        { label: '售罄', value: 2 }
      ],
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
    handleTab(index) {
      this.returnData = []
      this.params.page = 1
      this.params.type = index
      this.getData()
    },
    async getData() {
      const { code, data } = await api.getCollectionList({ ...this.params, token: this.token })
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
.collection {
  &__list {
    padding: pxTorpx(10);
    padding-top: pxTorpx(65);
  }
  &__item {
    background-color: $sub-nav-theme-color;
    padding: pxTorpx(10);
    border-radius: pxTorpx(5);
    margin-bottom: pxTorpx(10);
  }
  &__time {
    font-family: 'PingFangSC';
    font-weight: 400;
    font-size: pxTorpx(13);
    color: $white;
    margin-bottom: pxTorpx(10);
    margin-top: pxTorpx(5);
    display: block;
  }
  &__images {
    @include flex(center, '');
    padding: pxTorpx(10);
    border-top: 1px solid #10101014;
    border-bottom: 1px solid #10101014;
    .img {
      width: pxTorpx(80);
      height: pxTorpx(80);
      position: relative;
      margin-right: pxTorpx(20);
      position: relative;
      &.sold__out {
        border-radius: pxTorpx(5);
        &::after {
          content: '售罄';
          display: block;
          width: pxTorpx(40);
          height: pxTorpx(20);
          background-color: $sub-nav-theme-color;
          border-radius: pxTorpx(10);
          text-align: center;
          position: absolute;
          top: pxTorpx(30);
          left: pxTorpx(20);
          color: $theme-light-color;
          font-size: pxTorpx(12);
          line-height: pxTorpx(20);
        }
        &::before {
          content: '';
          position: absolute;
          width: pxTorpx(80);
          height: pxTorpx(80);
          display: block;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
    }
    .title {
      font-family: 'PingFangSC';
      font-weight: 700;
      font-size: pxTorpx(14);
      color: $white;
      margin-bottom: pxTorpx(20);
      display: block;
    }
    .price {
      font-family: $SFUIText;
      font-weight: 400;
      font-size: pxTorpx(12);
      color: $white;
      display: block;
    }
  }
  &__footer {
    font-size: pxTorpx(12);
    text-align: right;
    padding-top: pxTorpx(10);
    color: $white;
    .footer__text {
      &:last-child {
        margin-left: pxTorpx(30);
      }
      .speacial {
        color: $theme-light-color;
      }
    }
  }
}
</style>
