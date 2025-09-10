/**
 * 图片全宽插件 - 设置图片宽度为100%
 */
import tinymce from 'tinymce'

// eslint-disable-next-line no-unused-vars
tinymce.PluginManager.add('imagefullwidth', function (editor, url) {
  const pluginName = '图片全宽'

  // 注册图标
  editor.ui.registry.getAll().icons.imagefullwidth ||
    editor.ui.registry.addIcon(
      'imagefullwidth',
      `<svg t="1757495405548" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23107" width="24" height="24"><path d="M98 154v712.4c0 31.4 25.6 57 57 57h712.4c31.4 0 57-25.6 57-57V154c0-31.4-25.6-57-57-57H155c-31.5 0-57 25.5-57 57z m769.4 712.4H155V154l712.4-0.1v712.5z" p-id="23108"></path><path d="M308.5 395.9L218 486.5c-11.6 11.6-11.6 30.4 0 42l95.2 95.2c11.6 11.6 30.4 11.6 42 0s11.6-30.4 0-42l-43.4-43.4h158.6v-59.9H310.1l40.5-40.5c11.6-11.6 11.6-30.4 0-42s-30.4-11.6-42.1 0zM712.1 623.7l90.6-90.6c11.6-11.6 11.6-30.4 0-42l-95.2-95.2c-11.6-11.6-30.4-11.6-42 0s-11.6 30.4 0 42l43.4 43.4H550.3v59.9h160.2L670 581.7c-11.6 11.6-11.6 30.4 0 42s30.5 11.6 42.1 0z" p-id="23109"></path></svg>`
    )

  // 添加命令 - 参考alignleft命令的实现方式
  editor.addCommand('imagefullwidth', function () {
    const selectedNode = editor.selection.getNode()
    if (selectedNode && selectedNode.nodeName === 'IMG') {
      const currentWidth = editor.dom.getStyle(selectedNode, 'width')
      const isFullWidth = currentWidth === '100%'

      if (isFullWidth) {
        // 移除宽度样式，恢复原始尺寸
        editor.dom.setStyle(selectedNode, 'width', '')
      } else {
        // 设置图片宽度为100%
        editor.dom.setStyle(selectedNode, 'width', '100%')
      }

      // 触发内容变化事件
      editor.fire('change', {})
    }
  })

  // 添加按钮 - 参考alignleft按钮的实现方式
  editor.ui.registry.addToggleButton('imagefullwidth', {
    icon: 'imagefullwidth',
    tooltip: pluginName,
    onAction: function () {
      return editor.execCommand('imagefullwidth')
    },
    onSetup: function (buttonApi) {
      // 参考alignleft的onSetup实现
      const onNodeChange = function () {
        const selectedNode = editor.selection.getNode()
        const isActive =
          selectedNode && selectedNode.nodeName === 'IMG' && editor.dom.getStyle(selectedNode, 'width') === '100%'

        buttonApi.setActive(isActive)
      }

      onNodeChange()

      editor.on('NodeChange', onNodeChange)
      return function () {
        editor.off('NodeChange', onNodeChange)
      }
    },
  })

  // 添加菜单项
  editor.ui.registry.addMenuItem('imagefullwidth', {
    text: pluginName,
    onAction: function () {
      return editor.execCommand('imagefullwidth')
    },
  })

  return {
    getMetadata: function () {
      return {
        name: 'imagefullwidth',
        longname: '图片全宽插件',
        author: 'Custom Editor',
        version: '1.0.0',
      }
    },
  }
})
