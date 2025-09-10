/**
 * 两端缩进插件
 */
import tinymce from 'tinymce'

// eslint-disable-next-line no-unused-vars
tinymce.PluginManager.add('indent2ends', function (editor, url) {
  const pluginName = '两端缩进'
  const INDENT_OPTIONS_NAME = 'indent2ends_options'
  // 默认的间距，可在 tinymce.init({ INDENT_OPTIONS_NAME: []}) 设置参数
  const defaultOptions = [0, 8, 16, 32, 48]
  let selectIndent = 0 // 选中的选项，默认为0

  const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')
  const indentOptions = editor.getParam(INDENT_OPTIONS_NAME, defaultOptions)

  const doAct = function () {
    const dom = editor.dom
    const blocks = editor.selection.getSelectedBlocks()
    let act = ''
    global$1.each(blocks, function (block) {
      if (act === '') {
        act =
          dom.getStyle(block, 'padding-left') === selectIndent && dom.getStyle(block, 'padding-right') === selectIndent
            ? 'remove'
            : 'add'
      }
      if (act === 'add') {
        dom.setStyle(block, 'padding-left', selectIndent)
        dom.setStyle(block, 'padding-right', selectIndent)
      } else {
        let style = dom.getAttrib(block, 'style')
        const reg = new RegExp('padding-(left | right):[\\s]*' + selectIndent + ';', 'ig')
        style = style.replace(reg, '')
        dom.setAttrib(block, 'style', style)
      }
    })
  }

  editor.ui.registry.getAll().icons.indent2ends ||
    editor.ui.registry.addIcon(
      'indent2ends',
      '<svg t="1720603787138" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="989" width="18" height="18"><path d="M172.78 486.969c15.837 12.614 15.837 36.677 0 49.291L51.138 633.148C30.497 649.588 0 634.891 0 608.503V414.727c0-26.388 30.497-41.086 51.138-24.645l121.642 96.887zM851.218 536.26c-15.837-12.614-15.837-36.677 0-49.291l121.642-96.887c20.641-16.441 51.14-1.743 51.14 24.645v193.776c0 26.388-30.499 41.085-51.14 24.645L851.218 536.26zM0.001 78.385C0.001 56.633 17.634 39 39.386 39h945.229C1006.37 39 1024 56.633 1024 78.385v31.507c0 21.752-17.63 39.385-39.385 39.385H39.385c-21.75 0-39.384-17.633-39.384-39.385V78.385zM236.309 356.704c0-21.752 17.633-39.385 39.384-39.385h472.615c21.752 0 39.385 17.633 39.385 39.385v31.508c0 21.751-17.633 39.384-39.385 39.384H275.693c-21.751 0-39.384-17.633-39.384-39.384v-31.508zM236.309 635.023c0-21.751 17.633-39.384 39.384-39.384h472.615c21.752 0 39.385 17.633 39.385 39.384v31.508c0 21.751-17.633 39.384-39.385 39.384H275.693c-21.751 0-39.384-17.633-39.384-39.384v-31.508zM0.001 913.335c0-21.751 17.633-39.384 39.385-39.384h945.229c21.755 0 39.385 17.633 39.385 39.384v31.508c0 21.752-17.63 39.385-39.385 39.385H39.385c-21.75 0-39.384-17.634-39.384-39.385v-31.508z" fill="#222f3e" p-id="990"></path></svg>'
    )

  editor.ui.registry.addMenuButton('indent2ends', {
    icon: 'indent2ends',
    tooltip: pluginName,
    fetch: callback => {
      const items = indentOptions.map(item => ({
        type: 'togglemenuitem',
        text: `${item}`,
        onAction: () => {
          selectIndent = item
          doAct()
        },
        onSetup: api => {
          const dom = editor.dom
          const blocks = editor.selection.getSelectedBlocks()
          // 选中多个段落，只取首项
          const paddingLeft = dom.getStyle(blocks[0], 'padding-left')
          const paddingRight = dom.getStyle(blocks[0], 'padding-right')

          // 可能两端对齐与缩进同时生效，由于都是通过 padding 实现，所以 padding-left 与 padding-right 不一定相同
          // 暂定方案：若两值不相等，active 为 false; 否则取对应值
          if (paddingLeft !== paddingRight) {
            api.setActive(false)
          } else {
            api.setActive(parseInt(paddingLeft) === item)
          }
          return () => {}
        },
      }))
      callback(items)
    },
  })

  editor.addCommand('indent2ends', doAct)

  return {
    getMetadata: function () {
      return {
        name: 'indent2ends',
      }
    },
  }
})
