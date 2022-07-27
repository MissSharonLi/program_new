<template>
  <view class="product__content">
    <view class="search__input__wrapper">
      <view class="search__input__content">
        <input
          v-model="params.keyword"
          class="search__input"
          placeholder-style="color:#fff"
          type="text"
          placeholder="海贼王"
          @confirm="handleOperation(0)"
        />
      </view>
    </view>
    <ProductList :dataSource="returnData"></ProductList>
    <view v-if="returnData.length > 0" class="loader__more__content">
      <VanLoading size="18px" color="#fff" :type="loadStatus === 1 && 'spinner'">
        {{ contentText }}
      </VanLoading>
    </view>
  </view>
</template>
<script>
import { api } from '@/api'
import ProductList from '@/components/ProductList'
import VanLoading from '@/wxcomponents/vant/loading/index'
export default {
  components: {
    ProductList,
    VanLoading
  },
  data() {
    return {
      loadStatus: 0, // 0=>加载更多 1=>加载中...
      params: {
        page: 1,
        keyword: ''
      },
      returnData: []
    }
  },
  computed: {
    contentText() {
      return this.loadStatus === 0 ? '上拉加载更多数据' : this.loadStatus === 1 ? '加载中...' : ''
    }
  },
  onReachBottom() {
    this.handleOperation()
  },
  onLoad(options) {
    this.params.keyword = options.keyword
    this.getData()
  },
  methods: {
    handleOperation(type) {
      switch (type) {
        case 0:
          this.params.page = 1
          this.returnData = []
          this.getData()
          break
        default:
          this.params.page++
          this.getData()
      }
    },
    async getData() {
      const { code, data } = await api.getProductList(this.params)
      if (code === 1) {
        if (data.data.length > 0) {
          this.loadStatus = data.data.length === 10 ? 0 : null // 返回10条=>上拉加载更多
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
.product__content {
  min-height: 100vh;
  .search__input {
    width: calc(100% - 100rpx);
    padding-left: 30rpx;
    &__wrapper {
      padding: pxTorpx(5) pxTorpx(15);
    }
    &__content {
      background-color: $sub-nav-theme-color;
      border-radius: pxTorpx(15);
      font-size: pxTorpx(14);
      height: pxTorpx(40);
      line-height: pxTorpx(40);
      @include flex(center);
      position: relative;
      margin-bottom: pxTorpx(5);
      &::after {
        content: '';
        display: block;
        width: pxTorpx(27);
        height: pxTorpx(27);
        background: url('@/assets/images/search.png') no-repeat;
        background-size: 100% 100%;
        margin-right: pxTorpx(15);
      }
    }
  }
  .loader__more__content {
    display: block;
    text-align: center;
    padding: 20px 0;
  }
}
</style>
