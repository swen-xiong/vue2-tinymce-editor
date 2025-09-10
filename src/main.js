import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

// 使用 Element UI
Vue.use(ElementUI)

console.log('Vue 应用正在启动...')

new Vue({
  render: h => h(App),
  mounted() {
    console.log('Vue 应用已挂载到 DOM')
  }
}).$mount('#app')
