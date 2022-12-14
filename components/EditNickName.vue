<template>
  <VanDialog
    ref="dialogProps"
    :show="show"
    use-slot
    title="修改昵称"
    :show-cancel-button="!isNeedUpdate"
    :asyncClose="true"
    theme="round-button"
    custom-style="border: 2px solid #29abe2;border-radius:20px"
    @close.native="handleClose($event)"
    @confirm.native="handleConfirm($event)"
  >
    <view class="dialog__avator__content">
      <text class="label">
        <text v-if="isNeedUpdate" class="em">*</text>
        头像：
      </text>
      <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="handleUpload">
        <image class="img" referrerPolicy="no-referrer" :src="avatar || fileList[0] || ''"></image>
      </button>
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
import { baseUrl } from '../sdk/config'
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
      value: '',
      avatar: '',
      imgUrl: ''
    }
  },
  computed: {
    isNeedUpdate() {
      return this.userInfo.is_need_update
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
    // 上传图片
    handleUpload(e) {
      const token = this.token
      const transformData = this.commonUtils.jsonSort({ token })
      const tempFilePaths = e.detail.avatarUrl
      wx.uploadFile({
        url: `${baseUrl}/user/upload`,
        filePath: tempFilePaths,
        name: 'file',
        header: {
          'x-token': transformData['x-token'],
          'x-time': transformData['x-time']
        },
        formData: {
          token
        },
        success: (res) => {
          // 上传成功
          const { code, data, msg } = JSON.parse(res.data || '{}')
          if (code === 1 && data) {
            this.avatar = data.fullurl
            this.imgUrl = data.url
          } else {
            this.$toast(msg)
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    },
    // 提交
    async handleConfirm({ detail }) {
      if (this.isNeedUpdate && !this.imgUrl) {
        this.$toast('请先上传头像！')
        detail.dialog.stopLoading()
        return false
      }
      if (!this.value) {
        this.$toast('请输入昵称！')
        detail.dialog.stopLoading()
        return false
      }

      const { code } = await api.handleEditNickName({
        nickname: this.value,
        token: this.token,
        avatar: this.imgUrl
      })
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
  .em {
    color: red;
  }
  .avatar-wrapper {
    margin: 0;
    padding: 0;
    width: pxTorpx(55);
    height: pxTorpx(55);
    border-radius: 50%;
    margin-right: pxTorpx(10);
  }
  .img {
    width: pxTorpx(55);
    height: pxTorpx(55);
    border-radius: 50%;
    margin-right: pxTorpx(10);
  }
}
</style>
