<template>
  <div class="editor-page">
    <div v-if="isEdit" class="page-header">编辑患教文章</div>
    <div v-else class="page-header">添加患教文章</div>
    <div class="editor-container">
      <CustomEditor ref="customEditor" v-model="content" />
      <div class="footer">
        <el-button type="danger" plain @click="clearContent">清空当前内容</el-button>
        <el-button type="primary" plain @click="handlePreview">效果预览</el-button>
        <el-button v-if="isEdit" type="primary" @click="handleModify">修改</el-button>
        <el-button v-else type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>

    <!-- 富文本预览 Modal -->
    <el-dialog title="效果预览" :visible.sync="previewVisible" width="500px" custom-class="editor-preview-dialog">
      <div style="text-align: center;transform: scale(0.75) translateY(-150px);margin: auto;">
        <div style="position: relative;height: 849px;">
          <img :src="phoneImg" style="width: 421px;height: 849px">
          <div style="position: absolute;top: 14px;left: 43px;">
            <iframe :srcdoc="iframedoc" width="375" height="821" :frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomEditor from '@/components/CustomEditor'

export default {
  components: {
    CustomEditor,
  },
  data() {
    return {
      content: '<h1>hello world</h1>',
      resizeHandler: null,
      previewVisible: false,
      phoneImg: 'https://image.studio.dajiazhongyi.com/owl/203/e02dd28d5358656d55276baab1fa427841dcc19c.png',
      articleId: '',
    }
  },
  computed: {
    iframedoc() {
      return `
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title></title>
            <style>
            html {
              -ms-overflow-style: none;
              overflow: -moz-scrollbars-none;
            }
              html::-webkit-scrollbar {
                width: 0;
              }
              img {
                vertical-align: middle;
              }
              p {
                margin: 0;
              }
            </style>
          </head>
          <body style="margin: 0;"> ${this.content} </body>
        </html>
      `
    },
    isEdit() {
      return this.articleId
    }
  },
  created() {
    // this.articleId = this.$route.params.id
  },
  mounted() {
    // 绑定 resize 事件监听
    this.resizeHandler = this.handleResize.bind(this)
    window.addEventListener('resize', this.resizeHandler)
    // 初始化编辑器高度
    this.$nextTick(() => {
      setTimeout(() => {
        this.updateEditorHeight()
      }, 500)
    })
  },
  beforeDestroy() {
    // 移除 resize 事件监听，防止内存泄漏
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null
    }
  },
  methods: {
    clearContent() {
      this.content = ''
    },
    handlePreview() {
      this.previewVisible = true
    },
    handleModify() {
      console.log(this.content)
    },
    handleSave() {
      console.log(this.content)
    },
    handleResize() {
      // 触发修改 editor 高度的事件
      this.updateEditorHeight()
    },
    updateEditorHeight() {
      // 通过 $refs 获取 CustomEditor 组件实例并调用其 resizeEditor 方法
      if (this.$refs.customEditor) {
        // const editorWidth = this.$refs.customEditor.$el.offsetWidth
        const pageHeight = document.documentElement.clientHeight
        const editorHeight = pageHeight - 220 // 减去容器边距和工具栏高度
        this.$refs.customEditor.resizeEditor(null, editorHeight)
      }
    }
  },
}
</script>

<style scoped>
.editor-page {
  padding-bottom: 20px;
}

.page-header {
  max-width: 1280px;
  padding: 15px 32px;
  margin: 0 auto;
  font-size: 18px;
  font-weight: bold;
}

.editor-container {
  max-width: 1280px;
  padding: 0 32px 32px;
  margin: 0 auto;
}

.footer {
  margin-top: 20px;
  text-align: right;
}
</style>

<style>
.editor-preview-dialog .el-dialog__body {
  height: 700px;
}
</style>
