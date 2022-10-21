<template>
  <view class="content product__content" :style="{ 'margin-top': navHeight + 'px' }">
    <HomeNavBar :isBack="true" class="nav__wrapper" title="商品搜索"></HomeNavBar>
    <view class="product__search__list" :style="{ 'min-height': sightHeight + 'px' }">
      <view class="search__input__wrapper">
        <view class="search__input__content">
          <input
            v-model="params.keyword"
            class="search__input"
            placeholder-style="color:#888"
            type="text"
            placeholder="海贼王"
            @confirm="handleOperation(0)"
          />
        </view>
      </view>
      <ProductList :dataSource="returnData"></ProductList>
      <view v-if="returnData.length > 0" class="loader__more__content">
        <VanLoading size="18px" color="#999" :type="loadStatus === 1 && 'spinner'">
          {{ contentText }}
        </VanLoading>
      </view>
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
      returnData: [],
      tableData: {
        code: 1,
        msg: '获取成功',
        time: '1666158721',
        data: {
          total: 8,
          per_page: 10,
          current_page: 1,
          last_page: 1,
          data: [
            {
              id: 1055,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            },
            {
              id: 1053,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            },
            {
              id: 1052,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            },
            {
              id: 1051,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            },
            {
              id: 1050,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            },
            {
              id: 1049,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            },
            {
              id: 1048,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            },
            {
              id: 1047,
              goods_name: '苹果MAX  - 大擂台',
              goods_image:
                'https://www.langmanwu2021.cn/uploads/20220924/1a10df2a5d9206a8e38c8ece670a693c.jpeg',
              goods_price: '390.00',
              goods_num: 5,
              stock_num: 0,
              is_score: 0,
              give_score: '39.00',
              tag_title: 'A赏',
              sub_title: '明星信片'
            }
          ]
        }
      }
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
.content {
  min-height: auto;
}
.product__content {
  .product__search__list {
    background-color: #f0fcff;
  }
  .search__input {
    width: calc(100% - 100rpx);
    padding-left: 30rpx;
    &__wrapper {
      padding: pxTorpx(5) pxTorpx(15);
    }
    &__content {
      background-color: $white;
      border: 3px solid #000;
      border-radius: pxTorpx(25);
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
        background: url('@/assets/images/search-grey.png') no-repeat;
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
