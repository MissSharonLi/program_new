<template>
  <view class="product__search__wrapper">
    <view class="search__input__content">
      <input
        v-model="keyword"
        class="search__input"
        type="text"
        placeholder-style="color:#fff"
        placeholder="搜索商品"
        @confirm="handleOperation(null, keyword)"
      />
      <text class="search__text">取消</text>
    </view>
    <view class="search__panel__content">
      <view class="search__panel__wrapper">
        <view class="search__panel__item">
          <text class="search__panel__title">历史记录</text>
          <image
            v-if="mySearchList.length > 0"
            class="search__panel__icon"
            :src="require('@/assets/images/delete.png')"
            @click="handleOperation(0)"
          ></image>
        </view>
        <view class="search__panel__list">
          <text
            v-for="(item, index) in mySearchList"
            :key="index"
            class="button"
            @click="handleOperation(null, item)"
          >
            {{ item }}
          </text>
        </view>
      </view>
      <view class="search__panel__wrapper">
        <view class="search__panel__item">
          <text class="search__panel__title">大家都在搜</text>
        </view>
        <view class="search__panel__list">
          <text
            v-for="(item, index) in searchList"
            :key="index"
            class="button"
            @click="handleOperation(null, item)"
          >
            {{ item }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
export default {
  name: 'Search',
  data() {
    return {
      keyword: '',
      searchList: [],
      mySearchList: []
    }
  },
  onLoad() {
    this.query()
  },
  methods: {
    // 查询历史数据
    async query() {
      const { code, data } = await api.getSearchKeywords({ token: this.token })
      if (code === 1) {
        this.searchList = data.search_list || []
        this.mySearchList = data.my_search_list || []
      }
    },
    handleOperation(type, keyword) {
      switch (type) {
        case 0:
          this.mySearchList.splice(0, this.mySearchList.length - 1)
          break
        default:
          uni.navigateTo({ url: '/pages/product/index?keyword=' + keyword })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.product__search__wrapper {
  min-height: 100vh;
  padding: pxTorpx(5) pxTorpx(15);
  .search__placeholder {
    color: $white;
  }
  .search__input {
    &__content {
      @include flex(center);
      margin-bottom: pxTorpx(5);
      .search__text {
        text-align: right;
        font-family: 'PingFangSC';
        font-weight: 700;
        font-size: pxTorpx(14);
        color: $white;
        width: 100rpx;
      }
    }
    background-color: $sub-nav-theme-color;
    border-radius: pxTorpx(15);
    font-size: pxTorpx(14);
    height: pxTorpx(40);
    line-height: pxTorpx(40);
    position: relative;
    width: calc(100% - 140rpx);
    padding-left: pxTorpx(50);
    color: $white;
    &::before {
      content: '';
      display: block;
      width: pxTorpx(27);
      height: pxTorpx(27);
      background: url('@/assets/images/search.png') no-repeat;
      background-size: 100% 100%;
      line-height: pxTorpx(40);
      position: absolute;
      left: pxTorpx(15);
      top: pxTorpx(7);
    }
  }
  .search__panel {
    &__item {
      @include flex(center, space-between);
      margin: pxTorpx(20) 0;
    }
    &__title {
      text-align: right;
      font-family: 'PingFangSC';
      font-weight: 700;
      font-size: pxTorpx(14);
      color: $white;
    }
    &__icon {
      width: pxTorpx(18);
      height: pxTorpx(18);
    }
    &__list {
      @include flex(center, '', wrap);
      .button {
        height: pxTorpx(28);
        line-height: pxTorpx(28);
        background-color: $sub-nav-theme-color;
        border-radius: pxTorpx(26);
        font-size: pxTorpx(14);
        color: $white;
        padding: 0 pxTorpx(15);
        margin-right: pxTorpx(15);
        margin-bottom: pxTorpx(15);
      }
    }
  }
}
</style>
