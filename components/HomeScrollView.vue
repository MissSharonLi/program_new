<template>
  <div>
    <CustomTabs
      ref="tabsProps"
      :dataSource="dataSource"
      @shift="handleOperation($event, 1)"
    ></CustomTabs>
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
            <ProductList :dataSource="productDataSource"></ProductList>
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
      return Math.ceil((this.productDataSource.length || 1) / 2) * 260 + 'px'
    },
    contentText() {
      return this.loadStatus === 0 ? '上拉加载更多数据' : this.loadStatus === 1 ? '加载中...' : ''
    }
  },
  async created() {
    await this.network().runApiToGetProductCat()
    this.network().runApiToGetProductList()
  },
  methods: {
    handleOperation(e, type) {
      switch (type) {
        case 1: // 切换tab&Swiper
          this.current = e
          break
        case 2: // 切换swiper
          this.loadStatus = 1
          this.params.page = 1
          this.productDataSource = []
          this.$refs.tabsProps.handleShift(e.target.current)
          this.params.cat_id = this.dataSource[e.target.current].id
          this.network().runApiToGetProductList()
          break
        default: // 分页查询商品
          this.params.page++
          this.network().runApiToGetProductList()
      }
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
.swiper {
  position: relative;
  .scroll-item {
    overflow-y: scroll;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }
}
.loader__more__content {
  display: block;
  text-align: center;
  padding: 20px 0;
}
</style>
