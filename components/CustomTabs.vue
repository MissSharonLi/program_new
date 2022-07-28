<template>
  <view class="list__tab__overflow">
    <view class="list__tab__wrapper">
      <view class="list__tab__content">
        <text
          v-for="(item, index) in dataSource"
          :key="index"
          class="tab__item"
          :class="{ active: tabIndex === index }"
          @click="handleTab(item, index)"
        >
          {{ item.title }}
        </text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tabIndex: 0
    }
  },
  methods: {
    handleTab(item, index) {
      this.tabIndex = index
      this.$emit('shift', index)
    },
    handleShift(index) {
      this.tabIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/index.scss';
.list__tab__overflow {
  max-height: pxTorpx(40);
  overflow: hidden;
}
.list__tab__wrapper {
  max-width: 98%;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: scroll;
  margin: 0 auto;
  -webkit-overflow-scrolling: touch;
}
.list__tab__content {
  line-height: pxTorpx(50);
  font-family: $Yuanti;
  font-weight: 400;
  font-size: pxTorpx(16);
  color: #f6c25f;
  font-style: normal;
  letter-spacing: 1px;
  white-space: nowrap;
  .tab__item {
    min-width: 25%;
    text-align: center;
    display: inline-block;
  }
  .active {
    color: $theme-active-color;
    font-size: pxTorpx(18);
    font-family: $Yuanti;
  }
}
</style>
