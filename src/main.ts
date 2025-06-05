import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { i18n, useLanguage } from './i18n'

// 初始化语言设置
const { initLanguage } = useLanguage()
initLanguage()

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.use(i18n)

app.mount('#app')
