<template>
  <div>
    <CustomTabs
      ref="tabsProps"
      :dataSource="dataSource"
      @shift="handleOperation($event, 1)"
    ></CustomTabs>
    <view class="home__main__search__content">
      <view class="home__main__search">
        <image class="search__icon" :src="require('@/assets/images/search-grey.png')"></image>
        <input
          class="search__input"
          type="text"
          :disabled="true"
          placeholder="搜索商品"
          @click="handleToSearch"
        />
      </view>
    </view>
    <Swiper
      class="swiper"
      :style="{ height: swiperHeight }"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :current="current"
      @change="handleOperation($event, 2)"
    >
      <Block v-for="(item, index) in dataSource" :key="index">
        <SwiperItem class="scroll-item">
          <view class="swiper-item" :style="{ height: swiperHeight }">
            <ProductList :dataSource="productDataSource" :isEmpty="isEmpty"></ProductList>
          </view>
        </SwiperItem>
      </Block>
    </Swiper>
    <view v-if="productDataSource.length > 0" class="loader__more__content">
      <VanLoading size="18px" color="#fff" :type="loadStatus === 1 && 'spinner'">
        {{ contentText }}
      </VanLoading>
    </view>
  </div>
</template>
<script>
import { api } from '@/api'
import CustomTabs from '@/components/CustomTabs'
import ProductList from '@/components/ProductList'
import VanLoading from '@/wxcomponents/vant/loading/index'
export default {
  components: {
    CustomTabs,
    ProductList,
    VanLoading
  },
  data() {
    return {
      loadStatus: 0, // 0=>加载更多 1=>加载中...
      dataSource: [],
      isEmpty: false,
      productDataSource: [],
      indicatorDots: false,
      current: 0,
      autoplay: false,
      interval: 1000,
      duration: 500,
      params: {
        cat_id: '',
        page: 1
      }
    }
  },
  computed: {
    swiperHeight() {
      return Math.ceil((this.productDataSource.length || 1) / 2) * 280 + 'px'
    },
    contentText() {
      return this.loadStatus === 0 ? '上拉加载更多数据' : this.loadStatus === 1 ? '加载中...' : ''
    }
  },
  async created() {
    this.network().runApiToGetProductCat()
  },
  methods: {
    async handleOperation(e, type) {
      switch (type) {
        case 1: // 切换tab&Swiper
          this.current = e
          this.isEmpty = false
          break
        case 2: // 切换swiper
          this.loadStatus = 1
          this.params.page = 1
          this.isEmpty = false
          this.productDataSource = []
          this.$refs.tabsProps.handleShift(e.target.current)
          this.params.cat_id = this.dataSource[e.target.current].id
          await this.network().runApiToGetProductList()
          this.isEmpty = this.productDataSource.length === 0
          break
        default: // 分页查询商品
          this.params.page++
          this.network().runApiToGetProductList()
      }
    },
    handleToSearch() {
      uni.navigateTo({ url: '/pages/product/search' })
    },
    network() {
      return {
        // 获取产品分类
        runApiToGetProductCat: async () => {
          const { code, data } = await api.getProductCat()
          if (code === 1 && data?.length) {
            this.dataSource = data
            this.params.cat_id = this.dataSource[0].id
          }
        },
        // 获取产品列表
        runApiToGetProductList: async () => {
          const { code, data } = await api.getProductList(this.params)
          if (code === 1) {
            if (data.data.length > 0) {
              this.loadStatus = data.data.length === 10 ? 0 : null // 返回10条=>上拉加载更多
              this.productDataSource = this.productDataSource.concat(data.data)
            } else {
              this.params.page > 1 ? this.$toast('没有更多数据了') : this.$toast('暂无数据')
              this.params.page > 1 ? this.params.page-- : (this.productDataSource = [])
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.swiper {
  position: relative;
  .scroll-item {
    overflow-y: scroll;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }
}
.home__main {
  &__search {
    &__content {
      background-color: $white;
      padding: pxTorpx(5) pxTorpx(10);
      line-height: pxTorpx(34);
      margin: 0 pxTorpx(15);
      background: linear-gradient(to right, #045eb5, 20%, #bed5ec, 80%, #fff);
    }
    height: pxTorpx(34);
    background-color: $white;
    border: 4px solid #000;
    border-radius: 30px;
    line-height: pxTorpx(34);
    @include flex(center, space-between);
    .search__icon {
      width: pxTorpx(21);
      height: pxTorpx(21);
      padding-left: pxTorpx(10);
    }
    .search__input {
      height: pxTorpx(21);
      width: calc(100% - 74rpx);
      line-height: pxTorpx(21);
      color: #888;
      font-size: pxTorpx(13);
    }
  }
}
.loader__more__content {
  display: block;
  text-align: center;
  padding: 20px 0;
}
</style>
