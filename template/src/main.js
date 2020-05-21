import singleSpaVue, {setPath} from 'single-spa-vue-mfe'
setPath('<%=appName%>')
import Vue from 'vue';

import App from './App.vue';<% if (usesRouter) { %>
import router from './router';<% } %>

Vue.config.productionTip = false;


const options = {
  <% if (usesRouter) { %>router,<% } %>
  render: (h <% if(isTs) {%>: Function<% } %>) => h(App),
}

// 独立渲染
export const render = function() {
  new Vue(options).$mount('#app')
}
// 微前端模式
export const vueLifeCycles = ({ el } <% if(isTs) {%>: any<% } %>) => {
  return singleSpaVue({
    Vue,
    appOptions: { ...options, el },
  })
}
if (!<% if(isTs) {%>(<any>window)<% } else {%>window<%} %>.__SINGLE_SPA_MFE__) {
  render()
}

