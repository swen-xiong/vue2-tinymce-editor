<template>
  <div class="tinymce-editor">
    <Editor ref="editor" v-model="content" :init="mergedConfig" />
  </div>
</template>

<script>
// import { fileUploaderHandler, imagesUploadHandler } from './utils/FileUploader'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/models/dom'
import 'tinymce/plugins/advlist'
import 'tinymce/icons/default'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/wordcount'
// 快捷工具栏
import 'tinymce/plugins/quickbars'
import './plugins/indent2em'
import './plugins/indent2ends'
import './plugins/letterspacing'
import './plugins/imagetools'
import './plugins/imagefullwidth'

// 预设配置
const DEFAULT_CONFIG = {
  license_key: 'gpl',

  // 去除促销功能，为 true 时右上角会有 `⚡️Upgrade` 按钮
  // ref: https://www.tiny.cloud/docs/tinymce/latest/editor-premium-upgrade-promotion/
  promotion: false,
  // 去除右下角 `品牌推广`
  branding: false,

  height: 1000,
  // 隐藏 menubar
  menubar: false,
  // 不允许调整高度
  // resize: false,

  language_url: '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  skin_url: '/tinymce/skins/ui/oxide', // 需要正确设置皮肤路径
  content_style: 'body { font-family: Microsoft YaHei, sans-serif; font-size: 14px; }',
  content_css: [
    // 系统提供的样式，从 node_modules/tinymce/skins... 下复制而来
    // 复制时在 public 目录下新建目录，避免此处引 node_modules
    // 原因是由于需要自定义 content_css，所以需要在此处将默认样式引入
    '/tinymce/skins/content/default/content.min.css',

    '/tinymce/css/content.css', // 自定义样式
  ],

  plugins: 'advlist link lists image media wordcount quickbars indent2em indent2ends letterspacing imagetools imagefullwidth',
  font_size_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  font_family_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
  // tinymce v5.x 时，下面的 [blocks,fontsize,fontfamily] 分别对应为 [styleselect,fontsizeselect,fontselect]
  toolbar: [
    'blocks | fontsize | fontfamily | lineheight letterspacing forecolor backcolor | bold italic strikethrough underline | link image media blockquote | bullist numlist | alignleft aligncenter alignright alignjustify | outdent indent | hr | undo redo | indentFirstRow indent2em indent2ends | removeformat'
  ],
  // 快捷工具栏
  // quickbars_selection_toolbar: 'bold italic | fontsize fontfamily | alignleft aligncenter alignright alignjustify | quickimage quicklink',

  // 图片快捷工具栏
  // 默认显示内容为 `alignleft aligncenter alignright` 加上 imagetools_toolbar 配置项设置的项
  quickbars_image_toolbar: 'alignleft aligncenter alignright | imagefullwidth',

  // imageoptions 需要引入 imagetools 插件
  // 默认值: 'rotateleft rotateright | flipv fliph | editimage imageoptions'
  imagetools_toolbar: 'imageoptions', // 配置上面 imageoptions 需要显示的

  placeholder: '请输入内容',
  media_alt_source: false,
  // images_upload_handler: imagesUploadHandler,
  // file_picker_callback: fileUploaderHandler,
  setup: (editor) => {
    // 监听实时输入事件
    editor.on('input change undo redo', () => {
      // const content = editor.getContent()
      // console.log('TinyMCE 实时输入:', content)
    })

    // 监听图片插入事件，自动设置新上传图片的宽度为100%
    // editor.on('SetContent', (e) => {
    //   // 检查内容中是否包含新插入的图片
    //   if (e.content && e.content.includes('<img')) {
    //     // 使用setTimeout确保图片已经插入到DOM中
    //     setTimeout(() => {
    //       const images = editor.dom.select('img')
    //       images.forEach(img => {
    //         // 检查图片是否已经处理过（通过data-processed属性标记）
    //         if (!img.getAttribute('data-processed')) {
    //           // 设置图片宽度为100%，高度自动
    //           editor.dom.setStyle(img, 'width', '100%')
    //           editor.dom.setStyle(img, 'height', 'auto')
    //           // 标记为已处理，避免重复设置
    //           img.setAttribute('data-processed', 'true')
    //         }
    //       })
    //     }, 100)
    //   }
    // })
  }
}

export default {
  name: 'CustomEditor',
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    mergedConfig() {
      return {
        ...DEFAULT_CONFIG,
        ...this.config,
      }
    },
    content: {
      get() {
        return this.value
      },
      set(nv) {
        this.$emit('input', nv)
      }
    }
  },
  mounted() {
    tinymce.init({})
  },
  methods: {
    // 动态调整编辑器高度的方法
    resizeEditor(width, height) {
      const editor = this.$refs.editor?.editor
      if (editor && editor.getContainer()) {
        const minHeight = 400
        if (height < minHeight) {
          height = minHeight
        }
        editor.getContainer().style.height = height + 'px'
        editor.iframeElement.style.height = height + 'px'
        // 触发重新布局
        editor.fire('ResizeEditor')
        console.log(`编辑器高度已调整为: ${height}px`)
      }
    }
  }
}
</script>
