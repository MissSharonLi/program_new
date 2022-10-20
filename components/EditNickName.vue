<template>
  <VanDialog
    ref="dialogProps"
    :show="show"
    use-slot
    title="修改昵称"
    show-cancel-button
    :asyncClose="true"
    theme="round-button"
    custom-style="border: 2px solid #29abe2;border-radius:20px"
    @close.native="handleClose($event)"
    @confirm.native="handleConfirm($event)"
  >
    <view class="dialog__avator__content">
      <text class="label">头像：</text>
      <image class="img" :src="fileList[0] || ''" @click="$parent.handlePreview()"></image>
    </view>
    <VanCellGroup>
      <VanField
        :value="value"
        label="昵称："
        required
        placeholder="请输入昵称"
        clearable
        left-icon="smile-o"
        custom-style="margin-top:20px;color: #2d3192;font-family: $Yuanti;"
        @change.native="handleChange($event)"
      ></VanField>
    </VanCellGroup>
  </VanDialog>
</template>
<script>
import { api } from '@/api'
import VanField from '@/wxcomponents/vant/field/index'
import VanDialog from '@/wxcomponents/vant/dialog/index'
import VanCellGroup from '@/wxcomponents/vant/cell-group/index'

export default {
  name: 'EditNickName',
  components: {
    VanField,
    VanDialog,
    VanCellGroup
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false,
      value: ''
    }
  },
  methods: {
    // 异步关闭弹框
    handleClose(event) {
      const action = event.mp.detail
      return new Promise((resolve) => {
        setTimeout(() => {
          if (action === 'confirm') {
            // 代码逻辑
            resolve(false) // 阻止弹窗
          } else {
            this.show = false // 关闭弹窗
          }
        }, 13)
      })
    },
    // 提交
    async handleConfirm({ detail }) {
      if (!this.value) {
        this.$toast('请输入昵称！')
        detail.dialog.stopLoading()
        return false
      }
      const { code } = await api.handleEditNickName({ nickname: this.value, token: this.token })
      detail.dialog.stopLoading()
      if (code === 1) {
        this.$toast('修改成功！')
        this.$emit('success')
        this.show = false
      }
    },
    // 双向绑定
    handleChange(e) {
      this.value = e.mp.detail
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/css/index.scss';
@import '@/wxcomponents/vant/dialog/index.wxss';
.dialog__avator__content {
  @include flex(center, flex-start);
  .label {
    display: block;
    margin-right: pxTorpx(5);
    padding-left: pxTorpx(15);
    color: #2d3192;
    font-size: pxTorpx(16);
  }
  .img {
    width: pxTorpx(55);
    height: pxTorpx(55);
    border-radius: 50%;
    margin-right: pxTorpx(10);
  }
}
</style>
